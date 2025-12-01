from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from common.enums import ProposalStatus
from common.s3 import generate_presigned_url
from common.response import success, failure
from .models import Proposal, Partnership
from coupons.models import Coupon
from .serializers import *
from rest_framework import status
from django.db.models import Count, Q
import qrcode
import io
import boto3
from django.db.models.functions import TruncDate
from datetime import timedelta
from django.utils import timezone


class ProposalCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ProposalCreateSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            proposal = serializer.save()
            return Response(success(data={"proposal_id": proposal.id}, message="제휴 요청 전송에 성공했습니다."))
        return Response(failure(message="제휴 요청 전송에 실패했습니다.", data=serializer.errors))


class ProposalCancelView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ProposalCancelSerializer(data=request.data, context={"request": request})
        if not serializer.is_valid():
            return Response(failure(message="제휴 제안 취소에 실패했습니다.", data=serializer.errors), status=400)

        proposal = serializer.validated_data["proposal"]
        proposal.status = ProposalStatus.CANCELLED.value
        proposal.save()

        return Response(success(message="제휴 제안이 취소되었습니다."))


class ProposalActionView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, pk):
        try:
            proposal = Proposal.objects.get(pk=pk)
        except Proposal.DoesNotExist:
            return Response(failure("해당 제안이 존재하지 않습니다."), status=404)

        serializer = ProposalActionSerializer(data=request.data, context={"proposal": proposal})

        if not serializer.is_valid():
            return Response(failure("유효하지 않은 선택입니다.", serializer.errors), status=400)

        try:
            message = serializer.perform_action()
        except serializers.ValidationError as e:
            error_detail = e.detail
            if isinstance(error_detail, list):
                error_message = error_detail[0]
            elif isinstance(error_detail, dict):
                error_message = next(iter(error_detail.values()))[0]
            else:
                error_message = str(error_detail)
            
            return Response(failure(message=error_message), status=400)

        return Response(success(message=message))


class QRCodeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # 사장님 → 가게
        try:
            store = Store.objects.get(owner=user)
        except Store.DoesNotExist:
            return Response(
                failure(message="가게 정보가 존재하지 않습니다."),
                status=404,
            )

        # 내 가게가 참여한 활성 파트너쉽 조회
        partnership = Partnership.objects.filter(
            status="active"
        ).filter(
            models.Q(store_a=store) | models.Q(store_b=store)
        ).first()

        if not partnership:
            return Response(
                failure(message="활성화된 제휴가 없습니다."),
                status=404
            )

        # 🔥 slug / partner_slug 구분
        if store == partnership.store_a:
            my_slug = partnership.slug_for_a
            partner_slug = partnership.slug_for_b
        else:
            my_slug = partnership.slug_for_b
            partner_slug = partnership.slug_for_a

        # S3 Key (내 slug로 QR 생성)
        bucket_name = settings.AWS_S3_BUCKET
        key = f"qrcodes/{my_slug}.png"
        s3_client = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION,
        )

        # 존재 여부 확인
        try:
            s3_client.head_object(Bucket=bucket_name, Key=key)
            exists = True
        except s3_client.exceptions.ClientError:
            exists = False

        # 없으면 생성 후 업로드
        if not exists:
            qr_img = qrcode.make(f"{settings.APP_BASE_URL}/issue/{my_slug}")
            buffer = io.BytesIO()
            qr_img.save(buffer, format="PNG")
            buffer.seek(0)

            s3_client.upload_fileobj(
                buffer,
                bucket_name,
                key,
                ExtraArgs={"ContentType": "image/png"}
            )

        # presigned URL
        qr_url = generate_presigned_url(key)

        serializer = QRCodeSerializer({
            "partnership_id": partnership.id,
            "slug": my_slug,               # 기존 필드 (QR 이미지용)
            "partner_slug": partner_slug,  # 추가된 필드 (통계 이동용)
            "qr_code_url": qr_url
        })

        return Response(
            success(
                data=serializer.data,
                message="QR 이미지 조회 성공"
            )
        )

class MyProposalsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        store = request.user.store
        sent = Proposal.objects.filter(proposer_store=store)
        received = Proposal.objects.filter(recipient_store=store)

        data = {
            "sent": [
                {
                    "id": p.id,
                    "recipient_store": p.recipient_store.name,
                    "status": p.status,
                    "created_at": p.created_at,
                }
                for p in sent
            ],
            "received": [
                {
                    "id": p.id,
                    "proposer_store": p.proposer_store.name,
                    "status": p.status,
                    "created_at": p.created_at,
                }
                for p in received
            ],
        }
        return Response(success(data=data, message="내 제안 목록 조회 성공"))
    

class PartnershipStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        slug = request.query_params.get("slug")
        range_param = request.query_params.get("range", "7d")

        if not slug:
            return Response(
                failure(
                    message="서버와의 문제가 발생했습니다.",
                    data={"global": "slug 값이 필요합니다."}
                ),
                status=status.HTTP_400_BAD_REQUEST
            )

        # 선택 기간
        days = 30 if range_param == "30d" else 7

        # 1) Partnership 매칭
        partnership = Partnership.objects.filter(
            Q(slug_for_a=slug) | Q(slug_for_b=slug),
            status="active"
        ).first()

        if not partnership:
            return Response(
                failure(
                    message="서버와의 문제가 발생했습니다.",
                    data={"global": "유효하지 않은 제휴입니다."}
                ),
                status=status.HTTP_404_NOT_FOUND
            )

        # 🔐 2) 접근 권한 확인 (본인 제휴인지)
        owner_store = getattr(request.user, "store", None)

        if owner_store is None:
            return Response(
                failure(
                    message="서버와의 문제가 발생했습니다.",
                    data={"global": "사장님 계정만 접근할 수 있습니다."}
                ),
                status=status.HTTP_403_FORBIDDEN
            )

        # owner = store_a → 허용 slug = slug_for_b
        # owner = store_b → 허용 slug = slug_for_a
        if owner_store == partnership.store_a:
            allowed_slug = partnership.slug_for_b
        else:
            allowed_slug = partnership.slug_for_a

        # 입력된 slug가 허용 slug가 아니면 접근 불가
        if slug != allowed_slug:
            return Response(
                failure(
                    message="서버와의 문제가 발생했습니다.",
                    data={"global": "해당 제휴 통계에 접근할 권한이 없습니다."}
                ),
                status=status.HTTP_403_FORBIDDEN
            )

        # 본인 제휴가 아니면 차단
        if partnership.store_a != owner_store and partnership.store_b != owner_store:
            return Response(
                failure(
                    message="서버와의 문제가 발생했습니다.",
                    data={"global": "해당 제휴 통계에 접근할 권한이 없습니다."}
                ),
                status=status.HTTP_403_FORBIDDEN
            )

        # 🔥 여기까지 왔으면 본인 제휴 slug임 → 정상 처리

        now = timezone.now()
        start_date = now - timedelta(days=days)
        days_30 = now - timedelta(days=30)
        days_7 = now - timedelta(days=7)

        # 3) 제휴별 쿠폰 전체 (summary 용)
        all_coupons = Coupon.objects.filter(partnership_slug=slug)

        # ----- SUMMARY: 전체 기간 -----
        total_issued = all_coupons.count()
        total_used = all_coupons.filter(status="used").count()

        issued_30 = all_coupons.filter(issued_at__gte=days_30).count()
        used_30 = all_coupons.filter(status="used", used_at__gte=days_30).count()

        issued_7 = all_coupons.filter(issued_at__gte=days_7).count()
        used_7 = all_coupons.filter(status="used", used_at__gte=days_7).count()

        def rate(i, u):
            return round((u / i) * 100, 1) if i else 0

        # ----- DAILY: 최근 days -----
        range_coupons = all_coupons.filter(
            issued_at__date__gte=start_date.date()
        )

        issued_qs = range_coupons.annotate(
            date=TruncDate("issued_at")
        ).values("date").annotate(
            issued=Count("id")
        )

        used_qs = range_coupons.filter(
            status="used"
        ).annotate(
            date=TruncDate("used_at")
        ).values("date").annotate(
            used=Count("id")
        )

        issued_map = {row["date"]: row["issued"] for row in issued_qs}
        used_map = {row["date"]: row["used"] for row in used_qs}

        daily = []
        for i in range(days):
            d = (start_date + timedelta(days=i)).date()
            daily.append({
                "date": str(d),
                "issued": issued_map.get(d, 0),
                "used": used_map.get(d, 0),
                "conversion_rate": rate(
                    issued_map.get(d, 0),
                    used_map.get(d, 0)
                ),
            })

        return Response(
            success(
                data={
                    "partnership": {
                        "slug": slug,
                        "store_a": partnership.store_a.name,
                        "store_b": partnership.store_b.name,
                    },
                    "summary": {
                        "total": {
                            "issued": total_issued,
                            "used": total_used,
                            "conversion_rate": rate(total_issued, total_used),
                        },
                        "last_30_days": {
                            "issued": issued_30,
                            "used": used_30,
                            "conversion_rate": rate(issued_30, used_30),
                        },
                        "last_7_days": {
                            "issued": issued_7,
                            "used": used_7,
                            "conversion_rate": rate(issued_7, used_7),
                        },
                    },
                    "daily_range": days,
                    "daily": daily
                }
            ),
            status=status.HTTP_200_OK
        )
