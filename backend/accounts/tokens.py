from rest_framework_simplejwt.tokens import RefreshToken as SimpleRefreshToken
from accounts.models import RefreshToken as StoredRefreshToken
from datetime import timedelta
from django.utils import timezone

def issue_tokens_for_user(user, request=None, session_scope="guest"):
    simple_refresh = SimpleRefreshToken.for_user(user)

    simple_refresh["role"] = session_scope
    simple_refresh.access_token["role"] = session_scope

    user_agent = request.META.get("HTTP_USER_AGENT", "") if request else ""
    device_hash = request.META.get("HTTP_X_DEVICE_HASH", "") if request else ""

    StoredRefreshToken.objects.create(
        user=user,
        token=str(simple_refresh),
        session_scope=session_scope,
        device_info=device_hash or user_agent,
        expires_at=timezone.now() + timedelta(days=30)
    )

    return {
        "access": str(simple_refresh.access_token),
        "refresh": str(simple_refresh),
    }