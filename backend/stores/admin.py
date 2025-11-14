from django.contrib import admin
from .models import Store

@admin.register(Store)
class StoreAdmin(admin.ModelAdmin):
    list_display = (
        "id", "name", "owner", "category", "phone", "address",
        "is_active", "created_at", "updated_at"
    )
    list_filter = ("category", "is_active", "created_at")
    search_fields = ("name", "phone", "address", "owner__username")
    ordering = ("-created_at",)
