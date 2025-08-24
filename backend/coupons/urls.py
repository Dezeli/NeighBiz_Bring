from django.urls import path
from .views import CouponPolicyCreateView, CouponIssueView, CouponUseView

urlpatterns = [
    path("coupon-policies/", CouponPolicyCreateView.as_view(), name="coupon-policy-create"),
    path("issue/<slug:slug>/", CouponIssueView.as_view(), name="coupon-issue"),
    path("use/<int:coupon_id>/", CouponUseView.as_view(), name="coupon-use"),
]