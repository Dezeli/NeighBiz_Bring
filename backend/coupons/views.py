from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from utils.response import success, failure
from .serializers import CouponPolicySerializer
from django.utils import timezone
from partnerships.models import Partnership
from coupons.models import Coupon, CouponPolicy
from uuid import uuid4
from events.utils import log_event


class CouponPolicyCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CouponPolicySerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            policy = serializer.save()
            return Response(success(data={"id": policy.id}, message="쿠폰 정책이 등록되었습니다."))
        return Response(failure(message="유효하지 않은 입력입니다.", data=serializer.errors))


class CouponIssueView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, slug):
        user = request.user

        try:
            partnership = Partnership.objects.get(slug_for_a=slug)
            issuer = partnership.merchant_a  # QR 찍은 쪽
            receiver = partnership.merchant_b  # 쿠폰 혜택 제공 쪽
        except Partnership.DoesNotExist:
            try:
                partnership = Partnership.objects.get(slug_for_b=slug)
                issuer = partnership.merchant_b
                receiver = partnership.merchant_a
            except Partnership.DoesNotExist:
                return Response(failure(message="유효하지 않은 QR입니다."), status=400)

        if partnership.status != "active":
            return Response(failure(message="이미 종료된 제휴입니다."), status=400)

        existing_coupon = Coupon.objects.filter(
            user=user,
            policy__partnership=partnership
        ).first()

        if existing_coupon:
            policy = existing_coupon.policy
            data = {
                "coupon_id": existing_coupon.id,
                "status": existing_coupon.status,
                "issued_at": existing_coupon.issued_at,
                "partner_store": policy.merchant.name,
                "description": policy.description,
            }
            return Response(success(data=data, message="이미 발급된 쿠폰입니다."))

        try:
            policy = CouponPolicy.objects.get(merchant=receiver, partnership=partnership)
        except CouponPolicy.DoesNotExist:
            return Response(failure("상대 가게의 쿠폰 정책이 존재하지 않습니다."), status=404)

        if policy.total_limit is not None:
            total_count = Coupon.objects.filter(policy=policy).count()
            if total_count >= policy.total_limit:
                return Response(failure("쿠폰 총 발급 한도 초과"), status=400)

        if policy.daily_limit is not None:
            today = timezone.now().date()
            daily_count = Coupon.objects.filter(policy=policy, issued_at__date=today).count()
            if daily_count >= policy.daily_limit:
                return Response(failure("오늘 쿠폰 발급 한도를 초과했습니다."), status=400)

        coupon = Coupon.objects.create(
            user=user,
            policy=policy,
            short_code=str(uuid4())[:8],
            slug=str(uuid4())[:12],
            status="active",
            issued_at=timezone.now()
        )

        log_event("coupon_issued", coupon, user=user, request=request)

        data = {
            "coupon_id": coupon.id,
            "status": coupon.status,
            "issued_at": coupon.issued_at,
            "partner_store": receiver.name,
            "description": policy.description,
        }

        return Response(success(data=data, message="쿠폰이 발급되었습니다."))

        

class CouponUseView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, coupon_id):
        user = request.user

        try:
            coupon = Coupon.objects.get(id=coupon_id)
        except Coupon.DoesNotExist:
            return Response(failure(message="쿠폰을 찾을 수 없습니다."), status=404)

        if coupon.user != user:
            return Response(failure(message="이 쿠폰은 사용자의 것이 아닙니다."), status=403)

        if coupon.status != "active":
            return Response(failure(message="이 쿠폰은 이미 사용되었거나 만료되었습니다."), status=400)

        coupon.status = "used"
        coupon.used_at = timezone.now()
        coupon.save()
        log_event("coupon_used", coupon, user=user, request=request)
        return Response(success(message="쿠폰이 성공적으로 사용되었습니다."))