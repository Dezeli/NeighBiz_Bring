from rest_framework import serializers
from .models import CouponPolicy
from partnerships.models import Post
from merchants.models import Merchant
from django.utils import timezone
from django.shortcuts import get_object_or_404

class CouponPolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = CouponPolicy
        fields = [
            "description",
            "expected_value",
            "expected_duration",
            "valid_from",
            "valid_until",
            "daily_limit",
            "total_limit",
        ]

    def create(self, validated_data):
        request = self.context["request"]
        merchant = get_object_or_404(Merchant, user=request.user)
        validated_data["merchant"] = merchant

        Post.objects.filter(author_merchant=merchant, deleted_at__isnull=True).update(
            deleted_at=timezone.now(),
            status="closed"
        )

        policy = super().create(validated_data)

        Post.objects.create(
            author_merchant=merchant,
            title=f"{merchant.name}",
            description=policy.description,
            expected_value=policy.expected_value,
            expected_duration=policy.expected_duration,
            status="open"
        )

        return policy
