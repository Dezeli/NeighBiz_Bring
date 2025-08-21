from rest_framework.views import exception_handler as drf_exception_handler
from utils.response import failure

def custom_exception_handler(exc, context):
    response = drf_exception_handler(exc, context)

    if response is not None:
        # DRF가 기본적으로 처리한 오류
        error_message = ""
        if isinstance(response.data, dict):
            # 단일 필드 에러 메시지를 문자열로 변환
            error_message = next(iter(response.data.values()))[0] if isinstance(next(iter(response.data.values())), list) else str(next(iter(response.data.values())))
        else:
            error_message = str(response.data)

        return response.__class__(
            failure(
                message=error_message,
                error_code=response.status_code,
                data=response.data
            ),
            status=response.status_code
        )

    # DRF가 처리하지 못한 예외 (500 등)
    return response
