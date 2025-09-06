import traceback

def custom_exception_handler(exc, context):
    from rest_framework.views import exception_handler
    from rest_framework.response import Response
    from common.response import failure

    response = exception_handler(exc, context)

    if response is not None:
        return Response(failure(
            message="입력값이 유효하지 않습니다." if response.status_code == 400 else str(exc),
            data=response.data,
            error_code="VALIDATION_ERROR" if response.status_code == 400 else "UNKNOWN_ERROR"
        ), status=response.status_code)

    print("💥 Unhandled Exception:", exc)
    traceback.print_exc()

    return Response(failure(
        message="처리되지 않은 서버 오류가 발생했습니다.",
        error_code="INTERNAL_ERROR"
    ), status=500)
