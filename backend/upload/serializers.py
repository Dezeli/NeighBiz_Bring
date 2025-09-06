from rest_framework import serializers


class UploadURLRequestSerializer(serializers.Serializer):
    filename = serializers.CharField(
        error_messages={
            "blank": "파일 이름을 입력해주세요.",
            "required": "파일 이름이 필요합니다.",
        }
    )
    content_type = serializers.CharField(
        error_messages={
            "blank": "파일 타입이 비어 있습니다.",
            "required": "파일 타입은 필수입니다.",
        }
    )
    image_type = serializers.ChoiceField(
        choices=["store_image", "business_license"],
        error_messages={
            "invalid_choice": "유효하지 않은 이미지 종류입니다.",
            "required": "이미지 종류는 필수입니다.",
        }
    )
