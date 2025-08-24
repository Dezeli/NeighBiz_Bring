from rest_framework.generics import ListAPIView
from .models import Post
from .serializers import PostListSerializer
from rest_framework.permissions import IsAuthenticated

class PostListView(ListAPIView):
    queryset = Post.objects.filter(deleted_at__isnull=True).order_by("-created_at")
    serializer_class = PostListSerializer
    permission_classes = [IsAuthenticated]