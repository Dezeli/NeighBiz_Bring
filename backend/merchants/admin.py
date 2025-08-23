from django.contrib import admin
from .models import Merchant

@admin.register(Merchant)
class MerchantAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "username", "phone", "category", "approved", "created_at")
    search_fields = ("name", "username", "phone", "address")
    list_filter = ("category", "approved", "created_at")
    ordering = ("-created_at",)
    readonly_fields = ["created_at", "deleted_at"]

    fieldsets = (
        (None, {
            "fields": (
                "user",
                "name", "phone", "address", "category",
                "description", "image_url", "business_hours",
                "approved", "created_at", "deleted_at"
            )
        }),
        ("로그인 정보", {
            "fields": ("username", "password"),
            "description": "비밀번호는 해시된 값으로 입력해야 합니다.",
        }),
    )