import uuid
import boto3
from botocore.exceptions import ClientError
from django.conf import settings
from rest_framework.views import APIView
from utils.response import success, failure
from rest_framework.response import Response
from botocore.client import Config
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from merchants.models import Merchant
from partnerships.models import Partnership
from .serializers import MyPageQRSerializer



class MerchantImageUploadPresignedURLView(APIView):
    permission_classes = []

    def post(self, request):
        filename = request.data.get("filename")
        content_type = request.data.get("content_type")

        if not filename or not content_type:
            return Response(failure("filename과 content_type은 필수입니다."))

        ext = filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4()}.{ext}"
        s3_key = f"merchants/temp/{unique_filename}"

        s3_client = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION,
            config=Config(s3={'addressing_style': 'virtual'})
        )

        try:
            presigned_url = s3_client.generate_presigned_url(
                "put_object",
                Params={
                    "Bucket": settings.AWS_S3_BUCKET,
                    "Key": s3_key,
                    "ContentType": content_type,
                },
                ExpiresIn=settings.AWS_S3_PRESIGNED_EXPIRES,
            )
        except ClientError as e:
            return Response(failure("S3 URL 생성 중 오류 발생", data=str(e)))

        final_image_url = f"https://{settings.AWS_S3_BUCKET}.s3.{settings.AWS_REGION}.amazonaws.com/{s3_key}"

        return Response(success({
            "upload_url": presigned_url,
            "image_url": final_image_url
        }, "업로드용 presigned URL 생성 성공"))
    


class MyMerchantPageView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            merchant = Merchant.objects.get(user=request.user)
        except Merchant.DoesNotExist:
            return Response(failure(message="가게 정보가 존재하지 않습니다."))

        partnership = Partnership.objects.filter(
            status="active"
        ).filter(
            Q(merchant_a=merchant) | Q(merchant_b=merchant)
        ).first()

        partnership_status = "active" if partnership else "none"
        qr_image_url = None

        if partnership:
            slug = partnership.slug_for_a if partnership.merchant_a == merchant else partnership.slug_for_b
            filename = f"qrcodes/{slug}.png"

            s3_client = boto3.client(
                "s3",
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_REGION,
                endpoint_url=f"https://s3.{settings.AWS_REGION}.amazonaws.com",
                config=Config(signature_version="s3v4"),
            )

            try:
                qr_image_url = s3_client.generate_presigned_url(
                    "get_object",
                    Params={"Bucket": settings.AWS_S3_BUCKET, "Key": filename},
                    ExpiresIn=3600,
                )
            except Exception as e:
                return Response(failure(message="QR 이미지 URL 생성 실패", data=str(e)))

        serializer = MyPageQRSerializer({
            "merchant_name": merchant.name,
            "partnership_status": partnership_status,
            "qr_image_url": qr_image_url,
        })

        return Response(success(serializer.data, "마이페이지 정보 반환 성공"))