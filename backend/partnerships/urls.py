from django.urls import path
from partnerships.views import *

urlpatterns = [
    path("propose/", ProposalCreateView.as_view()),
    path("propose-cancel/", ProposalCancelView.as_view()),
    path('action/<int:pk>/', ProposalActionView.as_view(), name='proposal-action'),
    path("qr-image/", QRCodeImageView.as_view(), name="qr-code-image"),
]
