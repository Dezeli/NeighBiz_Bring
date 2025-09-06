from rest_framework import serializers
from django.db import transaction
from .models import OwnerUser
from stores.serializers import StoreSignupSerializer
from rest_framework.validators import UniqueValidator

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