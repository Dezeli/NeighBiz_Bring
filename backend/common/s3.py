import boto3
from django.conf import settings

def generate_presigned_url(key: str, expires_in: int = None) -> str:
    if not key:
        return None

    s3_client = boto3.client(
        "s3",
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_REGION,
    )

    try:
        url = s3_client.generate_presigned_url(
            ClientMethod="get_object",
            Params={
                "Bucket": settings.AWS_S3_BUCKET,
                "Key": key,
            },
            ExpiresIn=expires_in or settings.AWS_S3_PRESIGNED_EXPIRES,
        )
        return url
    except Exception as e:
        print("❌ Failed to generate presigned URL:", e)
        return None
