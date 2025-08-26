from django.contrib import admin
from .models import Post, Proposal, Partnership

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("id", "author_merchant", "title", "expected_value", "expected_duration", "status", "created_at")
    search_fields = ("title",)
    list_filter = ("status", "expected_duration")

@admin.register(Proposal)
class ProposalAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "post_summary",
        "merchant_summary",
        "policy_summary",
        "offered_value",
        "status",
        "created_at"
    )
    list_filter = ("status", "created_at")
    search_fields = ("post__title", "proposer_merchant__name", "policy__description")

    def post_summary(self, obj):
        return f"[{obj.post.id}] {obj.post.title}"
    post_summary.short_description = "제안 대상 게시글"

    def merchant_summary(self, obj):
        return f"{obj.proposer_merchant.name} ({obj.proposer_merchant.category})"
    merchant_summary.short_description = "제안 보낸 가게"

    def policy_summary(self, obj):
        return obj.policy.description if obj.policy else "(없음)"
    policy_summary.short_description = "제안한 정책"

    readonly_fields = ("created_at", "deleted_at")

@admin.register(Partnership)
class PartnershipAdmin(admin.ModelAdmin):
    list_display = ("id", "merchant_a", "merchant_b", "status", "start_date", "end_date", "created_at")
    list_filter = ("status",)
