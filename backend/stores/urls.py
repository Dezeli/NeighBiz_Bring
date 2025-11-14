from django.urls import path
from stores.views import *

urlpatterns = [
    path("owner-store/", StoreUpdateView.as_view()),
    path("posts/", PostListView.as_view(), name="coupon-post-list"),
    path("post/<int:id>/", PostDetailView.as_view(), name="store-detail"),
]