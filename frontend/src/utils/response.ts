// utils/response.ts

export const extractErrorMessage = (resData: any): string => {
  if (!resData) return '에러 응답이 없습니다.';

  return (
    resData.message ||
    resData.data?.non_field_errors?.[0] ||
    resData.data?.detail ||
    resData.error_code ||
    '알 수 없는 오류가 발생했습니다.'
  );
};
