from accounts.models import VerificationCode, User
from django.utils import timezone
from datetime import timedelta
from .solapi import send_sms
import random
from django.core.exceptions import ValidationError
from .tokens import issue_tokens_for_user
from typing import Tuple


def generate_code():
    return str(random.randint(100000, 999999))

def send_verification_code(phone_number: str) -> str:
    code = generate_code()
    now = timezone.now()

    VerificationCode.objects.create(
        phone_number=phone_number,
        code=code,
        expires_at=now + timedelta(minutes=5)
    )

    send_sms(phone_number, f"[NeighBiz] 인증번호는 {code}입니다.")
    return code



def verify_code_and_get_or_create_user(phone_number: str, code: str, request=None) -> Tuple[User, dict]:
    now = timezone.now()

    code_obj = VerificationCode.objects.filter(
        phone_number=phone_number,
        is_verified=False,
        expires_at__gt=now
    ).order_by("-created_at").first()

    if not code_obj:
        raise ValidationError("유효한 인증번호가 없습니다.")
    if code_obj.code != code:
        raise ValidationError("인증번호가 일치하지 않습니다.")

    code_obj.is_verified = True
    code_obj.save(update_fields=["is_verified"])

    user, _ = User.objects.get_or_create(
        phone_number=phone_number,
        defaults={"role": "guest"}
    )

    tokens = issue_tokens_for_user(user, request)

    return user, tokens