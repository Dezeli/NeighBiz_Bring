# common/exceptions.py

from rest_framework.exceptions import APIException


class CustomAPIException(APIException):
    status_code = 400
    default_detail = "서버 오류가 발생했습니다."
    default_code = "custom_error"

    def __init__(self, detail=None, status_code=None):
        if status_code:
            self.status_code = status_code
        super().__init__(detail or self.default_detail)
