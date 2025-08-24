from django.urls import path
from .views import MerchantImageUploadPresignedURLView, MyMerchantPageView

urlpatterns = [
    path("merchants/cover/presign/", MerchantImageUploadPresignedURLView.as_view()),
    path("merchants/mypage/", MyMerchantPageView.as_view(), name="merchant-mypage"),
]