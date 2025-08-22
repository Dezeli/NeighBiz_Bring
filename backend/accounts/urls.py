from django.urls import path
from accounts.views import RequestCodeView, VerifyCodeView, MeView, CustomTokenRefreshView, LogoutView

urlpatterns = [
    path("auth/request-code", RequestCodeView.as_view(), name="request-code"),
    path('auth/verify-code', VerifyCodeView.as_view(), name='verify-code'),
    path("auth/me", MeView.as_view()),
    path("auth/refresh", CustomTokenRefreshView.as_view(), name="token_refresh"),
    path("auth/logout", LogoutView.as_view()),
]