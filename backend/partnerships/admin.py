from django.contrib import admin
from .models import Post, Proposal, Partnership

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("id", "author_merchant", "title", "expected_value", "expected_duration", "status", "created_at")
    search_fields = ("title",)
    list_filter = ("status", "expected_duration")

@admin.register(Proposal)
class ProposalAdmin(admin.ModelAdmin):
    list_display = ("id", "post", "proposer_merchant", "offered_value", "status", "created_at")
    list_filter = ("status",)

@admin.register(Partnership)
class PartnershipAdmin(admin.ModelAdmin):
    list_display = ("id", "merchant_a", "merchant_b", "status", "start_date", "end_date", "created_at")
    list_filter = ("status",)
