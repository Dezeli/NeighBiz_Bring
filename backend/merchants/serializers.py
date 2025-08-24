from rest_framework import serializers
from .models import Merchant

class SimpleMerchantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Merchant
        fields = ["id", "name", "category"]


class MyPageQRSerializer(serializers.Serializer):
    merchant_name = serializers.CharField()
    partnership_status = serializers.CharField()
    qr_image_url = serializers.CharField(allow_null=True)