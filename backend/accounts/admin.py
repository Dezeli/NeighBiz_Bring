from django.contrib import admin
from .models import User, VerificationCode, RefreshToken

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "phone_number", "role", "is_active", "created_at")
    search_fields = ("phone_number",)
    list_filter = ("role", "is_active")

@admin.register(VerificationCode)
class VerificationCodeAdmin(admin.ModelAdmin):
    list_display = ("phone_number", "code", "created_at", "is_verified")
    list_filter = ("is_verified",)
    search_fields = ("phone_number",)

@admin.register(RefreshToken)
class RefreshTokenAdmin(admin.ModelAdmin):
    list_display = ["user", "device_info", "created_at", "expires_at", "revoked"]
    list_filter = ["revoked", "created_at"]
    search_fields = ["user__phone_number", "device_info"]