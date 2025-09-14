from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from common.enums import ProposalStatus
from common.s3 import generate_presigned_url
from common.response import success, failure
from .models import Proposal
from .serializers import *
import qrcode
import io
import boto3


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

        # 가게 기준으로 slug 선택
        if store == partnership.store_a:
            slug = partnership.slug_for_a
        else:
            slug = partnership.slug_for_b

        # S3 Key
        bucket_name = settings.AWS_S3_BUCKET
        key = f"qrcodes/{slug}.png"
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
            qr_img = qrcode.make(f"{settings.APP_BASE_URL}/issue/{slug}")
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
            "slug": slug,
            "qr_code_url": qr_url
        })

        return Response(success(data=serializer.data, message="QR 이미지 조회 성공"))
