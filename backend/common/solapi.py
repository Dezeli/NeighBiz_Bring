import uuid
import hmac
import hashlib
from requests import Request, Session
from datetime import datetime, timezone
from django.conf import settings

def generate_solapi_headers():
    api_key = settings.SOLAPI_API_KEY
    api_secret = settings.SOLAPI_API_SECRET

    salt = uuid.uuid4().hex
    date = datetime.now(timezone.utc).replace(microsecond=0).isoformat()

    message = f"{date}{salt}"
    signature = hmac.new(
        api_secret.encode(),
        message.encode(),
        hashlib.sha256
    ).hexdigest()

    authorization = (
        f"HMAC-SHA256 apiKey={api_key}, date={date}, salt={salt}, signature={signature}"
    )

    return {
        "Authorization": authorization,
        "Content-Type": "application/json"
    }

def send_sms(phone_number: str, message: str):
    sender = settings.SOLAPI_SENDER_NUMBER

    payload = {
        "messages": [
            {
                "to": phone_number,
                "from": sender,
                "text": message
            }
        ]
    }

    headers = generate_solapi_headers()

    req = Request(
        "POST",
        "https://api.solapi.com/messages/v4/send-many",
        headers=headers,
        json=payload
    ).prepare()

    session = Session()
    response = session.send(req)

    if not response.ok:
        raise Exception(f"SMS 전송 실패: {response.status_code} - {response.text}")