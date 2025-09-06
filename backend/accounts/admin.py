from django.contrib import admin
from django.utils.html import format_html
from .models import (
    OwnerUser, ConsumerUser,
    OwnerRefreshToken, ConsumerRefreshToken,
    PhoneVerification
)
from common.s3 import generate_presigned_url

@admin.register(OwnerUser)
class OwnerUserAdmin(admin.ModelAdmin):
    list_display = (
        "id", "username", "name", "phone_number",
        "license_preview",
        "is_verified", "is_active", "is_staff", "is_superuser",
        "last_login", "created_at"
    )
    list_filter = ("is_verified", "is_active", "is_staff", "is_superuser", "created_at")
    search_fields = ("username", "name", "phone_number")
    ordering = ("-created_at",)

    def license_preview(self, obj):
        if not obj.business_license_image:
            return "없음"

        presigned_url = generate_presigned_url(obj.business_license_image)
        if not presigned_url:
            return "URL 생성 실패"

        return format_html(
            f'<a href="{presigned_url}" target="_blank" style="font-weight: bold;">🖼 보기</a>'
        )

    license_preview.short_description = "사업자등록증"


@admin.register(ConsumerUser)
class ConsumerUserAdmin(admin.ModelAdmin):
    list_display = (
        "id", "kakao_id", "phone_number", "is_active", "last_login", "created_at"
    )
    list_filter = ("is_active", "created_at")
    search_fields = ("kakao_id", "phone_number")
    ordering = ("-created_at",)


@admin.register(OwnerRefreshToken)
class OwnerRefreshTokenAdmin(admin.ModelAdmin):
    list_display = (
        "id", "user", "device_info", "revoked", "created_at", "expires_at"
    )
    list_filter = ("revoked", "created_at", "expires_at")
    search_fields = ("user__username", "device_info")
    ordering = ("-created_at",)


@admin.register(ConsumerRefreshToken)
class ConsumerRefreshTokenAdmin(admin.ModelAdmin):
    list_display = (
        "id", "user", "device_info", "revoked", "created_at", "expires_at"
    )
    list_filter = ("revoked", "created_at", "expires_at")
    search_fields = ("user__phone_number", "device_info")
    ordering = ("-created_at",)


@admin.register(PhoneVerification)
class PhoneVerificationAdmin(admin.ModelAdmin):
    list_display = (
        "id", "phone_number", "code", "is_verified", "created_at", "expires_at", "verified_at"
    )
    list_filter = ("is_verified", "created_at", "expires_at")
    search_fields = ("phone_number", "code")
    ordering = ("-created_at",)
