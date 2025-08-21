from django.db import models
from coupons.models import Coupon
from accounts.models import User


class EventLog(models.Model):
    EVENT_CHOICES = (
        ("coupon_issued", "쿠폰 발급"),
        ("coupon_used", "쿠폰 사용"),
    )

    event_type = models.CharField(max_length=20, choices=EVENT_CHOICES)
    coupon = models.ForeignKey(Coupon, on_delete=models.SET_NULL, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)
    device_hash = models.CharField(max_length=255, null=True, blank=True)
    metadata = models.JSONField(null=True, blank=True)
