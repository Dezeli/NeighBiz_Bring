def success(data=None, message="요청이 성공적으로 처리되었습니다."):
    return {
        "success": True,
        "data": data or {},
        "message": message,
        "error_code": None,
    }


def failure(message="요청 처리에 실패했습니다.", error_code="UNKNOWN_ERROR", data=None):
    return {
        "success": False,
        "data": data or {},
        "message": message,
        "error_code": error_code,
    }
