from rest_framework import serializers
from django.shortcuts import get_object_or_404
from django.db import models
from stores.models import Store
from coupons.models import CouponPolicy
from .models import Proposal, Partnership
from common.enums import PartnershipStatus, ProposalStatus
from common.utils import parse_partnership_duration, generate_slug

from django.utils import timezone
from datetime import timedelta
from django.db import transaction
import uuid


class ProposalCreateSerializer(serializers.ModelSerializer):
    recipient_store_id = serializers.IntegerField()

    class Meta:
        model = Proposal
        fields = ["recipient_store_id"]

    def validate(self, attrs):
        request = self.context["request"]
        proposer = get_object_or_404(Store, owner=request.user)
        recipient_id = attrs["recipient_store_id"]
        recipient = get_object_or_404(Store, id=recipient_id)

        if proposer.id == recipient.id:
            raise serializers.ValidationError("자기 자신에게는 제안을 보낼 수 없습니다.")


        existing_partnership = Partnership.objects.filter(
            models.Q(store_a=proposer, store_b=recipient) |
            models.Q(store_a=recipient, store_b=proposer),
            status__in=[
                PartnershipStatus.ACTIVE.value,
                PartnershipStatus.EXTENDED.value
            ]
        ).exists()

        if existing_partnership:
            raise serializers.ValidationError("이미 제휴 중인 가게입니다.")


        existing_proposal = Proposal.objects.filter(
            proposer_store=proposer,
            recipient_store=recipient,
            status=ProposalStatus.PENDING.value
        ).exists()


        existing_other_pending = Proposal.objects.filter(
            proposer_store=proposer,
            status=ProposalStatus.PENDING.value
        ).exists()

        if existing_other_pending:
            raise serializers.ValidationError("제휴 제안은 동시에 하나만 가능합니다.")


        return attrs

    def create(self, validated_data):
        request = self.context["request"]
        proposer = get_object_or_404(Store, owner=request.user)
        recipient = get_object_or_404(Store, id=validated_data["recipient_store_id"])

        return Proposal.objects.create(
            proposer_store=proposer,
            recipient_store=recipient,
            status="pending"
        )


class ProposalCancelSerializer(serializers.Serializer):
    def validate(self, attrs):
        user = self.context["request"].user
        store = getattr(user, "store", None)

        if store is None:
            raise serializers.ValidationError("가게 정보가 없습니다.")

        try:
            proposal = Proposal.objects.get(
                proposer_store=store,
                status=ProposalStatus.PENDING.value
            )
        except Proposal.DoesNotExist:
            raise serializers.ValidationError("취소 가능한 제안이 없습니다.")

        attrs["proposal"] = proposal
        return attrs



class ProposalActionSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=["approve", "reject"])

    def validate(self, data):
        proposal = self.context["proposal"]
        if proposal.status != 'pending':
            raise serializers.ValidationError("이미 처리된 제안입니다.")
        return data

    def perform_action(self):
        action = self.validated_data["action"]
        proposal = self.context["proposal"]

        if action == "reject":
            proposal.status = "rejected"
            proposal.save()
            return "제안을 거절했습니다."

        if action == "approve":
            with transaction.atomic():
                proposal.status = "accepted"
                proposal.save()

                proposer = proposal.proposer_store
                recipient = proposal.recipient_store

                start_date = timezone.now().date() + timedelta(days=1)

                policy = CouponPolicy.objects.filter(
                    store=recipient
                ).order_by('-created_at').first()

                if not policy or not policy.expected_duration:
                    raise serializers.ValidationError("제휴 수락하려면 쿠폰 정책이 필요합니다.")

                try:
                    duration = parse_partnership_duration(policy.expected_duration)
                except serializers.ValidationError as e:
                    raise e

                end_date = start_date + duration

                Partnership.objects.create(
                    store_a=proposer,
                    store_b=recipient,
                    start_date=start_date,
                    end_date=end_date,
                    slug_for_a=generate_slug(),
                    slug_for_b=generate_slug()
                )

                Proposal.objects.filter(
                    status='pending',
                    recipient_store__in=[proposer, recipient]
                ).exclude(id=proposal.id).update(status='rejected')

                Proposal.objects.filter(
                    status='pending',
                    proposer_store__in=[proposer, recipient]
                ).exclude(id=proposal.id).update(status='rejected')

                return "제휴를 승인했습니다."
