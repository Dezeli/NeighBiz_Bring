export const extractFirstError = (err, defaultMsg = '오류가 발생했습니다.') => {
  const dataErrors = err?.response?.data?.data;

  if (dataErrors && typeof dataErrors === 'object') {
    const firstField = Object.keys(dataErrors)[0];
    if (firstField && Array.isArray(dataErrors[firstField])) {
      return dataErrors[firstField][0];
    }
  }

  return err?.response?.data?.message || defaultMsg;
};
