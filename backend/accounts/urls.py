from django.urls import path
from accounts.views import *

urlpatterns = [
    path("auth/request-code", RequestCodeView.as_view(), name="request-code"),
    path('auth/verify-code', VerifyCodeView.as_view(), name='verify-code'),
    path("auth/me", MeView.as_view()),
    path("auth/refresh", CustomTokenRefreshView.as_view(), name="token_refresh"),
    path("auth/logout", LogoutView.as_view()),
    path("auth/owner/signup", OwnerSignupView.as_view(), name="owner-signup"),
    path("auth/owner/login", OwnerLoginView.as_view(), name="owner-login"),

]