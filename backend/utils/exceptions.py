from rest_framework.exceptions import APIException
from rest_framework.views import exception_handler as drf_exception_handler
from utils.response import failure


class BaseAPIException(APIException):
    status_code = 400
    default_detail = "요청 처리에 실패했습니다."
    default_code = "bad_request"
    error_code = "UNKNOWN_ERROR"

    def __init__(self, detail=None, error_code=None, data=None):
        self.detail = {
            "success": False,
            "data": data or {},
            "message": detail or self.default_detail,
            "error_code": error_code or self.error_code,
        }


# ✅ 커스텀 예외 정의 (필요시 추가)
class RateLimitExceededException(BaseAPIException):
    default_detail = "요청이 너무 자주 발생했습니다. 잠시 후 다시 시도해주세요."
    error_code = "AUTH_RATE_LIMITED"


class InvalidCodeException(BaseAPIException):
    default_detail = "인증번호가 유효하지 않거나 일치하지 않습니다."
    error_code = "CODE_INVALID"


class AlreadyVerifiedException(BaseAPIException):
    default_detail = "이미 인증이 완료된 사용자입니다."
    error_code = "ALREADY_VERIFIED"


class PermissionDeniedException(BaseAPIException):
    default_detail = "해당 요청에 대한 권한이 없습니다."
    error_code = "PERMISSION_DENIED"


# ✅ 공통 예외 핸들러
def custom_exception_handler(exc, context):
    """
    모든 예외에 대해 일관된 응답 포맷을 적용합니다.
    """

    # 1. BaseAPIException 또는 하위 클래스일 경우 → 그대로 반환
    if isinstance(exc, BaseAPIException):
        return exc.get_response()

    # 2. DRF 기본 예외일 경우 → 포맷만 통일
    response = drf_exception_handler(exc, context)

    if response is not None:
        error_message = ""

        if isinstance(response.data, dict):
            first_value = next(iter(response.data.values()))
            error_message = (
                first_value[0] if isinstance(first_value, list) else str(first_value)
            )
        else:
            error_message = str(response.data)

        return response.__class__(
            failure(
                message=error_message,
                error_code="VALIDATION_ERROR",
                data=response.data
            ),
            status=response.status_code
        )

    # 3. 처리되지 않은 예외 (500 등)
    return None
