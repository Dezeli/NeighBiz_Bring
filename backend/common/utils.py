import random
import string
import uuid
from partnerships.models import Partnership
from datetime import timedelta
from .enums import PartnershipDuration 
from rest_framework import serializers


def generate_verification_code(length=6) -> str:
    
    """
    숫자 6자리, 휴대폰 인증 번호로 활용
    """
    return ''.join(random.choices('0123456789', k=length))


def generate_short_code(length: int = 8) -> str:
    """
    8자리 영문+숫자 문자열, 쿠폰 식별용 번호로 활용
    """
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))


def generate_slug(length: int = 10) -> str:
    """
    10자리 랜덤 문자열, QR 링크로 활용
    """
    while True:
        slug = uuid.uuid4().hex[:length]
        if not Partnership.objects.filter(slug_for_a=slug).exists() and \
           not Partnership.objects.filter(slug_for_b=slug).exists():
            return slug




def generate_temp_password(length=8):
    """
    8자리 랜덤 문자열, 비밀번호 재설정
    """
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))




def parse_partnership_duration(duration_str: str) -> timedelta:
    """Enum 문자열을 timedelta로 변환한다."""
    mapping = {
        PartnershipDuration.ONE_MONTH.value: timedelta(days=30),
        PartnershipDuration.TWO_MONTHS.value: timedelta(days=60),
        PartnershipDuration.THREE_MONTHS.value: timedelta(days=90),
        PartnershipDuration.SIX_MONTHS.value: timedelta(days=180),
        PartnershipDuration.ONE_YEAR.value: timedelta(days=365),
    }

    if duration_str not in mapping:
        raise serializers.ValidationError("지원하지 않는 제휴 기간입니다.")

    return mapping[duration_str]
