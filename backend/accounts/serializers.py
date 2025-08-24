from rest_framework import serializers
from merchants.models import Merchant
from django.contrib.auth.hashers import make_password, check_password
from accounts.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .tokens import issue_tokens_for_user


class RequestCodeSerializer(serializers.Serializer):
    phone_number = serializers.RegexField(
        regex=r"^010\d{8}$",
        max_length=11,
        min_length=11,
        error_messages={"invalid": "유효한 휴대폰 번호를 입력해주세요."}
    )


class VerifyCodeSerializer(serializers.Serializer):
    phone_number = serializers.CharField()
    code = serializers.CharField()


class OwnerSignupSerializer(serializers.Serializer):
    phone_number = serializers.CharField()
    username = serializers.CharField()
    password = serializers.CharField()
    name = serializers.CharField()
    phone = serializers.CharField()
    address = serializers.CharField()
    category = serializers.ChoiceField(choices=Merchant.CATEGORY_CHOICES)
    description = serializers.CharField(required=False, allow_blank=True)
    image_url = serializers.URLField(required=False, allow_blank=True)
    business_hours = serializers.CharField(required=False, allow_blank=True)

    def validate_username(self, username):
        if Merchant.objects.filter(username=username).exists():
            raise serializers.ValidationError("이미 사용 중인 아이디입니다.")
        return username

    def create(self, validated_data):
        phone = validated_data["phone_number"]

        user, _ = User.objects.get_or_create(phone_number=phone)
        user.role = "owner"
        user.save()
        
        if Merchant.objects.filter(user=user).exists():
            raise serializers.ValidationError("이미 등록된 사장님 계정입니다.")
        
        merchant = Merchant.objects.create(
            user=user,
            username=validated_data["username"],
            password=make_password(validated_data["password"]),
            name=validated_data["name"],
            phone=validated_data["phone"],
            address=validated_data["address"],
            category=validated_data["category"],
            description=validated_data.get("description", ""),
            image_url=validated_data.get("image_url", ""),
            business_hours=validated_data.get("business_hours", "")
        )

        return {
            "merchant_id": merchant.id,
            "username": merchant.username,
        }
    

class OwnerLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        username = data["username"]
        password = data["password"]

        try:
            merchant = Merchant.objects.get(username=username)
        except Merchant.DoesNotExist:
            raise serializers.ValidationError("존재하지 않는 아이디입니다.")

        if not check_password(password, merchant.password):
            raise serializers.ValidationError("비밀번호가 일치하지 않습니다.")

        user = merchant.user
        if user.role != "owner":
            raise serializers.ValidationError("해당 계정은 사장님 계정이 아닙니다.")

        data["user"] = user
        data["merchant"] = merchant
        return data

    def create(self, validated_data):
        user = validated_data["user"]
        merchant = validated_data["merchant"]

        request = self.context.get("request")
        tokens = issue_tokens_for_user(user, request=request, session_scope="owner")

        return {
            **tokens,
            "user": {
                "id": user.id,
                "phone_number": user.phone_number,
                "role": user.role,
            },
            "merchant": {
                "id": merchant.id,
                "name": merchant.name,
                "username": merchant.username,
            }
        }