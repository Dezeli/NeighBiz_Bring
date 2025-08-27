from django.db import models
from merchants.models import Merchant
from accounts.models import User
import uuid

def generate_unique_slug():
    return uuid.uuid4().hex[:10]

class Post(models.Model):
    DURATION_CHOICES = (
        ("1_month", "1개월"),
        ("3_months", "3개월"),
        ("6_months", "6개월"),
        ("unlimited", "무기한"),
    )

    STATUS_CHOICES = (
        ("open", "공개중"),
        ("matched", "제휴완료"),
        ("closed", "마감"),
    )

    author_merchant = models.ForeignKey(Merchant, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField()
    expected_value = models.PositiveIntegerField()
    expected_duration = models.CharField(max_length=20, choices=DURATION_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="open")
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(null=True, blank=True)


class Proposal(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    proposer_merchant = models.ForeignKey(Merchant, on_delete=models.CASCADE)
    
    policy = models.ForeignKey("coupons.CouponPolicy", on_delete=models.CASCADE, null=True)

    description = models.TextField()
    offered_value = models.IntegerField()

    ProposalStatus = (
        ("pending", "제휴 요청 중"),
        ("accepted", "제휴 승낙"),
        ("rejected", "제휴 거절"),
    )

    status = models.CharField(
        max_length=20,
        choices=ProposalStatus,
        default="pending"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(null=True)


class Partnership(models.Model):
    STATUS_CHOICES = (
        ("active", "활성"),
        ("ended", "종료"),
    )

    merchant_a = models.ForeignKey(Merchant, on_delete=models.CASCADE, related_name="partnership_a")
    merchant_b = models.ForeignKey(Merchant, on_delete=models.CASCADE, related_name="partnership_b")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, null=True, blank=True)
    proposal = models.ForeignKey(Proposal, on_delete=models.CASCADE, null=True, blank=True)

    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)

    termination_requested_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    termination_requested_at = models.DateTimeField(null=True, blank=True)
    termination_reason = models.TextField(blank=True)

    slug_for_a = models.SlugField(unique=True, null=True, blank=True)
    slug_for_b = models.SlugField(unique=True, null=True, blank=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug_for_a:
            self.slug_for_a = generate_unique_slug()
        if not self.slug_for_b:
            self.slug_for_b = generate_unique_slug()
        super().save(*args, **kwargs)