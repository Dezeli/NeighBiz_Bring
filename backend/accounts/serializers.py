from rest_framework import serializers

class RequestCodeSerializer(serializers.Serializer):
    phone_number = serializers.RegexField(
        regex=r"^010\d{8}$",
        max_length=11,
        min_length=11,
        error_messages={"invalid": "유효한 휴대폰 번호를 입력해주세요."}
    )


class VerifyCodeSerializer(serializers.Serializer):
    phone_number = serializers.CharField()
    code = serializers.CharField()