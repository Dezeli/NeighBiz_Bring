from django.db import models
from stores.models import Store
from common.enums import ProposalStatus, PartnershipStatus, PartnershipChangeType


class Proposal(models.Model):
    proposer_store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name="sent_proposals")
    recipient_store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name="received_proposals")

    status = models.CharField(
        max_length=10,
        choices=ProposalStatus.choices(),
        default=ProposalStatus.PENDING.value
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"제안: {self.proposer_store.name} → {self.recipient_store.name} ({self.get_status_display()})"




class Partnership(models.Model):
    store_a = models.ForeignKey(Store, on_delete=models.CASCADE, related_name="partnerships_as_a")
    store_b = models.ForeignKey(Store, on_delete=models.CASCADE, related_name="partnerships_as_b")

    start_date = models.DateField()
    end_date = models.DateField(null=True)

    slug_for_a = models.SlugField(max_length=32, unique=True)
    slug_for_b = models.SlugField(max_length=32, unique=True)

    status = models.CharField(
        max_length=15,
        choices=PartnershipStatus.choices(),
        default=PartnershipStatus.ACTIVE.value
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"제휴: {self.store_a.name} ↔ {self.store_b.name} ({self.get_status_display()})"




class PartnershipChangeRequest(models.Model):
    proposer_store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name="change_requests_sent")
    recipient_store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name="change_requests_received")

    request_type = models.CharField(
        max_length=10,
        choices=PartnershipChangeType.choices()
    )

    status = models.CharField(
        max_length=10,
        choices=ProposalStatus.choices(),
        default=ProposalStatus.PENDING.value
    )

    requested_at = models.DateTimeField(auto_now_add=True)
    responded_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.get_request_type_display()} ({self.get_status_display()})"
