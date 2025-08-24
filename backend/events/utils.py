from events.models import EventLog

def log_event(event_type, coupon, user=None, request=None, metadata=None):
    EventLog.objects.create(
        event_type=event_type,
        coupon=coupon,
        user=user,
        ip_address=getattr(request, "META", {}).get("REMOTE_ADDR") if request else None,
        user_agent=getattr(request, "META", {}).get("HTTP_USER_AGENT") if request else None,
        device_hash=getattr(request, "META", {}).get("HTTP_X_DEVICE_HASH") if request else None,
        metadata=metadata or {},
    )
