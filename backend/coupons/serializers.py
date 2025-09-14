from rest_framework import serializers
from coupons.models import CouponPolicy
from stores.models import Store
from django.shortcuts import get_object_or_404
from .models import Coupon

class CouponPolicyCreateSerializer(serializers.ModelSerializer):
    description = serializers.CharField(
        error_messages={"required": "쿠폰 설명을 입력해주세요."}
    )
    expected_value = serializers.IntegerField(
        error_messages={"required": "혜택 금액을 입력해주세요."}
    )
    expected_duration = serializers.ChoiceField(
        choices=CouponPolicy._meta.get_field("expected_duration").choices,
        error_messages={"required": "제휴 기간을 선택해주세요."}
    )
    monthly_limit = serializers.IntegerField(
        required=True,
        error_messages={"required": "월간 발급 한도를 입력해주세요."}
    )

    class Meta:
        model = CouponPolicy
        fields = [
            "description",
            "expected_value",
            "expected_duration",
            "monthly_limit",
        ]

    def create(self, validated_data):
        request = self.context["request"]
        user = request.user

        store = get_object_or_404(Store, owner=user)

        if CouponPolicy.objects.filter(store=store).exists():
            raise serializers.ValidationError({
                "non_field_errors": ["이미 등록된 쿠폰 정책이 있습니다."]
            })

        return CouponPolicy.objects.create(store=store, **validated_data)

class CouponPolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = CouponPolicy
        fields = [
            "description",
            "expected_value",
            "expected_duration",
            "monthly_limit",
        ]


class CouponPolicyUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CouponPolicy
        fields = ["description", "expected_value", "expected_duration", "monthly_limit", "is_active"]
        extra_kwargs = {field: {"required": False} for field in fields}



class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = [
            "id",
            "short_code",
            "status",
            "issued_at",
            "used_at",
            "expired_at",
        ]
        read_only_fields = fields


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = [
            "id",
            "short_code",
            "status",
            "issued_at",
            "used_at",
            "expired_at",
        ]
        read_only_fields = fields