from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from common.response import success, failure
from common.utils import generate_short_code
from .models import CouponPolicy
from stores.models import Store
from partnerships.models import Partnership
from django.db.models import Q
from django.utils import timezone
from django.db import models
from datetime import timedelta
from accounts.models import ConsumerUser


class CouponPolicyView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            store = Store.objects.get(owner=request.user)
        except Store.DoesNotExist:
            return Response(failure(message="가게 정보가 없습니다."), status=404)

        try:
            policy = CouponPolicy.objects.get(store=store)
        except CouponPolicy.DoesNotExist:
            return Response(failure(message="등록된 쿠폰 정책이 없습니다."), status=404)

        serializer = CouponPolicySerializer(policy)
        return Response(success(data=serializer.data, message="쿠폰 정책 조회에 성공했습니다."))


    def post(self, request):
        serializer = CouponPolicyCreateSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            policy = serializer.save()
            return Response(success(
                message="쿠폰 정책이 생성되었습니다.",
                data={"id": policy.id}
            ))
        return Response(failure(
            data=serializer.errors,
            message="쿠폰 정책이 생성에 실패했습니다.",
            error_code="COUPON_POLICY_CREATE_FAILED"
        ), status=status.HTTP_400_BAD_REQUEST)


    def patch(self, request):
        user = request.user

        # 1. 내 가게 찾기
        try:
            store = Store.objects.get(owner=user)
        except Store.DoesNotExist:
            return Response(
                failure(data={"store": "가게 정보가 존재하지 않습니다."}),
                status=status.HTTP_404_NOT_FOUND,
            )

        # 2. 내 가게 쿠폰 정책 조회 (MVP: 1개 고정)
        policy = CouponPolicy.objects.filter(store=store).first()
        if not policy:
            return Response(
                failure(data={"coupon_policy": "쿠폰 정책이 존재하지 않습니다."}),
                status=status.HTTP_404_NOT_FOUND,
            )

        # 3. 제휴 여부 확인 → active 또는 요청 상태면 수정 불가
        has_partnership = Partnership.objects.filter(
            Q(store_a=store) | Q(store_b=store),
            status__in=["active", "pending"]   # ← 실제 enum 값에 맞게 수정
        ).exists()

        if has_partnership:
            return Response(
                failure(data={"already_working": "제휴 진행 중이거나 제휴 요청 상태에서는 쿠폰 정책을 수정할 수 없습니다."}),
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 4. serializer로 부분 업데이트
        serializer = CouponPolicyUpdateSerializer(policy, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                success(data=serializer.data, message="쿠폰 정책 수정 성공"),
                status=status.HTTP_200_OK,
            )

        return Response(
            failure(data=serializer.errors),
            status=status.HTTP_400_BAD_REQUEST,
        )
    

class CouponIssueView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        slug = request.data.get("slug")
        if not slug:
            return Response(
                failure(message="slug 값이 필요합니다."),
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not isinstance(request.user, ConsumerUser):
            return Response(
                failure(message="소비자 계정만 쿠폰을 발급받을 수 있습니다."),
                status=status.HTTP_403_FORBIDDEN,
            )

        partnership = Partnership.objects.filter(
            models.Q(slug_for_a=slug) | models.Q(slug_for_b=slug),
            status="active",
        ).first()

        if not partnership:
            return Response(
                failure(message="유효하지 않은 제휴입니다."),
                status=status.HTTP_404_NOT_FOUND,
            )

        if slug == partnership.slug_for_a:
            target_store = partnership.store_b
        else:
            target_store = partnership.store_a

        policy = CouponPolicy.objects.filter(store=target_store, is_active=True).first()
        if not policy:
            return Response(
                failure(message="발급 가능한 쿠폰 정책이 없습니다."),
                status=status.HTTP_400_BAD_REQUEST,
            )

        today = timezone.now().date()

        existing_coupon = Coupon.objects.filter(
            user=request.user,
            partnership_slug=slug,
            issued_at__date=today,
        ).first()

        if existing_coupon:
            serializer = CouponSerializer(existing_coupon)
            return Response(
                success(
                    data={"coupon": serializer.data},
                    message="오늘 이미 발급된 쿠폰이 있습니다.",
                ),
                status=status.HTTP_200_OK,
            )

        coupon = Coupon.objects.create(
            user=request.user,
            policy=policy,
            short_code=generate_short_code(),
            partnership_slug=slug,          # ← 핵심
            expired_at=timezone.now() + timedelta(hours=24),
        )

        serializer = CouponSerializer(coupon)
        return Response(
            success(data={"coupon": serializer.data}, message="쿠폰 발급 성공"),
            status=status.HTTP_201_CREATED,
        )



class CouponUseView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        short_code = request.data.get("short_code")
        if not short_code:
            return Response(
                failure(message="쿠폰 코드가 필요합니다."),
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ConsumerUser 확인
        if not isinstance(request.user, ConsumerUser):
            return Response(
                failure(message="소비자 계정만 쿠폰을 사용할 수 있습니다."),
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            coupon = Coupon.objects.get(short_code=short_code, user=request.user)
        except Coupon.DoesNotExist:
            return Response(
                failure(message="해당 쿠폰을 찾을 수 없습니다."),
                status=status.HTTP_404_NOT_FOUND,
            )

        # 상태 검사
        if coupon.status != "active":
            return Response(
                failure(message="이미 사용되었거나 만료된 쿠폰입니다."),
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 만료 여부 확인
        if coupon.expired_at and coupon.expired_at < timezone.now():
            coupon.status = "expired"
            coupon.save(update_fields=["status"])
            return Response(
                failure(message="쿠폰이 만료되었습니다."),
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 사용 처리
        coupon.status = "used"
        coupon.used_at = timezone.now()
        coupon.save(update_fields=["status", "used_at"])

        serializer = CouponSerializer(coupon)
        return Response(
            success(data={"coupon": serializer.data}, message="쿠폰이 사용되었습니다."),
            status=status.HTTP_200_OK,
        )
    

