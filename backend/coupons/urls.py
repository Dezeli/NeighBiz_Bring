
from django.urls import path
from coupons.views import CouponPolicyView

urlpatterns = [
    path("policy/", CouponPolicyView.as_view(), name="coupon-policy"),
]