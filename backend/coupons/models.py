from django.db import models
from stores.models import Store
from accounts.models import ConsumerUser
from common.enums import PartnershipDuration, CouponStatus


class CouponPolicy(models.Model):
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name="coupon_policies")

    description = models.TextField()
    expected_value = models.PositiveIntegerField()

    expected_duration = models.CharField(
        max_length=20,
        choices=PartnershipDuration.choices(),
        default=PartnershipDuration.ONE_MONTH.value,
    )

    monthly_limit = models.PositiveIntegerField(null=True)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.store.name} - {self.expected_value}원 혜택"




class Coupon(models.Model):
    user = models.ForeignKey(ConsumerUser, on_delete=models.CASCADE, related_name="coupons")
    policy = models.ForeignKey(CouponPolicy, on_delete=models.CASCADE, related_name="coupons")

    slug = models.SlugField(unique=True, max_length=32)
    short_code = models.CharField(max_length=12, unique=True)

    status = models.CharField(
        max_length=10,
        choices=CouponStatus.choices(),
        default=CouponStatus.ACTIVE.value
    )

    issued_at = models.DateTimeField(auto_now_add=True)
    used_at = models.DateTimeField(null=True, blank=True)
    expired_at = models.DateTimeField(null=True)

    def __str__(self):
        return f"{self.short_code} - {self.get_status_display()}"

    class Meta:
        indexes = [
            models.Index(fields=["short_code"]),
            models.Index(fields=["slug"]),
        ]
