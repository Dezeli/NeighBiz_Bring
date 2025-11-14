from rest_framework import serializers
from coupons.models import CouponPolicy
from partnerships.models import Partnership
from .models import Store
from common.enums import StoreCategory
from django.db import models

class StoreSignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = [
            "name", "phone", "address", "category",
            "description", "image_url", "business_hours"
        ]

    def validate_business_hours(self, value):
        """
        요일별 영업시간 유효성 검사
        """
        import re

        valid_days = {"mon", "tue", "wed", "thu", "fri", "sat", "sun"}
        time_pattern = re.compile(r"^\d{2}:\d{2}$")

        for day, schedule in value.items():
            if day not in valid_days:
                raise serializers.ValidationError(f"{day}는 유효한 요일이 아닙니다.")

            if schedule.get("closed"):
                if any(k in schedule for k in ["open", "close", "break"]):
                    raise serializers.ValidationError(f"{day}: 'closed'가 true이면 다른 항목이 없어야 합니다.")
                continue

            if not schedule.get("open") or not schedule.get("close"):
                raise serializers.ValidationError(f"{day}: open/close 시간이 필요합니다.")

            for field in ["open", "close"]:
                if not time_pattern.match(schedule[field]):
                    raise serializers.ValidationError(f"{day}: {field}는 HH:MM 형식이어야 합니다.")

            if "break" in schedule:
                if not isinstance(schedule["break"], list) or len(schedule["break"]) != 2:
                    raise serializers.ValidationError(f"{day}: break는 [시작, 종료] 형식의 리스트여야 합니다.")
                for b in schedule["break"]:
                    if not time_pattern.match(b):
                        raise serializers.ValidationError(f"{day}: break 시간은 HH:MM 형식이어야 합니다.")

        return value


class StoreUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = [
            "name",
            "phone",
            "address",
            "category",
            "description",
            "image_url",
            "business_hours"
        ]

    def validate_category(self, value):
        valid_choices = [choice[0] for choice in StoreCategory.choices()]
        if value not in valid_choices:
            raise serializers.ValidationError("유효하지 않은 카테고리입니다.")
        return value
    

class StoreProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = (
            "name",
            "phone",
            "address",
            "category",
            "description",
            "image_url",
            "business_hours",
        )




class PostSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="store.id")
    store_name = serializers.CharField(source="store.name", read_only=True)
    owner_name = serializers.CharField(source="store.owner.name", read_only=True)
    category = serializers.CharField(source="store.category", read_only=True)
    is_partnered = serializers.SerializerMethodField()

    class Meta:
        model = CouponPolicy
        fields = [
            "id",
            "store_name",
            "owner_name",
            "category",
            "description",
            "expected_value",
            "expected_duration",
            "monthly_limit",
            "updated_at",
            "is_partnered",
        ]

    def get_is_partnered(self, obj):
        return Partnership.objects.filter(
            status="active"
        ).filter(
            models.Q(store_a=obj.store) | models.Q(store_b=obj.store)
        ).exists()




class PostDetailSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source="owner.name", read_only=True)
    category = serializers.CharField(read_only=True)
    business_hours = serializers.JSONField()
    is_partnered = serializers.SerializerMethodField()

    # 쿠폰 정책 정보
    description = serializers.SerializerMethodField()
    expected_value = serializers.SerializerMethodField()
    expected_duration = serializers.SerializerMethodField()
    monthly_limit = serializers.SerializerMethodField()
    coupon_updated_at = serializers.SerializerMethodField()

    class Meta:
        model = Store
        fields = [
            "id",
            "name",
            "owner_name",
            "category",
            "phone",
            "address",
            "description",         # 가게 소개
            "image_url",           # 대표 이미지
            "business_hours",      # 영업시간
            "expected_value",
            "expected_duration",
            "monthly_limit",
            "coupon_updated_at",
            "description",         # 쿠폰 혜택 설명
            "is_partnered"
        ]

    def get_coupon(self, store):
        try:
            return CouponPolicy.objects.get(store=store, is_active=True)
        except CouponPolicy.DoesNotExist:
            return None

    def get_description(self, store):
        policy = self.get_coupon(store)
        return policy.description if policy else None

    def get_expected_value(self, store):
        policy = self.get_coupon(store)
        return policy.expected_value if policy else None

    def get_expected_duration(self, store):
        policy = self.get_coupon(store)
        return policy.expected_duration if policy else None

    def get_monthly_limit(self, store):
        policy = self.get_coupon(store)
        return policy.monthly_limit if policy else None

    def get_coupon_updated_at(self, store):
        policy = self.get_coupon(store)
        return policy.updated_at if policy else None

    def get_is_partnered(self, store):
        return Partnership.objects.filter(
            status="active"
        ).filter(
            models.Q(store_a=store) | models.Q(store_b=store)
        ).exists()