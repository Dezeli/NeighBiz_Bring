from django.db import models
from merchants.models import Merchant
from accounts.models import User


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
    STATUS_CHOICES = (
        ("pending", "대기중"),
        ("accepted", "수락됨"),
        ("rejected", "거절됨"),
    )

    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    proposer_merchant = models.ForeignKey(Merchant, on_delete=models.CASCADE)
    description = models.TextField()
    offered_value = models.PositiveIntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(null=True, blank=True)


class Partnership(models.Model):
    STATUS_CHOICES = (
        ("active", "활성"),
        ("ended", "종료"),
    )

    merchant_a = models.ForeignKey(Merchant, on_delete=models.CASCADE, related_name="partnership_a")
    merchant_b = models.ForeignKey(Merchant, on_delete=models.CASCADE, related_name="partnership_b")
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    proposal = models.ForeignKey(Proposal, on_delete=models.CASCADE)

    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)

    termination_requested_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    termination_requested_at = models.DateTimeField(null=True, blank=True)
    termination_reason = models.TextField(blank=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
