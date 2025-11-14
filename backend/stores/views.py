# stores/views.py
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from stores.models import Store
from stores.serializers import StoreUpdateSerializer, PostSerializer, PostDetailSerializer
from common.response import success, failure


from rest_framework.generics import ListAPIView
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend, FilterSet, filters
from coupons.models import CouponPolicy
from partnerships.models import Partnership
from rest_framework.generics import RetrieveAPIView


class StoreUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = request.user
        try:
            store = Store.objects.get(owner=user)
        except Store.DoesNotExist:
            return Response(failure(message="가게 정보가 존재하지 않습니다."), status=404)

        serializer = StoreUpdateSerializer(store, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(success(message="가게 정보가 수정되었습니다."))
        return Response(failure(message="가게 정보 수정에 실패했습니다.", data=serializer.errors))
    


class CouponPolicyInlineFilter(FilterSet):
    category = filters.CharFilter(field_name="store__category", lookup_expr="exact")
    description = filters.CharFilter(field_name="description", lookup_expr="icontains")
    expected_value_min = filters.NumberFilter(field_name="expected_value", lookup_expr="gte")
    expected_value_max = filters.NumberFilter(field_name="expected_value", lookup_expr="lte")
    duration = filters.CharFilter(field_name="expected_duration", lookup_expr="exact")
    monthly_limit_min = filters.NumberFilter(field_name="monthly_limit", lookup_expr="gte")
    monthly_limit_max = filters.NumberFilter(field_name="monthly_limit", lookup_expr="lte")
    updated_at = filters.DateFromToRangeFilter(field_name="updated_at")
    is_partnered = filters.CharFilter(method="filter_by_partnership")

    class Meta:
        model = CouponPolicy
        fields = []

    def filter_by_partnership(self, queryset, name, value):
        partner_ids_a = Partnership.objects.filter(status="active").values_list("store_a_id", flat=True)
        partner_ids_b = Partnership.objects.filter(status="active").values_list("store_b_id", flat=True)
        partner_ids = set(partner_ids_a) | set(partner_ids_b)

        if value.lower() == "true":
            return queryset.filter(store_id__in=partner_ids)
        elif value.lower() == "false":
            return queryset.exclude(store_id__in=partner_ids)
        return queryset


class PostListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = CouponPolicy.objects.select_related("store__owner").filter(is_active=True)
    serializer_class = PostSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = CouponPolicyInlineFilter
    ordering_fields = ["updated_at", "expected_value", "monthly_limit"]
    ordering = ["-updated_at"]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(success(data=serializer.data))

    def get_paginated_response(self, data):
        return Response(success(data={
            "count": self.paginator.page.paginator.count,
            "next": self.paginator.get_next_link(),
            "previous": self.paginator.get_previous_link(),
            "results": data
        }))


class PostDetailView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Store.objects.select_related("owner")
    serializer_class = PostDetailSerializer
    lookup_field = "id"

    def retrieve(self, request, *args, **kwargs):
        try:
            store = self.get_object()
        except Store.DoesNotExist:
            return Response(failure("존재하지 않는 가게입니다."), status=404)

        serializer = self.get_serializer(store)
        return Response(success(data=serializer.data))