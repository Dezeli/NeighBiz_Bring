from django.contrib import admin
from .models import CouponPolicy, Coupon

@admin.register(CouponPolicy)
class CouponPolicyAdmin(admin.ModelAdmin):
    list_display = (
        "id", "store", "expected_value", "expected_duration",
        "monthly_limit", "is_active", "created_at", "updated_at"
    )
    list_filter = ("is_active", "expected_duration", "created_at")
    search_fields = ("store__name", "description")
    ordering = ("-created_at",)


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = (
        "id", "short_code", "user", "store_name", "status",
         "issued_at", "used_at", "expired_at"
    )
    list_filter = ("status", "issued_at", "used_at", "expired_at")
    search_fields = ("short_code", "user__phone_number", "policy__store__name")
    ordering = ("-issued_at",)

    def store_name(self, obj):
        return obj.policy.store.name
    store_name.short_description = "가맹점"
