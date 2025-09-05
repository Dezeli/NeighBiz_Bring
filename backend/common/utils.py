import random
import string
import uuid


def generate_short_code(length: int = 8) -> str:
    """
    8자리 영문+숫자 문자열, 쿠폰 식별용 번호로 활용
    """
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))


def generate_slug(length: int = 10) -> str:
    """
    10자리 랜덤 문자열, QR 링크로 활용
    """
    return uuid.uuid4().hex[:length]
