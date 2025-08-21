from django.contrib import admin
from .models import Merchant

@admin.register(Merchant)
class MerchantAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "phone", "category", "approved", "created_at")
    search_fields = ("name", "phone")
    list_filter = ("category", "approved")
