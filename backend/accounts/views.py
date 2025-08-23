from rest_framework.views import APIView
from rest_framework.response import Response
from utils.response import success, failure
from .services import send_verification_code, verify_code_and_get_or_create_user
from .tokens import issue_tokens_for_user
from rest_framework import status
from .serializers import VerifyCodeSerializer, OwnerSignupSerializer, OwnerLoginSerializer
from accounts.throttles import DailyPhoneNumberThrottle
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenRefreshView
from accounts.models import RefreshToken as StoredRefreshToken
from rest_framework_simplejwt.tokens import RefreshToken as SimpleRefreshToken
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.exceptions import InvalidToken
from django.utils import timezone

class RequestCodeView(APIView):
    throttle_classes = [DailyPhoneNumberThrottle]
    def post(self, request):
        phone_number = request.data.get("phone_number")

        if not phone_number:
            return Response(failure(
                message="전화번호는 필수입니다.",
                error_code="VALIDATION_ERROR"
            ), status=400)

        try:
            send_verification_code(phone_number)
            return Response(success(message="인증번호가 전송되었습니다."), status=200)

        except Exception as e:
            return Response(failure(
                message=str(e),
                error_code="SMS_SEND_FAILED"
            ), status=500)


class VerifyCodeView(APIView):
    throttle_classes = []

    def post(self, request):
        serializer = VerifyCodeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone_number = serializer.validated_data["phone_number"]
        code = serializer.validated_data["code"]

        try:
            user, _ = verify_code_and_get_or_create_user(phone_number, code)
            tokens = issue_tokens_for_user(user, request=request, session_scope="guest")

            data = {
                "user": {
                    "id": user.id,
                    "phone_number": user.phone_number,
                    "role": getattr(user, "role", "guest"),
                },
                "tokens": tokens,
            }
            return Response(success(data=data, message="인증 성공"), status=status.HTTP_200_OK)
        except Exception as e:
            return Response(failure(message=str(e), error_code="VALIDATION_ERROR"), status=400)

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        data = {
            "id": user.id,
            "phone_number": user.phone_number,
            "role": user.role,
        }
        return Response(success(data=data, message="사용자 정보가 반환되었습니다."))
    

class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            raise AuthenticationFailed("refresh 토큰이 필요합니다.")

        try:
            token_obj = StoredRefreshToken.objects.get(token=refresh_token)

            if token_obj.revoked:
                raise AuthenticationFailed("해당 토큰은 로그아웃되어 사용할 수 없습니다.")
            if token_obj.expires_at < timezone.now():
                raise AuthenticationFailed("해당 토큰은 만료되었습니다.")

        except StoredRefreshToken.DoesNotExist:
            raise AuthenticationFailed("유효하지 않은 토큰입니다.")

        try:
            decoded_token = SimpleRefreshToken(refresh_token)
            role_in_token = decoded_token.get("role", None)
        except Exception:
            raise AuthenticationFailed("refresh 토큰 디코딩 실패")

        if token_obj.session_scope != role_in_token:
            raise AuthenticationFailed("토큰 역할이 일치하지 않습니다.")

        try:
            response = super().post(request, *args, **kwargs)
            if response.status_code == 200:
                return Response(success(data=response.data, message="토큰 재발급 성공"))
            return Response(failure(message="토큰 재발급 실패", data=response.data), status=response.status_code)
        except InvalidToken as e:
            return Response(failure(message="유효하지 않은 토큰입니다.", data=e.detail), status=401)


    
class LogoutView(APIView):
    permission_classes = []

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response(failure("refresh 토큰이 필요합니다.", "VALIDATION_ERROR"), status=400)

        try:
            token_obj = StoredRefreshToken.objects.get(token=refresh_token)
            token_obj.revoked = True
            token_obj.save()
            return Response(success(message="해당 기기에서 로그아웃되었습니다."))
        except StoredRefreshToken.DoesNotExist:
            return Response(failure("등록되지 않은 refresh 토큰입니다.", "INVALID_REFRESH"), status=400)

        

class OwnerSignupView(APIView):
    def post(self, request):
        serializer = OwnerSignupSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.save()
            return Response(success(data=data, message="사장님 회원가입이 완료되었습니다."))
        return Response(failure(message="회원가입에 실패했습니다.", data=serializer.errors))
    



class OwnerLoginView(APIView):
    def post(self, request):
        serializer = OwnerLoginSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            data = serializer.save()
            return Response(success(data=data, message="로그인에 성공했습니다."))
        return Response(failure(message="로그인에 실패했습니다.", data=serializer.errors))