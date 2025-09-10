from django.urls import path
from .views import *

urlpatterns = [
    path("phone-verify-request/", RequestCodeView.as_view(), name="phone-verify-request"),
    path("phone-verify/", VerifyCodeView.as_view(), name="phone-verify"),
    path("owner-signup/", OwnerSignupView.as_view(), name="owner-signup"),
    path("owner-login/", OwnerLoginView.as_view(), name="owner-login"),
    path("refresh/", RefreshTokenView.as_view(), name="refresh-token"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("find-username/", FindUsernameView.as_view(), name="find-username"),
    path("reset-password/", ResetPasswordView.as_view(), name="reset-password"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
    path("verify-owner/", OwnerVerifyView.as_view(), name="verify-owner"),
    path("owner-license/", OwnerLicenseImageUpdateView.as_view()),
    path("owner-profile/", OwnerProfileView.as_view()),
]