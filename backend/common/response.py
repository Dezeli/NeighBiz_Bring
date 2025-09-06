def success(data=None, message=None):
    if isinstance(message, str):
        data = data or {}
        data["global"] = message
    return {
        "success": True,
        "data": data or {},
        "message": "API 요청이 성공적으로 처리되었습니다.",
        "error_code": None
    }

def failure(message="서버와의 문제가 발생했습니다.", data=None, error_code="UNKNOWN_ERROR"):
    return {
        "success": False,
        "message": message,
        "data": data or {},  # ❌ 여기서 data가 dict가 아닐 경우 'global' 키로 래핑하지 마
        "error_code": error_code
    }
