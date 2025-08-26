from rest_framework.generics import ListAPIView
from .models import Post, Proposal, Partnership
from .serializers import PostListSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from coupons.models import CouponPolicy
from utils.response import success, failure
from merchants.models import Merchant
from django.utils import timezone
from django.db.models import Q

class PostListView(ListAPIView):
    queryset = Post.objects.filter(deleted_at__isnull=True).order_by("-created_at")
    serializer_class = PostListSerializer
    permission_classes = [IsAuthenticated]


class PostDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, post_id):
        try:
            post = Post.objects.select_related("author_merchant").get(
                id=post_id, deleted_at__isnull=True
            )
        except Post.DoesNotExist:
            return Response(failure(message="게시글을 찾을 수 없습니다.", error_code="POST_NOT_FOUND"), status=404)

        merchant = post.author_merchant

        try:
            policy = CouponPolicy.objects.get(merchant=merchant, deleted_at__isnull=True)
        except CouponPolicy.DoesNotExist:
            policy = None

        return Response(success(data={
            "post": {
                "id": post.id,
                "title": post.title,
                "description": post.description,
                "expected_value": post.expected_value,
                "expected_duration": post.expected_duration,
                "status": post.status,
                "created_at": post.created_at
            },
            "author_merchant": {
                "id": merchant.id,
                "name": merchant.name,
                "category": merchant.category,
                "address": merchant.address,
                "image_url": merchant.image_url,
                "description": merchant.description
            },
            "coupon_policy": {
                "description": policy.description if policy else None,
                "daily_limit": policy.daily_limit if policy else None,
                "total_limit": policy.total_limit if policy else None,
                "valid_from": policy.valid_from if policy else None,
                "valid_until": policy.valid_until if policy else None
            }
        }))

class SendProposalView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        user = request.user
        if getattr(user, "role", None) != "owner":
            return Response(failure(message="사장님만 접근할 수 있습니다.", error_code="FORBIDDEN"), status=403)

        try:
            my_merchant = Merchant.objects.get(user=user, deleted_at__isnull=True)
        except Merchant.DoesNotExist:
            return Response(failure(message="가맹점 정보를 찾을 수 없습니다.", error_code="MERCHANT_NOT_FOUND"), status=404)

        try:
            post = Post.objects.select_related("author_merchant").get(id=post_id, deleted_at__isnull=True)
        except Post.DoesNotExist:
            return Response(failure(message="게시글을 찾을 수 없습니다.", error_code="POST_NOT_FOUND"), status=404)

        # 본인 게시글이면 막기
        if post.author_merchant == my_merchant:
            return Response(failure(message="본인의 게시글에는 제안을 보낼 수 없습니다.", error_code="INVALID_ACTION"), status=400)

        # 이미 제안한 기록이 있는지 확인
        existing = Proposal.objects.filter(post=post, proposer_merchant=my_merchant, deleted_at__isnull=True).first()
        if existing:
            return Response(failure(message="이미 제안을 보낸 게시글입니다.", error_code="ALREADY_PROPOSED"), status=400)

        # 내 쿠폰 정책이 있어야 제안 가능
        try:
            my_policy = CouponPolicy.objects.get(merchant=my_merchant, deleted_at__isnull=True)
        except CouponPolicy.DoesNotExist:
            return Response(failure(message="쿠폰 정책이 필요합니다.", error_code="POLICY_NOT_FOUND"), status=400)

        # Proposal 생성
        proposal = Proposal.objects.create(
            post=post,
            proposer_merchant=my_merchant,
            policy=my_policy,
            description=my_policy.description,
            offered_value=post.expected_value,
            status="pending",
            created_at=timezone.now()
        )

        return Response(success(data={
            "proposal_id": proposal.id,
            "status": proposal.status
        }, message="제휴 요청이 성공적으로 전송되었습니다."))


class ReceivedProposalsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if getattr(user, "role", None) != "owner":
            return Response(failure(message="사장님만 접근할 수 있습니다.", error_code="FORBIDDEN"), status=403)

        try:
            my_merchant = Merchant.objects.get(user=user, deleted_at__isnull=True)
        except Merchant.DoesNotExist:
            return Response(failure(message="가맹점 정보를 찾을 수 없습니다.", error_code="MERCHANT_NOT_FOUND"), status=404)

        # 내가 작성한 게시글
        my_posts = Post.objects.filter(author_merchant=my_merchant, deleted_at__isnull=True)

        # 내 게시글에 들어온 제안
        proposals = Proposal.objects.filter(
            post__in=my_posts,
            deleted_at__isnull=True
        ).select_related("post", "proposer_merchant", "policy").order_by("-created_at")

        # 직렬화 없이 수동 구성
        results = []
        for p in proposals:
            results.append({
                "proposal_id": p.id,
                "status": p.status,
                "created_at": p.created_at,
                "post": {
                    "id": p.post.id,
                    "title": p.post.title,
                    "expected_value": p.post.expected_value,
                },
                "proposer_merchant": {
                    "id": p.proposer_merchant.id,
                    "name": p.proposer_merchant.name,
                    "category": p.proposer_merchant.category,
                    "address": p.proposer_merchant.address,
                    "image_url": p.proposer_merchant.image_url,
                },
                "coupon_policy": {
                    "description": p.policy.description,
                    "daily_limit": p.policy.daily_limit,
                    "total_limit": p.policy.total_limit,
                    "valid_from": p.policy.valid_from,
                    "valid_until": p.policy.valid_until,
                }
            })

        return Response(success(data=results, message="받은 제안 목록을 불러왔습니다."))
    

class SentProposalsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if getattr(user, "role", None) != "owner":
            return Response(failure(message="사장님만 접근할 수 있습니다.", error_code="FORBIDDEN"), status=403)

        try:
            my_merchant = Merchant.objects.get(user=user, deleted_at__isnull=True)
        except Merchant.DoesNotExist:
            return Response(failure(message="가맹점 정보를 찾을 수 없습니다.", error_code="MERCHANT_NOT_FOUND"), status=404)

        # 내가 보낸 제안
        proposals = Proposal.objects.filter(
            proposer_merchant=my_merchant,
            deleted_at__isnull=True
        ).select_related("post", "post__author_merchant", "policy").order_by("-created_at")

        results = []
        for p in proposals:
            post_author = p.post.author_merchant
            results.append({
                "proposal_id": p.id,
                "status": p.status,
                "created_at": p.created_at,
                "target_post": {
                    "id": p.post.id,
                    "title": p.post.title,
                    "expected_value": p.post.expected_value,
                },
                "target_merchant": {
                    "id": post_author.id,
                    "name": post_author.name,
                    "category": post_author.category,
                    "address": post_author.address,
                    "image_url": post_author.image_url,
                },
                "my_coupon_policy": {
                    "description": p.policy.description,
                    "daily_limit": p.policy.daily_limit,
                    "total_limit": p.policy.total_limit,
                    "valid_from": p.policy.valid_from,
                    "valid_until": p.policy.valid_until,
                }
            })

        return Response(success(data=results, message="보낸 제안 목록을 불러왔습니다."))
    


class RespondToProposalView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, proposal_id):
        user = request.user
        if getattr(user, "role", None) != "owner":
            return Response(failure(message="사장님만 접근할 수 있습니다.", error_code="FORBIDDEN"), status=403)

        action = request.data.get("action")  # "accept" or "reject"
        if action not in ["accept", "reject"]:
            return Response(failure(message="action 값은 'accept' 또는 'reject'여야 합니다.", error_code="INVALID_ACTION"), status=400)

        try:
            my_merchant = Merchant.objects.get(user=user, deleted_at__isnull=True)
        except Merchant.DoesNotExist:
            return Response(failure(message="가맹점 정보를 찾을 수 없습니다.", error_code="MERCHANT_NOT_FOUND"), status=404)

        try:
            proposal = Proposal.objects.select_related("post", "proposer_merchant", "policy").get(id=proposal_id, deleted_at__isnull=True)
        except Proposal.DoesNotExist:
            return Response(failure(message="제안서를 찾을 수 없습니다.", error_code="PROPOSAL_NOT_FOUND"), status=404)

        # 글 작성자가 맞는지 확인
        if proposal.post.author_merchant != my_merchant:
            return Response(failure(message="본인의 게시글에 대한 제안만 수락/거절할 수 있습니다.", error_code="FORBIDDEN"), status=403)

        # 이미 처리된 상태인지 확인
        if proposal.status in ["accepted", "rejected"]:
            return Response(failure(message="이미 처리된 제안입니다.", error_code="ALREADY_HANDLED"), status=400)

        if action == "reject":
            proposal.status = "rejected"
            proposal.save()
            return Response(success(message="제안을 거절했습니다."))

        # 수락 처리
        # 1. 글 작성자의 정책
        try:
            policy_a = CouponPolicy.objects.get(merchant=my_merchant, deleted_at__isnull=True)
        except CouponPolicy.DoesNotExist:
            return Response(failure(message="정책 정보를 찾을 수 없습니다.", error_code="POLICY_NOT_FOUND"), status=404)

        # 2. 제안자의 정책
        policy_b = proposal.policy

        # 3. Partnership 생성
        partnership = Partnership.objects.create(
            merchant_a=my_merchant,
            merchant_b=proposal.proposer_merchant,
            post=proposal.post,
            proposal=proposal,
            start_date=timezone.now().date(),
            status="active"
        )

        # 4. 정책에 partnership 연결
        policy_a.partnership = partnership
        policy_b.partnership = partnership
        policy_a.save()
        policy_b.save()

        # 5. 제안 상태 업데이트
        proposal.status = "accepted"
        proposal.save()

        return Response(success(message="제안을 수락하고 제휴를 생성했습니다."))


class OwnerPartnershipStatusCheckView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if getattr(user, "role", None) != "owner":
            return Response(failure(message="사장님만 접근할 수 있습니다.", error_code="FORBIDDEN"), status=403)

        try:
            merchant = Merchant.objects.get(user=user, deleted_at__isnull=True)
        except Merchant.DoesNotExist:
            return Response(failure(message="가맹점 정보를 찾을 수 없습니다.", error_code="MERCHANT_NOT_FOUND"), status=404)

        has_policy = CouponPolicy.objects.filter(merchant=merchant, deleted_at__isnull=True).exists()
        has_received = Proposal.objects.filter(post__author_merchant=merchant, deleted_at__isnull=True, status="pending").exists()
        has_sent = Proposal.objects.filter(proposer_merchant=merchant, deleted_at__isnull=True, status="pending").exists()
        has_partnership = Partnership.objects.filter(
            Q(merchant_a=merchant) | Q(merchant_b=merchant),
            deleted_at__isnull=True,
            status="active"
        ).exists()

        return Response(success(data={
            "has_coupon_policy": has_policy,
            "has_received_proposal": has_received,
            "has_sent_proposal": has_sent,
            "has_active_partnership": has_partnership
        }, message="현재 사장님의 제휴 관련 상태입니다."))