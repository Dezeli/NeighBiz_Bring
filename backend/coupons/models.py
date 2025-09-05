from django.db import models
from merchants.models import Merchant
from partnerships.models import Partnership, Post
from accounts.models import User


class CouponPolicy(models.Model):
    merchant = models.ForeignKey(Merchant, on_delete=models.CASCADE)
    partnership = models.ForeignKey(Partnership, on_delete=models.CASCADE, null=True, blank=True)
    description = models.TextField()
    expected_value = models.PositiveIntegerField(default=0)
    expected_duration = models.CharField(
        max_length=20,
        choices=Post.DURATION_CHOICES,
        default="unlimited"
    )
    daily_limit = models.PositiveIntegerField(null=True, blank=True)
    total_limit = models.PositiveIntegerField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(null=True, blank=True)


class Coupon(models.Model):
    STATUS_CHOICES = (
        ("active", "사용가능"),
        ("used", "사용됨"),
        ("expired", "만료됨"),
    )

    short_code = models.CharField(max_length=10, unique=True)
    slug = models.SlugField(unique=True)
    policy = models.ForeignKey(CouponPolicy, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="active")
    issued_at = models.DateTimeField(auto_now_add=True)
    used_at = models.DateTimeField(null=True, blank=True)
