from django.urls import path
from .views import RequestCodeView, VerifyCodeView, OwnerSignupView

urlpatterns = [
    path("phone-verify-request/", RequestCodeView.as_view(), name="phone-verify-request"),
    path("phone-verify/", VerifyCodeView.as_view(), name="phone-verify"),
    path("owner-signup/", OwnerSignupView.as_view(), name="owner-signup"),
]