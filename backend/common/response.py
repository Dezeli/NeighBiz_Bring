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

def failure(message=None, data=None, error_code="ERROR"):
    data = data or {}

    extracted_message = None
    if isinstance(data, dict):
        try:
            first_key = next(iter(data))
            first_error = data[first_key]
            if isinstance(first_error, list):
                extracted_message = str(first_error[0])
            else:
                extracted_message = str(first_error)
        except Exception:
            pass

    final_message = extracted_message or message or "서버와의 문제가 발생했습니다."

    return {
        "success": False,
        "message": final_message,
        "data": data,
        "error_code": error_code
    }
