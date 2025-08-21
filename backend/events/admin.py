from django.contrib import admin
from .models import EventLog

@admin.register(EventLog)
class EventLogAdmin(admin.ModelAdmin):
    list_display = ("id", "event_type", "coupon", "user", "timestamp")
    list_filter = ("event_type",)
    search_fields = ("user__phone_number", "coupon__short_code")
