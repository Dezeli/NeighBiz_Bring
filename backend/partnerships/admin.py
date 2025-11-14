from django.contrib import admin
from .models import Proposal, Partnership, PartnershipChangeRequest

@admin.register(Proposal)
class ProposalAdmin(admin.ModelAdmin):
    list_display = (
        "id", "proposer_name", "recipient_name", "status", "created_at", "updated_at"
    )
    list_filter = ("status", "created_at")
    search_fields = ("proposer_store__name", "recipient_store__name")
    ordering = ("-created_at",)

    def proposer_name(self, obj):
        return obj.proposer_store.name
    proposer_name.short_description = "제안 가게"

    def recipient_name(self, obj):
        return obj.recipient_store.name
    recipient_name.short_description = "수신 가게"


@admin.register(Partnership)
class PartnershipAdmin(admin.ModelAdmin):
    list_display = (
        "id", "store_a", "store_b", "status", "start_date", "end_date",
        "slug_for_a", "slug_for_b", "created_at", "updated_at"
    )
    list_filter = ("status", "start_date", "end_date", "created_at")
    search_fields = ("store_a__name", "store_b__name")
    ordering = ("-created_at",)


@admin.register(PartnershipChangeRequest)
class PartnershipChangeRequestAdmin(admin.ModelAdmin):
    list_display = (
        "id", "proposer_name", "recipient_name", "request_type",
        "status", "requested_at", "responded_at"
    )
    list_filter = ("request_type", "status", "requested_at", "responded_at")
    search_fields = ("proposer_store__name", "recipient_store__name")
    ordering = ("-requested_at",)

    def proposer_name(self, obj):
        return obj.proposer_store.name
    proposer_name.short_description = "요청 가게"

    def recipient_name(self, obj):
        return obj.recipient_store.name
    recipient_name.short_description = "수신 가게"
