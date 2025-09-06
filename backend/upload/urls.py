from django.urls import path
from .views import UploadURLView

urlpatterns = [
    path("image/", UploadURLView.as_view(), name="upload-url"),
]
