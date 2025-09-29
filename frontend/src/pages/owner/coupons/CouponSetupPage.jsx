import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

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
  display: flex;
  flex-direction: column;
  
  @media (min-width: 391px) {
    border-radius: 16px;
    min-height: 844px;
    max-height: 90vh;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(226, 232, 240, 0.8);
    overflow-y: auto;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  background: none;
  border: none;
  font-size: 0.875rem;
  cursor: pointer;
  margin-bottom: 1.5rem;
  transition: color 0.3s ease;

  &:hover {
    color: #374151;
  }
`;

const Logo = styled.h1`
  font-size: 1.75rem;
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

const PageTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const PageDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
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

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
  height: 52px;
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
  height: 52px;
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
  min-height: 90px;
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

const ValueSection = styled.div`
  background: rgba(248, 250, 252, 0.8);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(226, 232, 240, 0.6);
`;

const ValueTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ValueGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const HelpText = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
  line-height: 1.4;
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

const SuccessContainer = styled.div`
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SuccessText = styled.p`
  color: #065f46;
  font-size: 0.875rem;
  margin: 0;
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 52px;
  background: linear-gradient(135deg, #10b981 0%, #0ea5e9 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

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

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const InfoBox = styled.div`
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 16px;
  padding: 1.25rem;
  margin-top: 1.5rem;
`;

const InfoHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`;

const InfoIcon = styled.span`
  color: #3b82f6;
  font-size: 1.25rem;
  margin-top: 0.125rem;
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoTitle = styled.p`
  color: #1e40af;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const InfoList = styled.ul`
  color: #3730a3;
  font-size: 0.75rem;
  line-height: 1.5;
  margin: 0;
  padding-left: 1rem;
  list-style-type: disc;
`;

const InfoListItem = styled.li`
  margin-bottom: 0.25rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const CouponSetupPage = () => {
  const navigate = useNavigate();
  const { apiCall } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    description: '',
    expected_value: '',
    expected_duration: '3_months',
    monthly_limit: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const submitData = {
        description: formData.description.trim(),
        expected_value: parseInt(formData.expected_value),
        expected_duration: formData.expected_duration,
        monthly_limit: parseInt(formData.monthly_limit),
      };

      const response = await apiCall({
        method: 'POST',
        url: '/coupons/policy/',
        data: submitData,
      });

      if (response?.success) {
        setSuccess('쿠폰 정책이 성공적으로 등록되었습니다!');
        setTimeout(() => {
          navigate('/owner/mypage');
        }, 2000);
      } else {
        setError(response?.message || '쿠폰 정책 등록에 실패했습니다.');
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || '쿠폰 정책 등록에 실패했습니다.');
      } else {
        setError('쿠폰 정책 등록 중 오류가 발생했습니다. 네트워크를 확인해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const durationOptions = [
    { value: 'day', label: '1일' },
    { value: 'week', label: '1주일' },
    { value: '1_month', label: '1개월' },
    { value: '3_months', label: '3개월' },
    { value: '6_months', label: '6개월' },
    { value: 'unlimited', label: '무기한' },
  ];

  const formatPrice = (value) => {
    if (!value) return '';
    return parseInt(value).toLocaleString('ko-KR');
  };

  const isFormValid = () => {
    return (
      formData.description.trim() &&
      formData.expected_value &&
      formData.monthly_limit &&
      parseInt(formData.expected_value) > 0 &&
      parseInt(formData.monthly_limit) > 0
    );
  };

  return (
    <Container>
      <ContentWrapper>
        <Header>
          <BackButton onClick={() => navigate('/owner/mypage')}>
            ← 마이페이지로 돌아가기
          </BackButton>

          <Logo>
            <span className="neigh">Neigh</span>
            <span className="biz">Biz</span>
          </Logo>
          <PageTitle>쿠폰 정책 설정</PageTitle>
          <PageDescription>고객에게 제공할 쿠폰의 조건을 설정해주세요</PageDescription>
        </Header>

        <FormContainer>
          <Form>
            <InputGroup>
              <Label>쿠폰 설명</Label>
              <Textarea
                name="description"
                placeholder="예: 음료 1잔 무료 제공"
                value={formData.description}
                onChange={handleChange}
                required
              />
              <HelpText>고객에게 표시될 쿠폰의 내용을 구체적으로 작성해주세요</HelpText>
            </InputGroup>

            <ValueSection>
              <ValueTitle>🎯 쿠폰 조건 설정</ValueTitle>
              
              <ValueGrid>
                <InputGroup>
                  <Label>예상 가치 (원)</Label>
                  <Input
                    type="number"
                    name="expected_value"
                    placeholder="5000"
                    value={formData.expected_value}
                    onChange={handleChange}
                    min="100"
                    step="100"
                    required
                  />
                  <HelpText>
                    {formData.expected_value ? `${formatPrice(formData.expected_value)}원` : '쿠폰의 예상 가치'}
                  </HelpText>
                </InputGroup>

                <InputGroup>
                  <Label>월 한도 (매)</Label>
                  <Input
                    type="number"
                    name="monthly_limit"
                    placeholder="100"
                    value={formData.monthly_limit}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                  <HelpText>한 달에 발급 가능한 쿠폰 수</HelpText>
                </InputGroup>
              </ValueGrid>

              <InputGroup style={{ marginTop: '1rem' }}>
                <Label>유효 기간</Label>
                <Select
                  name="expected_duration"
                  value={formData.expected_duration}
                  onChange={handleChange}
                  required
                >
                  {durationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                <HelpText>쿠폰이 유효한 기간을 선택해주세요</HelpText>
              </InputGroup>
            </ValueSection>

            {error && (
              <ErrorContainer>
                <span>⚠️</span>
                <ErrorText>{error}</ErrorText>
              </ErrorContainer>
            )}

            {success && (
              <SuccessContainer>
                <span>✅</span>
                <SuccessText>{success}</SuccessText>
              </SuccessContainer>
            )}

            <SubmitButton
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || !isFormValid()}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  등록 중...
                </>
              ) : (
                <>
                  <span>🚀</span>
                  쿠폰 정책 등록하기
                </>
              )}
            </SubmitButton>
          </Form>

          <InfoBox>
            <InfoHeader>
              <InfoIcon>💡</InfoIcon>
              <InfoContent>
                <InfoTitle>쿠폰 정책 등록 안내</InfoTitle>
                <InfoList>
                  <InfoListItem>정책 등록 후 제휴 게시글에서 다른 사장님과 제휴할 수 있습니다</InfoListItem>
                  <InfoListItem>제휴 성사 시 QR 코드가 자동 생성됩니다</InfoListItem>
                  <InfoListItem>월 한도는 자동으로 관리되며 초과 시 발급이 중단됩니다</InfoListItem>
                  <InfoListItem>등록 후 수정도 가능하니 부담없이 설정해보세요</InfoListItem>
                </InfoList>
              </InfoContent>
            </InfoHeader>
          </InfoBox>
        </FormContainer>
      </ContentWrapper>
    </Container>
  );
};

export default CouponSetupPage;