from rest_framework import serializers
from .models import Post
from merchants.serializers import SimpleMerchantSerializer

class PostListSerializer(serializers.ModelSerializer):
    author = SimpleMerchantSerializer(source="author_merchant")

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "description",
            "expected_value",
            "expected_duration",
            "status",
            "created_at",
            "author",
        ]
