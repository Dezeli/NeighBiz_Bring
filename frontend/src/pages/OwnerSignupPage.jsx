import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { extractErrorMessage } from '../utils/response';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
`;

const ContentWrapper = styled.div`
  width: 100vw;
  max-width: 390px;
  min-height: 100vh;
  background: white;
  padding: 2rem 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  
  @media (min-width: 391px) {
    border-radius: 16px;
    min-height: 844px;
    max-height: 90vh;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(226, 232, 240, 0.8);
    overflow-y: auto;
  }
`;

const LogoSection = styled.div`
  margin-bottom: 2rem;
`;

const Logo = styled.h1`
  font-size: 2.25rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
  
  .neigh {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .biz {
    background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 500;
`;

const ProgressBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

const ProgressStep = styled.div`
  width: 80px;
  height: 4px;
  border-radius: 2px;
  background: ${props => props.active ? 
    'linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)' : 
    '#e5e7eb'
  };
  transition: all 0.3s ease;
`;

const FormContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(226, 232, 240, 0.6);
  border-radius: 16px;
  padding: 2rem 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
`;

const StepTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const InputGroup = styled.div`
  text-align: left;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  
  &::after {
    content: ' *';
    color: #ef4444;
  }
`;

const Input = styled.input`
  width: 100%;
  max-width: 100%;
  height: 48px;
  padding: 0 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    background: white;
  }

  &:disabled {
    background: #f9fafb;
    color: #9ca3af;
    cursor: not-allowed;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Select = styled.select`
  width: 100%;
  max-width: 100%;
  height: 48px;
  padding: 0 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    background: white;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  max-width: 100%;
  min-height: 80px;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  box-sizing: border-box;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    background: white;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const FileInputWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
  cursor: pointer;
`;

const FileInput = styled.input`
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
`;

const FileInputLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  background: rgba(249, 250, 251, 0.8);
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;

  &:hover {
    border-color: #10b981;
    color: #10b981;
    background: rgba(16, 185, 129, 0.05);
  }
`;

const UploadStatus = styled.div`
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 8px;
  color: #065f46;
  font-size: 0.875rem;
  text-align: center;
`;

const ErrorContainer = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ErrorText = styled.p`
  color: #dc2626;
  font-size: 0.875rem;
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  flex: 1;
  height: 48px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(135deg, #10b981 0%, #0ea5e9 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const SecondaryButton = styled(Button)`
  background: rgba(255, 255, 255, 0.9);
  color: #374151;
  border: 1px solid #e5e7eb;

  &:hover:not(:disabled) {
    background: white;
    border-color: #d1d5db;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoginLink = styled.button`
  background: none;
  border: none;
  color: #0ea5e9;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
  transition: all 0.3s ease;

  &:hover {
    color: #0284c7;
  }
`;

const Footer = styled.div`
  margin-top: 1.5rem;
  color: #9ca3af;
  font-size: 0.875rem;
`;

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
        return formData.phone_number.trim() && formData.username.trim() && formData.password.trim();
      case 2:
        return formData.name.trim() && formData.phone.trim() && formData.address.trim() && formData.category.trim();
      case 3:
        return formData.description.trim() && formData.image_url.trim() && formData.business_hours.trim();
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

  const handleSubmit = async () => {
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
            <StepTitle>계정 정보</StepTitle>
            <InputGroup>
              <Label>전화번호</Label>
              <Input 
                name="phone_number" 
                placeholder="전화번호를 입력하세요" 
                value={formData.phone_number} 
                onChange={handleChange}
                required
              />
            </InputGroup>
            <InputGroup>
              <Label>아이디</Label>
              <Input 
                name="username" 
                placeholder="아이디를 입력하세요" 
                value={formData.username} 
                onChange={handleChange}
                required
              />
            </InputGroup>
            <InputGroup>
              <Label>비밀번호</Label>
              <Input 
                name="password" 
                type="password" 
                placeholder="비밀번호를 입력하세요" 
                value={formData.password} 
                onChange={handleChange}
                required
              />
            </InputGroup>
          </>
        );
      case 2:
        return (
          <>
            <StepTitle>가게 정보</StepTitle>
            <InputGroup>
              <Label>가게명</Label>
              <Input 
                name="name" 
                placeholder="가게명을 입력하세요" 
                value={formData.name} 
                onChange={handleChange}
                required
              />
            </InputGroup>
            <InputGroup>
              <Label>가게 전화번호</Label>
              <Input 
                name="phone" 
                placeholder="가게 전화번호를 입력하세요" 
                value={formData.phone} 
                onChange={handleChange}
                required
              />
            </InputGroup>
            <InputGroup>
              <Label>주소</Label>
              <Input 
                name="address" 
                placeholder="주소를 입력하세요" 
                value={formData.address} 
                onChange={handleChange}
                required
              />
            </InputGroup>
            <InputGroup>
              <Label>카테고리</Label>
              <Select name="category" value={formData.category} onChange={handleChange} required>
                <option value="">카테고리를 선택하세요</option>
                <option value="cafe">카페</option>
                <option value="food">식당</option>
                <option value="beauty">미용</option>
                <option value="etc">기타</option>
              </Select>
            </InputGroup>
          </>
        );
      case 3:
        return (
          <>
            <StepTitle>상세 정보</StepTitle>
            <InputGroup>
              <Label>가게 설명</Label>
              <Textarea 
                name="description" 
                placeholder="가게에 대한 설명을 입력하세요" 
                value={formData.description} 
                onChange={handleChange}
                required
              />
            </InputGroup>
            <InputGroup>
              <Label>가게 이미지</Label>
              <FileInputWrapper>
                <FileInput 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  disabled={imageUploading}
                  required={!formData.image_url}
                />
                <FileInputLabel>
                  {imageUploading ? '업로드 중...' : '이미지를 선택하세요'}
                </FileInputLabel>
              </FileInputWrapper>
              {formData.image_url && (
                <UploadStatus>✓ 이미지 업로드 완료</UploadStatus>
              )}
            </InputGroup>
            <InputGroup>
              <Label>영업시간</Label>
              <Input 
                name="business_hours" 
                placeholder="예: 09:00 - 22:00" 
                value={formData.business_hours} 
                onChange={handleChange}
                required
              />
            </InputGroup>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Container>
      <ContentWrapper>
        <LogoSection>
          <Logo>
            <span className="neigh">Neigh</span>
            <span className="biz">Biz</span>
          </Logo>
          <Subtitle>사장님 회원가입</Subtitle>
        </LogoSection>

        <ProgressBar>
          <ProgressStep active={currentStep >= 1} />
          <ProgressStep active={currentStep >= 2} />
          <ProgressStep active={currentStep >= 3} />
        </ProgressBar>

        <FormContainer>
          <Form>
            {renderStepContent()}
            
            {error && (
              <ErrorContainer>
                <span>⚠️</span>
                <ErrorText>{error}</ErrorText>
              </ErrorContainer>
            )}

            <ButtonGroup>
              {currentStep > 1 && (
                <SecondaryButton type="button" onClick={prevStep}>
                  이전
                </SecondaryButton>
              )}
              {currentStep < 3 ? (
                <PrimaryButton type="button" onClick={nextStep}>
                  다음
                </PrimaryButton>
              ) : (
                <PrimaryButton 
                  type="button" 
                  onClick={handleSubmit}
                  disabled={isLoading || imageUploading || !validateStep(3)}
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner />
                      가입 중...
                    </>
                  ) : (
                    '회원가입 완료'
                  )}
                </PrimaryButton>
              )}
            </ButtonGroup>
          </Form>
        </FormContainer>

        <Footer>
          이미 계정이 있으신가요?{' '}
          <LoginLink onClick={() => navigate('/login')}>
            로그인하기
          </LoginLink>
        </Footer>
      </ContentWrapper>
    </Container>
  );
};

export default OwnerSignupPage;