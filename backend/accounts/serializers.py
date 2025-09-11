from rest_framework import serializers
from django.db import transaction
from .models import OwnerUser, OwnerRefreshToken, ConsumerRefreshToken
from stores.serializers import StoreSignupSerializer
from rest_framework.validators import UniqueValidator
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from datetime import timedelta, timezone
from django.utils import timezone
from jwt import decode as jwt_decode
from django.conf import settings
from common.utils import generate_temp_password


class RequestCodeSerializer(serializers.Serializer):
    phone_number = serializers.CharField(
        max_length=20,
        error_messages={
            "required": "휴대폰 번호를 입력해주세요.",
            "blank": "휴대폰 번호를 입력해주세요.",
            "max_length": "올바른 형식의 휴대폰 번호를 입력해주세요.",
        }
    )

    def validate_phone_number(self, value):
        if not value.startswith("010"):
            raise serializers.ValidationError("올바른 형식의 휴대폰 번호를 입력해주세요.")
        if not value.isdigit():
            raise serializers.ValidationError("올바른 형식의 휴대폰 번호를 입력해주세요.")
        return value


class VerifyCodeSerializer(serializers.Serializer):
    phone_number = serializers.CharField(
        max_length=20,
        error_messages={
            "required": "휴대폰 번호는 필수입니다.",
            "blank": "휴대폰 번호를 입력해주세요.",
            "max_length": "올바른 형식의 휴대폰 번호를 입력해주세요.",
        }
    )
    code = serializers.CharField(
        max_length=6,
        error_messages={
            "required": "인증번호는 필수입니다.",
            "blank": "인증번호를 입력해주세요.",
            "max_length": "6자리 인증번호를 입력해주세요.",
        }
    )


class OwnerSignupSerializer(serializers.ModelSerializer):
    store = StoreSignupSerializer()

    class Meta:
        model = OwnerUser
        fields = ["username", "password", "name", "phone_number", "business_license_image", "store"]

    username = serializers.CharField(
        max_length=30,
        validators=[UniqueValidator(
            queryset=OwnerUser.objects.all(),
            message="이미 사용 중인 아이디입니다."
        )]
    )
    
    def validate_phone_number(self, value):
        if not value.startswith("010") or len(value) != 11:
            raise serializers.ValidationError("휴대폰 번호 형식이 올바르지 않습니다.")
        return value

    def create(self, validated_data):
        store_data = validated_data.pop("store")
        password = validated_data.pop("password")

        with transaction.atomic():
            owner = OwnerUser(**validated_data)
            owner.set_password(password)
            owner.is_active = True
            owner.is_verified = False
            owner.save()

            StoreSignupSerializer().create({**store_data, "owner": owner})

        return owner
    

class OwnerLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    device_info = serializers.CharField(required=True)

    def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")
        device_info = attrs.get("device_info")

        user = authenticate(username=username, password=password)

        if not user or not isinstance(user, OwnerUser):
            raise serializers.ValidationError("아이디 또는 비밀번호가 올바르지 않습니다.")

        if not user.is_active:
            raise serializers.ValidationError("비활성화된 계정입니다.")

        # JWT 토큰 발급
        refresh = RefreshToken.for_user(user)
        refresh["role"] = "owner"
        access = refresh.access_token
        access["role"] = "owner"

        # DB에 refresh 저장
        OwnerRefreshToken.objects.create(
            user=user,
            token=str(refresh),
            device_info=device_info,
            expires_at=timezone.now() + timedelta(days=30)  # 30일 유효
        )

        user.last_login = timezone.now()
        user.save(update_fields=["last_login"])

        return {
            "access": str(access),
            "refresh": str(refresh),
        }

    

class RefreshTokenSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    def validate(self, attrs):
        refresh_token = attrs.get("refresh")

        try:
            # 1. JWT 디코딩 (role, user_id 필요)
            payload = jwt_decode(refresh_token, settings.SECRET_KEY, algorithms=["HS256"])
            role = payload.get("role")
            user_id = payload.get("user_id")

            if not role or not user_id:
                raise serializers.ValidationError("토큰에 필요한 정보가 손실되었습니다.")

            # 2. 유효한 refresh 토큰 존재 여부 확인
            if role == "owner":
                token_obj = OwnerRefreshToken.objects.filter(
                    user_id=user_id,
                    token=refresh_token,
                    revoked=False,
                    expires_at__gt=timezone.now()
                ).first()
            elif role == "consumer":
                token_obj = ConsumerRefreshToken.objects.filter(
                    user_id=user_id,
                    token=refresh_token,
                    revoked=False,
                    expires_at__gt=timezone.now()
                ).first()
            else:
                raise serializers.ValidationError("유효하지 않은 사용자 유형입니다.")

            if not token_obj:
                raise serializers.ValidationError("유효하지 않거나 만료된 리프레시 토큰입니다.")

            # 3. access token 재발급
            access = AccessToken.for_user(token_obj.user)
            access["role"] = role

            return {
                "access": str(access)
            }

        except Exception as e:
            raise serializers.ValidationError("유효하지 않거나 만료된 리프레시 토큰입니다.")


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    def validate(self, attrs):
        from jwt import decode as jwt_decode
        from django.conf import settings
        from django.utils import timezone

        refresh_token = attrs.get("refresh")

        try:
            payload = jwt_decode(refresh_token, settings.SECRET_KEY, algorithms=["HS256"])
            role = payload.get("role")
            user_id = payload.get("user_id")

            if role == "owner":
                model = OwnerRefreshToken
            elif role == "consumer":
                model = ConsumerRefreshToken
            else:
                raise serializers.ValidationError("유효하지 않은 사용자 유형입니다.")

            token_obj = model.objects.filter(
                user_id=user_id,
                token=refresh_token,
                revoked=False,
                expires_at__gt=timezone.now()
            ).first()

            if not token_obj:
                raise serializers.ValidationError("이미 만료되었거나 존재하지 않는 토큰입니다.")

            token_obj.revoked = True
            token_obj.save()

            return {}
        except Exception as e:
            raise serializers.ValidationError("이미 만료되었거나 존재하지 않는 토큰입니다.")


class FindUsernameSerializer(serializers.Serializer):
    phone_number = serializers.CharField()
    name = serializers.CharField()

    def validate(self, attrs):
        phone = attrs.get("phone_number")
        name = attrs.get("name")

        user = OwnerUser.objects.filter(phone_number=phone, name=name).first()
        if not user:
            raise serializers.ValidationError("일치하는 회원 정보가 없습니다.")

        return {"username": user.username}
    

class ResetPasswordSerializer(serializers.Serializer):
    username = serializers.CharField()
    name = serializers.CharField()
    phone_number = serializers.CharField()

    def validate(self, attrs):
        username = attrs.get("username")
        name = attrs.get("name")
        phone = attrs.get("phone_number")

        user = OwnerUser.objects.filter(username=username, name=name, phone_number=phone).first()
        if not user:
            raise serializers.ValidationError("일치하는 회원 정보가 없습니다.")

        temp_password = generate_temp_password()
        user.set_password(temp_password)
        user.save()

        return {"temporary_password": temp_password}


class ChangePasswordSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = self.context["request"].user
        current_password = attrs.get("password")
        new_password = attrs.get("new_password")

        if not user.check_password(current_password):
            raise serializers.ValidationError("현재 비밀번호가 올바르지 않습니다.")

        return attrs

    def save(self, **kwargs):
        user = self.context["request"].user
        new_password = self.validated_data["new_password"]
        user.set_password(new_password)
        user.save()
        return user


class OwnerVerifySerializer(serializers.Serializer):
    admin_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        input_pw = attrs.get("admin_password")
        actual_pw = settings.ADMIN_APPROVE_PASSWORD

        if input_pw != actual_pw:
            raise serializers.ValidationError("관리자 비밀번호가 올바르지 않습니다.")

        return attrs

    def save(self):
        user = self.context["request"].user
        user.is_verified = True
        user.save()
        return user


class OwnerLicenseImageUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = OwnerUser
        fields = ["business_license_image"]

    def validate_business_license_image(self, value):
        if not value:
            raise serializers.ValidationError("사업자등록증 이미지는 필수입니다.")
        return value


class OwnerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = OwnerUser
        fields = ("name", "phone_number", "is_verified")