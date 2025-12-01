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
        "id",
        "short_code",
        "user",
        "partnership_name",
        "policy_store_name",
        "status",
        "issued_at",
        "used_at",
        "expired_at",
    )
    list_filter = (
        "status",
        "issued_at",
        "used_at",
        "expired_at",
        "partnership_slug",
    )
    search_fields = (
        "short_code",
        "user__phone_number",
        "policy__store__name",
        "partnership_slug",
    )
    ordering = ("-issued_at",)

    def partnership_name(self, obj):
        from partnerships.models import Partnership

        p = Partnership.objects.filter(
            slug_for_a=obj.partnership_slug
        ).first() or Partnership.objects.filter(
            slug_for_b=obj.partnership_slug
        ).first()

        if p:
            return f"{p.store_a.name} ↔ {p.store_b.name}"

        return "(제휴 없음)"
    partnership_name.short_description = "제휴"

    def policy_store_name(self, obj):
        return obj.policy.store.name
    policy_store_name.short_description = "정책 가맹점"
