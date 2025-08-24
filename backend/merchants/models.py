from django.db import models
from django.contrib.auth.hashers import make_password
from accounts.models import User


class Merchant(models.Model):
    CATEGORY_CHOICES = (
        ("food", "음식"),
        ("cafe", "카페"),
        ("beauty", "미용"),
        ("etc", "기타"),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    address = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    description = models.TextField(blank=True)
    image_url = models.URLField(blank=True)
    business_hours = models.TextField(blank=True)
    approved = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    
    username = models.CharField(max_length=50, unique=True, null=True, blank=True)
    password = models.CharField(max_length=128, default="neighbiz")

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def __str__(self):
        return self.name
