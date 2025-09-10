from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import timedelta

from .serializers import *
from stores.serializers import StoreProfileSerializer
from stores.models import Store
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
                    message="인증번호 전송에 실패했습니다.",
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
            message="회원가입에 실패했습니다.",
            data=serializer.errors
        ), status=status.HTTP_400_BAD_REQUEST)


class OwnerLoginView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = OwnerLoginSerializer(data=request.data)
        if serializer.is_valid():
            return Response(success(
                message="로그인에 성공했습니다.",
                data=serializer.validated_data
            ))
        return Response(failure(
            message="로그인에 실패했습니다.",
            data=serializer.errors,
            error_code="LOGIN_FAILED"
        ), status=status.HTTP_400_BAD_REQUEST)
    

class RefreshTokenView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = RefreshTokenSerializer(data=request.data)
        if serializer.is_valid():
            return Response(success(
                message="Access 토큰이 재발급되었습니다.",
                data=serializer.validated_data
            ))
        return Response(failure(
            message="토큰 재발급에 실패했습니다.",
            data=serializer.errors,
            error_code="REFRESH_FAILED"
        ), status=status.HTTP_400_BAD_REQUEST)
    

class LogoutView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        if serializer.is_valid():
            return Response(success(message="로그아웃되었습니다."))
        return Response(failure(
            message="로그아웃에 실패했습니다.",
            data=serializer.errors,
            error_code="LOGOUT_FAILED"
        ), status=400)
    

class FindUsernameView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = FindUsernameSerializer(data=request.data)
        if serializer.is_valid():
            return Response(success(
                message="아이디 찾기에 성공했습니다.",
                data=serializer.validated_data
            ))
        return Response(failure(
            data=serializer.errors,
            message="아이디 찾기에 실패했습니다.",
            error_code="FIND_USERNAME_FAILED"
        ), status=400)
    

class ResetPasswordView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            return Response(success(
                message="임시 비밀번호가 발급되었습니다. 로그인 후 반드시 변경해주세요.",
                data=serializer.validated_data
            ))
        return Response(failure(
            data=serializer.errors,
            message="비밀번호 재설정에 실패했습니다.",
            error_code="RESET_PASSWORD_FAILED"
        ), status=400)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response(success(
                message="비밀번호가 성공적으로 변경되었습니다.",
                data={}
            ))
        return Response(failure(
            data=serializer.errors,
            message="비밀번호 변경에 실패했습니다.",
            error_code="CHANGE_PASSWORD_FAILED"
        ), status=400)


class OwnerVerifyView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = OwnerVerifySerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response(success(
                message="사장님 인증에 성공했습니다.",
                data={}
            ))
        return Response(failure(
            data=serializer.errors,
            message="사장님 인증에 실패했습니다.",
            error_code="OWNER_VERIFY_FAILED"
        ), status=400)


class OwnerLicenseImageUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = request.user
        serializer = OwnerLicenseImageUpdateSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(success(message="사업자등록증 이미지가 업데이트되었습니다."))
        return Response(failure(message="사업자등록증 이미지 수정에 실패했습니다.", data=serializer.errors))
    


class OwnerProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            store = Store.objects.get(owner=user)
        except Store.DoesNotExist:
            return Response(
                failure(message="가게 정보가 존재하지 않습니다."),
                status=status.HTTP_404_NOT_FOUND,
            )

        data = {
            "owner": OwnerProfileSerializer(user).data,
            "store": StoreProfileSerializer(store).data,
        }
        return Response(success(data=data, message="사장님 정보 조회 성공"))