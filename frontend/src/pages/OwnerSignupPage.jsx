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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드 가능합니다.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('이미지 크기는 5MB 이하로 업로드해주세요.');
      return;
    }

    setImageUploading(true);
    setError('');

    try {
      const presignRes = await api.post('/merchants/cover/presign/', {
        content_type: file.type,
        filename: file.name,
      });

      if (!presignRes.data.success) {
        throw new Error('업로드 URL 생성에 실패했습니다.');
      }

      const { upload_url, image_url } = presignRes.data.data;

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

      setFormData((prev) => ({ ...prev, image_url }));
    } catch (err) {
      setError(err.message || '이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setImageUploading(false);
    }
  };

  const validateStep = (step) => {
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
      setCurrentStep((prev) => prev + 1);
      setError('');
    } else {
      setError('모든 필수 항목을 입력해주세요.');
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await api.post('/auth/owner/signup', formData);

      if (!res.data.success) {
        setError(extractErrorMessage(res.data));
        return;
      }

      alert('🎉 회원가입이 완료되었습니다!\n로그인 페이지로 이동합니다.');
      navigate('/login');
    } catch (err) {
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
          <>
            <h2>계정 정보</h2>
            <input name="phone_number" placeholder="전화번호" value={formData.phone_number} onChange={handleChange} />
            <input name="username" placeholder="아이디" value={formData.username} onChange={handleChange} />
            <input name="password" placeholder="비밀번호" type="password" value={formData.password} onChange={handleChange} />
          </>
        );
      case 2:
        return (
          <>
            <h2>가게 정보</h2>
            <input name="name" placeholder="가게명" value={formData.name} onChange={handleChange} />
            <input name="phone" placeholder="가게 전화번호" value={formData.phone} onChange={handleChange} />
            <input name="address" placeholder="주소" value={formData.address} onChange={handleChange} />
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="">선택</option>
              <option value="cafe">카페</option>
              <option value="restaurant">식당</option>
              <option value="beauty">미용</option>
              <option value="etc">기타</option>
            </select>
          </>
        );
      case 3:
        return (
          <>
            <h2>상세 정보</h2>
            <textarea name="description" placeholder="가게 설명" value={formData.description} onChange={handleChange} />
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {formData.image_url && <p>이미지 업로드 완료</p>}
            <input name="business_hours" placeholder="영업시간" value={formData.business_hours} onChange={handleChange} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <h1>네이비즈 가입</h1>
      <form onSubmit={handleSubmit}>
        {renderStepContent()}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div>
          {currentStep > 1 && <button type="button" onClick={prevStep}>이전</button>}
          {currentStep < 3 ? (
            <button type="button" onClick={nextStep}>다음</button>
          ) : (
            <button type="submit" disabled={isLoading || imageUploading}>
              {isLoading ? '가입 중...' : '회원가입 완료'}
            </button>
          )}
        </div>
      </form>
      <p>
        이미 계정이 있으신가요?{' '}
        <button onClick={() => navigate('/login')}>로그인하기</button>
      </p>
    </div>
  );
};

export default OwnerSignupPage;
