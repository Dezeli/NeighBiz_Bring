from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from accounts.models import OwnerUser, ConsumerUser

class CustomJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        user_id = validated_token.get("user_id")
        role = validated_token.get("role")

        if user_id is None or role is None:
            raise AuthenticationFailed("토큰에 사용자 식별자가 포함되어 있지 않습니다.")

        try:
            if role == "owner":
                return OwnerUser.objects.get(id=user_id)
            elif role == "consumer":
                return ConsumerUser.objects.get(id=user_id)
        except (OwnerUser.DoesNotExist, ConsumerUser.DoesNotExist):
            raise AuthenticationFailed("해당 사용자가 존재하지 않습니다.")

        raise AuthenticationFailed("유효하지 않은 사용자 유형입니다.")
