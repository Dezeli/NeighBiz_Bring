from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from common.response import success, failure
from .models import CouponPolicy
from stores.models import Store

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

    
