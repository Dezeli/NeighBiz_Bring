
from django.urls import path
from coupons.views import *

urlpatterns = [
    path("policy/", CouponPolicyView.as_view(), name="coupon-policy"),
    path("issue/", CouponIssueView.as_view(), name="coupon-issue"),
    path("use/", CouponUseView.as_view(), name="coupon-issue"),
]