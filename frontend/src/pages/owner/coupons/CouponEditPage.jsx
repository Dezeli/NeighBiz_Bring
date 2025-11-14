import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%);
  display: flex;
  align-items: flex-start;
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
  font-size: 2rem;
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
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const PageDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 2rem;
  line-height: 1.5;
`;

const FormSection = styled.div`
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border: 2px solid rgba(16, 185, 129, 0.1);
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.08);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  text-align: left;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #065f46;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 1rem;
  border: 2px solid rgba(16, 185, 129, 0.2);
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  box-sizing: border-box;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 1rem;
  border: 2px solid rgba(16, 185, 129, 0.2);
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  box-sizing: border-box;
  resize: vertical;
  font-family: inherit;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const Select = styled.select`
  width: 100%;
  height: 48px;
  padding: 0 1rem;
  border: 2px solid rgba(16, 185, 129, 0.2);
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`;

const HelpText = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.5rem;
  line-height: 1.4;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 2rem;
`;

const SubmitButton = styled.button`
  flex: 2;
  height: 52px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      transform: none;
    }
  }
`;

const CancelButton = styled.button`
  flex: 1;
  height: 52px;
  background: white;
  color: #6b7280;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  color: #dc2626;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 3rem 1rem;
`;

const LoadingSpinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid rgba(16, 185, 129, 0.2);
  border-top: 3px solid #10b981;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
`;

const Footer = styled.div`
  text-align: center;
  margin-top: auto;
  padding-top: 1rem;
  color: #9ca3af;
  font-size: 0.75rem;
`;

const CouponEditPage = () => {
  const navigate = useNavigate();
  const { apiCall } = useAuth();
  
  const [formData, setFormData] = useState({
    description: '',
    expected_value: '',
    expected_duration: '3_months',
    monthly_limit: '',
  });
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCouponPolicy();
  }, []);

  const fetchCouponPolicy = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await apiCall({
        method: 'GET',
        url: '/coupons/policy/',
      });

      if (response?.data) {
        setFormData({
          description: response.data.description || '',
          expected_value: response.data.expected_value || '',
          expected_duration: response.data.expected_duration || '3_months',
          monthly_limit: response.data.monthly_limit || '',
        });
      }
    } catch (err) {
      console.error('Failed to fetch coupon policy:', err);
      setError('쿠폰 정책을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 유효성 검사
    if (!formData.description.trim()) {
      setError('쿠폰 설명을 입력해주세요');
      return;
    }
    
    if (!formData.expected_value || formData.expected_value <= 0) {
      setError('예상 가치를 올바르게 입력해주세요');
      return;
    }
    
    if (!formData.monthly_limit || formData.monthly_limit <= 0) {
      setError('월 한도를 올바르게 입력해주세요');
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      const response = await apiCall({
        method: 'PATCH',
        url: '/coupons/policy/',
        data: {
          description: formData.description.trim(),
          expected_value: Number(formData.expected_value),
          expected_duration: formData.expected_duration,
          monthly_limit: Number(formData.monthly_limit),
        },
      });

      if (response?.success) {
        navigate('/owner/profile');
      } else {
        // 에러 메시지 우선순위: data.already_working > message > 기본 메시지
        const errorMsg = response?.data?.already_working || response?.message || '쿠폰 정책 수정에 실패했습니다.';
        setError(errorMsg);
      }
    } catch (err) {
      console.error('Failed to update coupon policy:', err);
      // catch된 에러에서도 동일하게 처리
      const errorMsg = err?.response?.data?.data?.already_working || 
                      err?.response?.data?.message || 
                      '쿠폰 정책 수정에 실패했습니다.';
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/owner/profile');
  };

  if (loading) {
    return (
      <Container>
        <ContentWrapper>
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingText>쿠폰 정책을 불러오는 중...</LoadingText>
          </LoadingContainer>
        </ContentWrapper>
      </Container>
    );
  }

  return (
    <Container>
      <ContentWrapper>
        <LogoSection>
          <Logo>
            <span className="neigh">Neigh</span>
            <span className="biz">Biz</span>
          </Logo>
        </LogoSection>

        <PageTitle>쿠폰 정책 수정</PageTitle>
        <PageDescription>
          제휴 파트너에게 제공할 쿠폰 정책을 수정하세요
        </PageDescription>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <form onSubmit={handleSubmit}>
          <FormSection>
            <FormGroup>
              <Label>쿠폰 설명 *</Label>
              <Textarea
                placeholder="예: 아메리카노 한 잔 무료"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                disabled={submitting}
              />
              <HelpText>고객이 받을 수 있는 혜택을 명확하게 작성해주세요</HelpText>
            </FormGroup>

            <FormGroup>
              <Label>예상 가치 (원) *</Label>
              <Input
                type="number"
                placeholder="3000"
                value={formData.expected_value}
                onChange={(e) => handleChange('expected_value', e.target.value)}
                disabled={submitting}
              />
              <HelpText>쿠폰의 예상 금액 가치를 입력하세요</HelpText>
            </FormGroup>

            <FormGroup>
              <Label>유효 기간 *</Label>
              <Select
                value={formData.expected_duration}
                onChange={(e) => handleChange('expected_duration', e.target.value)}
                disabled={submitting}
              >
                <option value="1_month">1개월</option>
                <option value="2_months">2개월</option>
                <option value="3_months">3개월</option>
                <option value="6_months">6개월</option>
                <option value="1_year">1년</option>
              </Select>
              <HelpText>쿠폰이 유효한 기간을 선택하세요</HelpText>
            </FormGroup>

            <FormGroup>
              <Label>월 한도 (매) *</Label>
              <Input
                type="number"
                placeholder="100"
                value={formData.monthly_limit}
                onChange={(e) => handleChange('monthly_limit', e.target.value)}
                disabled={submitting}
              />
              <HelpText>한 달에 발급 가능한 최대 쿠폰 수량</HelpText>
            </FormGroup>
          </FormSection>

          <ButtonGroup>
            <CancelButton type="button" onClick={handleCancel}>
              취소
            </CancelButton>
            <SubmitButton type="submit" disabled={submitting}>
              {submitting ? '수정 중...' : '수정 완료'}
            </SubmitButton>
          </ButtonGroup>
        </form>

        <Footer>
          네이비즈 소상공인 제휴 플랫폼
        </Footer>
      </ContentWrapper>
    </Container>
  );
};

export default CouponEditPage;