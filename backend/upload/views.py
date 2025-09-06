import uuid
import boto3
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import UploadURLRequestSerializer
from common.response import success, failure


class UploadURLView(APIView):
    permission_classes = []  # 토큰 요구 X

    def post(self, request):
        serializer = UploadURLRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                failure(message="입력값이 유효하지 않습니다.", data=serializer.errors),
                status=status.HTTP_400_BAD_REQUEST
            )

        data = serializer.validated_data
        filename = data["filename"]
        content_type = data["content_type"]
        image_type = data["image_type"]

        # UUID 기반 S3 Key 구성
        key_uuid = uuid.uuid4()
        s3_key = f"{image_type}/{key_uuid}_{filename}"

        # Presigned PUT URL 생성
        try:
            s3_client = boto3.client(
                "s3",
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_REGION,
            )

            presigned_url = s3_client.generate_presigned_url(
                ClientMethod="put_object",
                Params={
                    "Bucket": settings.AWS_S3_BUCKET,
                    "Key": s3_key,
                    "ContentType": content_type
                },
                ExpiresIn=settings.AWS_S3_PRESIGNED_EXPIRES,
                HttpMethod="PUT",
            )
        except Exception as e:
            return Response(
                failure(message="Presigned URL 생성에 실패했습니다.", data={"error": str(e)}),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # 공개 이미지면 public URL 생성
        if image_type == "store_image":
            key_to_return = f"https://{settings.AWS_S3_BUCKET}.s3.amazonaws.com/{s3_key}"
        else:
            key_to_return = s3_key  # 비공개 이미지일 경우 S3 key만 저장

        return Response(
            success(
                data={
                    "upload_url": presigned_url,
                    "key": key_to_return
                },
                message="업로드 URL이 생성되었습니다.",
            )
        )