from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from datetime import timedelta

from .serializers import RequestCodeSerializer, VerifyCodeSerializer, OwnerSignupSerializer
from accounts.models import PhoneVerification
from common.response import success, failure
from common.utils import generate_verification_code
from common.solapi import send_sms


class RequestCodeView(APIView):
    permission_classes = []  # 토큰 요구 X

    def post(self, request):
        serializer = RequestCodeSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                failure(
                    message="입력값이 유효하지 않습니다.",
                    data=serializer.errors
                ),
                status=status.HTTP_400_BAD_REQUEST
            )

        phone_number = serializer.validated_data["phone_number"]
        code = generate_verification_code()
        expires_at = timezone.now() + timedelta(minutes=5)

        try:
            message = f"[NeighBiz] 인증번호는 [{code}]입니다."
            send_sms(phone_number, message)
        except Exception as e:
            return Response(
                failure(
                    message="인증번호 전송에 실패했습니다.",
                    data={"error": str(e)},
                    error_code="SMS_SEND_FAILED"
                ),
                status=500
            )

        PhoneVerification.objects.update_or_create(
            phone_number=phone_number,
            defaults={
                "code": code,
                "expires_at": expires_at,
                "is_verified": False,
                "verified_at": None,
            }
        )

        return Response(success(message="인증번호가 발송되었습니다."))
    

class VerifyCodeView(APIView):
    permission_classes = []  # 토큰 요구 X

    def post(self, request):
        serializer = VerifyCodeSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                failure(message="입력값이 유효하지 않습니다.", data=serializer.errors),
                status=status.HTTP_400_BAD_REQUEST
            )

        phone_number = serializer.validated_data["phone_number"]
        code = serializer.validated_data["code"]

        try:
            verification = PhoneVerification.objects.get(phone_number=phone_number)
        except PhoneVerification.DoesNotExist:
            return Response(
                failure(message="인증 요청 내역이 없습니다."),
                status=status.HTTP_400_BAD_REQUEST
            )

        if verification.is_verified:
            return Response(
                failure(message="이미 인증된 번호입니다."),
                status=status.HTTP_400_BAD_REQUEST
            )

        if verification.expires_at < timezone.now():
            return Response(
                failure(message="인증번호가 만료되었습니다."),
                status=status.HTTP_400_BAD_REQUEST
            )

        if verification.code != code:
            return Response(
                failure(message="인증번호가 일치하지 않습니다."),
                status=status.HTTP_400_BAD_REQUEST
            )

        verification.is_verified = True
        verification.verified_at = timezone.now()
        verification.save()

        return Response(success(message="인증이 완료되었습니다."))
    


class OwnerSignupView(APIView):
    permission_classes = [] # 토큰 요구 x

    def post(self, request):
        serializer = OwnerSignupSerializer(data=request.data)
        if serializer.is_valid():
            owner = serializer.save()
            store = owner.store
            return Response(success(
                message="회원가입이 완료되었습니다.",
                data={
                    "owner_id": owner.id,
                    "store_id": store.id
                }
            ), status=status.HTTP_201_CREATED)

        return Response(failure(
            message="입력값이 유효하지 않습니다.",
            data=serializer.errors
        ), status=status.HTTP_400_BAD_REQUEST)