from django.urls import path
from .views import StatsSummaryView, StatsRedemptionDelayView

urlpatterns = [
    path("owner/stats/summary", StatsSummaryView.as_view()),
    path("owner/stats/redemption-delay", StatsRedemptionDelayView.as_view()),
]
