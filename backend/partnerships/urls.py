from django.urls import path
from .views import *

urlpatterns = [
    path("posts/", PostListView.as_view(), name="post-list"),
    path("posts/<int:post_id>/", PostDetailView.as_view(), name="owner-post-detail"),
    path("proposals/<int:post_id>/send/", SendProposalView.as_view(), name="send-proposal"),
    path("proposals/received/", ReceivedProposalsView.as_view(), name="received-proposals"),
    path("proposals/sent/", SentProposalsView.as_view(), name="sent-proposals"),
    path("proposals/<int:proposal_id>/respond/", RespondToProposalView.as_view(), name="respond-to-proposal"),
    path("owner/partnership/status-check/", OwnerPartnershipStatusCheckView.as_view(), name="owner-partnership-status-check"),
]