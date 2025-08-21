from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "phone_number", "role", "is_active", "created_at")
    search_fields = ("phone_number",)
    list_filter = ("role", "is_active")
