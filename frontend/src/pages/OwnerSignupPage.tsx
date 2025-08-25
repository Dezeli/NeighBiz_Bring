import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { extractErrorMessage } from '../utils/response';

const OwnerSignupPage = () => {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    phone_number: '',
    username: '',
    password: '',
    name: '',
    phone: '',
    address: '',
    category: '',
    description: '',
    image_url: '',
    business_hours: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 파일 체크
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 파일 크기 체크 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('이미지 크기는 5MB 이하로 업로드해주세요.');
      return;
    }

    setImageUploading(true);
    setError('');

    try {
      // 1. Presigned URL 요청
      const presignRes = await api.post('/merchants/cover/presign/', {
        content_type: file.type,
        filename: file.name,
      });

      if (!presignRes.data.success) {
        throw new Error('업로드 URL 생성에 실패했습니다.');
      }

      const { upload_url, image_url } = presignRes.data.data;

      // 2. S3에 이미지 업로드
      const uploadRes = await fetch(upload_url, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error('이미지 업로드에 실패했습니다.');
      }

      // 3. 폼 데이터에 이미지 URL 저장
      setFormData(prev => ({ ...prev, image_url }));
    } catch (err: any) {
      setError(err.message || '이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setImageUploading(false);
    }
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.phone_number && formData.username && formData.password;
      case 2:
        return formData.name && formData.phone && formData.address && formData.category;
      case 3:
        return formData.description && formData.image_url && formData.business_hours;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      setError('');
    } else {
      setError('모든 필수 항목을 입력해주세요.');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await api.post('/auth/owner/signup', formData);

      if (!res.data.success) {
        setError(extractErrorMessage(res.data));
        return;
      }

      // 성공 메시지 표시 후 로그인 페이지로 이동
      alert('🎉 회원가입이 완료되었습니다!\n로그인 페이지로 이동합니다.');
      navigate('/login');
    } catch (err: any) {
      const msg = extractErrorMessage(err.response?.data);
      setError(msg || '회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">계정 정보</h2>
              <p className="text-gray-500">로그인에 사용할 정보를 입력해주세요</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📱 전화번호 *
              </label>
              <input
                type="tel"
                name="phone_number"
                placeholder="01012345678"
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full h-14 px-4 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                👤 아이디 *
              </label>
              <input
                type="text"
                name="username"
                placeholder="owner001"
                value={formData.username}
                onChange={handleChange}
                className="w-full h-14 px-4 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔒 비밀번호 *
              </label>
              <input
                type="password"
                name="password"
                placeholder="8자 이상 입력해주세요"
                value={formData.password}
                onChange={handleChange}
                className="w-full h-14 px-4 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">가게 기본정보</h2>
              <p className="text-gray-500">고객에게 보여질 가게 정보를 입력해주세요</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🏪 가게명 *
              </label>
              <input
                type="text"
                name="name"
                placeholder="네이버김사장"
                value={formData.name}
                onChange={handleChange}
                className="w-full h-14 px-4 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ☎️ 가게 전화번호 *
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="02-123-4567"
                value={formData.phone}
                onChange={handleChange}
                className="w-full h-14 px-4 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📍 주소 *
              </label>
              <input
                type="text"
                name="address"
                placeholder="서울특별시 중구 테헤란로 123"
                value={formData.address}
                onChange={handleChange}
                className="w-full h-14 px-4 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🏷️ 카테고리 *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full h-14 px-4 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                required
              >
                <option value="">카테고리를 선택해주세요</option>
                <option value="cafe">☕ 카페</option>
                <option value="restaurant">🍽️ 식당</option>
                <option value="beauty">💄 미용</option>
                <option value="etc">🛍️ 기타</option>
              </select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">상세 정보</h2>
              <p className="text-gray-500">가게의 매력을 어필해보세요</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📝 가게 설명 *
              </label>
              <textarea
                name="description"
                placeholder="서울 강남의 핫플레이스 카페입니다."
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📸 가게 이미지 *
              </label>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full h-14 px-4 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {imageUploading && (
                  <div className="flex items-center text-blue-600">
                    <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mr-2"></div>
                    이미지 업로드 중...
                  </div>
                )}
                {formData.image_url && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                    <p className="text-sm text-green-700 flex items-center">
                      <span className="mr-2">✅</span>
                      이미지 업로드 완료
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🕐 영업시간 *
              </label>
              <input
                type="text"
                name="business_hours"
                placeholder="매일 10:00 ~ 22:00"
                value={formData.business_hours}
                onChange={handleChange}
                className="w-full h-14 px-4 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl text-white">🏪</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">네이비즈 가입</h1>
          <p className="text-gray-500">소상공인 제휴 플랫폼에 오신 것을 환영합니다</p>
        </div>

        {/* 진행상황 표시 */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-lg">
          <div className="flex justify-between items-center mb-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step <= currentStep
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>계정 정보</span>
            <span>가게 정보</span>
            <span>상세 정보</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* 폼 */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <form onSubmit={handleSubmit}>
            {renderStepContent()}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-6">
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">⚠️</span>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

            {/* 버튼 */}
            <div className="flex space-x-4 mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 h-14 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
                >
                  이전
                </button>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  다음
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading || imageUploading}
                  className="flex-1 h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      가입 중...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">🎉</span>
                      회원가입 완료
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          {/* 로그인 링크 */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              이미 계정이 있으신가요?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
              >
                로그인하기
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerSignupPage;