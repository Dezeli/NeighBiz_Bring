# events/views.py
from datetime import datetime, timedelta
from django.utils import timezone
from django.db.models import Count, Case, When, IntegerField, F, ExpressionWrapper, DurationField, Avg
from django.db.models.functions import TruncDate
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from utils.response import success, failure
from merchants.models import Merchant
from events.models import EventLog
from coupons.models import Coupon



class StatsSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if getattr(user, "role", None) != "owner":
            return Response(failure(message="권한이 없습니다.", error_code="FORBIDDEN"), status=403)

        try:
            merchant = Merchant.objects.get(user_id=user.id, deleted_at__isnull=True)
        except Merchant.DoesNotExist:
            return Response(failure(message="가게 정보가 없습니다."), status=400)

        # 기간 설정
        range_param = request.query_params.get("range", "7d")
        now = timezone.now()
        if range_param == "month":
            start_dt = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        else:
            start_dt = (now - timedelta(days=7)).replace(hour=0, minute=0, second=0, microsecond=0)
        end_dt = now + timedelta(seconds=1)

        # 필터링
        base_qs = EventLog.objects.filter(
            timestamp__gte=start_dt,
            timestamp__lt=end_dt,
            coupon__policy__merchant=merchant,
            event_type__in=["coupon_issued", "coupon_used"]
        )

        # KPI 계산
        summary = base_qs.values("event_type").annotate(c=Count("id"))
        issued = next((x["c"] for x in summary if x["event_type"] == "coupon_issued"), 0)
        used   = next((x["c"] for x in summary if x["event_type"] == "coupon_used"), 0)
        conversion = round(used / issued, 4) if issued else 0.0

        # 일자별 집계
        daily_qs = base_qs.annotate(d=TruncDate("timestamp")) \
            .values("d") \
            .annotate(
                issued=Count(Case(When(event_type="coupon_issued", then=1), output_field=IntegerField())),
                used=Count(Case(When(event_type="coupon_used", then=1), output_field=IntegerField())),
            ).order_by("d")

        daily_stats = [
            {
                "date": row["d"].isoformat(),
                "issued": row["issued"],
                "used": row["used"]
            }
            for row in daily_qs
        ]

        return Response(success(data={
            "range": {
                "start": start_dt.date().isoformat(),
                "end": now.date().isoformat()
            },
            "kpis": {
                "issued": issued,
                "used": used,
                "conversion_rate": conversion
            },
            "daily_stats": daily_stats
        }))


class StatsRedemptionDelayView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if getattr(user, "role", None) != "owner":
            return Response(failure(message="권한이 없습니다.", error_code="FORBIDDEN"), status=403)

        try:
            merchant = Merchant.objects.get(user_id=user.id, deleted_at__isnull=True)
        except Merchant.DoesNotExist:
            return Response(failure(message="가게 정보가 없습니다."), status=400)

        # 기간 설정
        range_param = request.query_params.get("range", "7d")
        now = timezone.now()
        if range_param == "month":
            start_dt = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        else:
            start_dt = (now - timedelta(days=7)).replace(hour=0, minute=0, second=0, microsecond=0)
        end_dt = now + timedelta(seconds=1)

        # 사용된 쿠폰 (내 가게 혜택 제공 + 기간 내 발급 + 사용됨)
        qs = Coupon.objects.filter(
            policy__merchant=merchant,
            issued_at__gte=start_dt,
            issued_at__lt=end_dt,
            status="used",
            used_at__isnull=False,
        ).annotate(
            delay=ExpressionWrapper(F("used_at") - F("issued_at"), output_field=DurationField())
        )
        print(qs)
        delays = list(qs.values_list("delay", flat=True))

        bins = {
            "0-2h": 0,
            "2-4h": 0,
            "4-6h": 0,
            "6-8h": 0,
            "8+h": 0
        }
        total_minutes = 0
        count = 0

        for d in delays:
            if d is None:
                continue
            minutes = d.total_seconds() / 60
            total_minutes += minutes
            count += 1

            if minutes < 120:
                bins["0-2h"] += 1
            elif minutes < 240:
                bins["2-4h"] += 1
            elif minutes < 360:
                bins["4-6h"] += 1
            elif minutes < 480:
                bins["6-8h"] += 1
            else:
                bins["8+h"] += 1

        avg_minutes = round(total_minutes / count, 1) if count else 0.0

        return Response(success(data={
            "range": {
                "start": start_dt.date().isoformat(),
                "end": now.date().isoformat()
            },
            "bins": [{ "interval": k, "count": v } for k, v in bins.items()],
            "average_duration_minutes": avg_minutes
        }))


