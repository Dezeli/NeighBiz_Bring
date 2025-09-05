from django.contrib import admin
from .models import CouponPolicy, Coupon

@admin.register(CouponPolicy)
class CouponPolicyAdmin(admin.ModelAdmin):
    list_display = ("id", "merchant", "partnership", "daily_limit", "total_limit")
    search_fields = ("description",)

@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ("id", "short_code", "slug", "policy", "user", "status", "issued_at", "used_at")
    list_filter = ("status",)
    search_fields = ("short_code", "slug")
