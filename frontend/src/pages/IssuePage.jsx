import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

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
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem 1.5rem;
  
  @media (min-width: 391px) {
    border-radius: 16px;
    min-height: auto;
    max-height: 90vh;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(226, 232, 240, 0.8);
    overflow-y: auto;
  }
`;

const Logo = styled.h1`
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 1rem;
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

const StepContainer = styled.div`
  text-align: center;
  padding: 2rem 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const LoadingIcon = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
`;

const LoadingRing = styled.div`
  position: absolute;
  inset: 0;
  border: 4px solid rgba(16, 185, 129, 0.2);
  border-radius: 50%;
  
  &.spinning {
    border-top: 4px solid #10b981;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingIconInner = styled.div`
  position: absolute;
  inset: 12px;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const StepTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const StepDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 2rem;
`;

const AuthHighlight = styled.span`
  font-weight: 600;
  background: linear-gradient(135deg, #10b981 0%, #0ea5e9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const LoadingDots = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.25rem;
  margin-top: 1.5rem;
`;

const LoadingDot = styled.div`
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: bounce 1.4s ease-in-out infinite both;
  
  &:nth-child(1) { animation-delay: -0.32s; }
  &:nth-child(2) { animation-delay: -0.16s; }
  &:nth-child(3) { animation-delay: 0; }

  @keyframes bounce {
    0%, 80%, 100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
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

  ${props => props.verification && `
    text-align: center;
    font-size: 1.5rem;
    font-family: 'Courier New', monospace;
    letter-spacing: 0.25rem;
  `}
`;

const TimeIndicator = styled.p`
  font-size: 0.875rem;
  color: #0ea5e9;
  margin-top: 0.5rem;
  text-align: center;
  font-weight: 500;
`;

const InfoBox = styled.div`
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const InfoText = styled.p`
  color: #1e40af;
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.4;
`;

const InfoHighlight = styled.span`
  font-weight: 600;
`;

const ErrorContainer = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ErrorText = styled.p`
  color: #dc2626;
  font-size: 0.875rem;
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const PrimaryButton = styled.button`
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

  ${props => props.success && `
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  `}
`;

const SecondaryButton = styled.button`
  flex: 1;
  height: 48px;
  background: rgba(255, 255, 255, 0.9);
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: white;
    border-color: #d1d5db;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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

const ResendButton = styled(SecondaryButton)`
  background: rgba(251, 191, 36, 0.1);
  color: #92400e;
  border: 1px solid rgba(251, 191, 36, 0.3);

  &:hover:not(:disabled) {
    background: rgba(251, 191, 36, 0.15);
    border-color: rgba(251, 191, 36, 0.4);
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

const CouponContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  border: 1px solid rgba(226, 232, 240, 0.6);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin: 1rem 0;
`;

const CouponHeader = styled.div`
  position: relative;
  padding: 2rem 1.5rem;
  text-align: center;
  color: white;
  background: ${props => props.used ? 
    'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)' : 
    'linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)'
  };
`;

const CouponHeaderPattern = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.1;
`;

const PatternCircle = styled.div`
  position: absolute;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  
  &.large {
    top: 1rem;
    left: 1rem;
    width: 32px;
    height: 32px;
  }
  
  &.medium {
    top: 3rem;
    right: 2rem;
    width: 16px;
    height: 16px;
    opacity: 0.7;
  }
  
  &.small {
    bottom: 2rem;
    left: 2rem;
    width: 24px;
    height: 24px;
    opacity: 0.8;
  }
`;

const CouponHeaderContent = styled.div`
  position: relative;
  z-index: 10;
`;

const CouponIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
`;

const CouponTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  letter-spacing: 0.025em;
`;

const CouponStore = styled.div`
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
`;

const UsedStamp = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #ef4444;
  color: white;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  transform: rotate(12deg);
  box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
`;

const CouponPunch = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  background: #f8fafc;
  border-radius: 50%;
  border: 4px solid white;
  
  &.left {
    left: -16px;
  }
  
  &.right {
    right: -16px;
  }
`;

const CouponDivider = styled.div`
  border-top: 2px dashed #e5e7eb;
  margin: 0 1.5rem;
`;

const CouponBody = styled.div`
  padding: 1.5rem;
`;

const BenefitBox = styled.div`
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%);
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 16px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
`;

const BenefitHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
`;

const BenefitIcon = styled.span`
  font-size: 1.5rem;
`;

const BenefitTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #374151;
`;

const BenefitDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.5;
  margin: 0;
`;

const CouponInfoBox = styled.div`
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoLabel = styled.p`
  font-size: 0.75rem;
  color: #1e40af;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.p`
  font-size: 0.875rem;
  color: #1e3a8a;
  font-weight: 500;
  margin: 0;
`;

const InfoIcon = styled.div`
  font-size: 1.5rem;
  opacity: 0.8;
`;

const ActionButton = styled.button`
  width: 100%;
  height: 60px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 12px 32px rgba(16, 185, 129, 0.5);
  }

  &:active:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const ButtonIcon = styled.span`
  font-size: 1.5rem;
`;

const ButtonContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ButtonText = styled.div`
  font-weight: 700;
`;

const ButtonSubtext = styled.div`
  font-size: 0.75rem;
  opacity: 0.9;
  font-weight: 400;
`;

const UsedButton = styled.div`
  display: flex;
  justify-content: center;
  padding: 1.5rem 0;
`;

const UsedButtonContent = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: #f3f4f6;
  border: 2px solid #e5e7eb;
  color: #6b7280;
  padding: 1rem 1.5rem;
  border-radius: 16px;
  font-size: 1.125rem;
  font-weight: 700;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const UsedIcon = styled.span`
  font-size: 1.5rem;
`;

const UsedText = styled.div`
  display: flex;
  flex-direction: column;
`;

const UsedMainText = styled.div`
  font-weight: 700;
`;

const UsedSubtext = styled.div`
  font-size: 0.75rem;
  font-weight: 400;
  opacity: 0.7;
`;

const GuideBox = styled.div`
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%);
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 16px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
`;

const GuideHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`;

const GuideIcon = styled.div`
  font-size: 1.5rem;
  margin-top: 0.125rem;
`;

const GuideContent = styled.div`
  flex: 1;
`;

const GuideTitle = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: #92400e;
  margin-bottom: 0.5rem;
`;

const GuideText = styled.p`
  font-size: 0.75rem;
  color: #a16207;
  line-height: 1.5;
  margin: 0;
`;

const GuideHighlight = styled.span`
  font-weight: 600;
`;

const BrandFooter = styled.div`
  text-align: center;
  margin-top: 1.5rem;
`;

const BrandIndicator = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #9ca3af;
`;

const BrandDot = styled.div`
  width: 8px;
  height: 8px;
  background: #3b82f6;
  border-radius: 50%;
`;

const IssuePage = () => {
  const { slug } = useParams();
  const { user, login, apiCall } = useAuth();

  // 페이지 상태
  const [step, setStep] = useState('loading'); // loading, phone, code, coupon, error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 인증 관련 상태
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);

  // 쿠폰 데이터
  const [couponData, setCouponData] = useState(null);

  // 타이머 관리
  useEffect(() => {
    let interval;
    if (timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timeLeft]);

  // 초기 로드
  useEffect(() => {
    const initializePage = async () => {
      if (!slug) {
        setError('잘못된 QR 코드입니다.');
        setStep('error');
        return;
      }

      if (user) {
        await loadCoupon();
      } else {
        setStep('phone');
      }
    };

    initializePage();
  }, [user, slug, apiCall]);

  const loadCoupon = async () => {
    try {
      setStep('loading');
      const response = await apiCall({ method: 'GET', url: `/issue/${slug}/` });
      if (response.success) {
        setCouponData(response.data);
        setStep('coupon');
      } else {
        setError('쿠폰을 불러오는데 실패했습니다.');
        setStep('error');
      }
    } catch (err) {
      if (err.message.includes('login required')) {
        setStep('phone');
      } else {
        setError(err.message || '쿠폰 발급 중 오류가 발생했습니다.');
        setStep('error');
      }
    }
  };

  // 유틸리티 함수
  const isValidPhoneNumber = phone => {
    const phoneRegex = /^01[0-9]{8,9}$/;
    return phoneRegex.test(phone.replace(/[^0-9]/g, ''));
  };

  const formatPhoneNumber = value => {
    const numbers = value.replace(/[^0-9]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 인증 관련 함수
  const requestVerificationCode = async () => {
    if (!isValidPhoneNumber(phoneNumber)) {
      setError('올바른 휴대폰 번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const cleanPhoneNumber = phoneNumber.replace(/[^0-9]/g, '');
      const response = await api.post('/auth/request-code', {
        phone_number: cleanPhoneNumber,
      });

      if (response.data.success) {
        setStep('code');
        setTimeLeft(300);
        setError('');
      } else {
        setError('인증번호 발송에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || '인증번호 발송 중 오류가 발생했습니다.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (verificationCode.length !== 6) {
      setError('6자리 인증번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const cleanPhoneNumber = phoneNumber.replace(/[^0-9]/g, '');
      const response = await api.post('/auth/verify-code', {
        phone_number: cleanPhoneNumber,
        code: verificationCode,
      });

      if (response.data.success) {
        const { access, refresh } = response.data.data.tokens;
        await login(access, refresh);
        await loadCoupon();
      } else {
        setError('인증번호가 올바르지 않습니다.');
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || '인증 확인 중 오류가 발생했습니다.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resendCode = () => {
    setVerificationCode('');
    setError('');
    requestVerificationCode();
  };

  const goBackToPhone = () => {
    setStep('phone');
    setVerificationCode('');
    setError('');
    setTimeLeft(0);
  };

  // 쿠폰 사용
  const useCoupon = async () => {
    if (!couponData) return;

    setLoading(true);
    setError('');

    try {
      const response = await apiCall({ method: 'POST', url: `/use/${couponData.coupon_id}/` });
      if (response.success) {
        setCouponData(prev => prev ? { ...prev, status: 'used' } : null);
        alert('쿠폰이 사용 완료되었습니다!');
      } else {
        setError('쿠폰 사용에 실패했습니다.');
      }
    } catch (err) {
      setError(err.message || '쿠폰 사용 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 렌더링 함수들
  const renderLoadingStep = () => (
    <StepContainer>
      <LoadingIcon>
        <LoadingRing />
        <LoadingRing className="spinning" />
        <LoadingIconInner>{step === 'loading' && couponData ? '🎁' : '🔍'}</LoadingIconInner>
      </LoadingIcon>
      <StepTitle>
        {step === 'loading' && couponData ? '쿠폰 발급 중' : 'QR 코드 확인 중'}
      </StepTitle>
      <StepDescription>
        {step === 'loading' && couponData ? '특별한 혜택을 준비하고 있어요!' : '매장 정보를 불러오고 있어요...'}
      </StepDescription>
      {step === 'loading' && couponData && (
        <LoadingDots>
          <LoadingDot />
          <LoadingDot />
          <LoadingDot />
        </LoadingDots>
      )}
    </StepContainer>
  );

  const renderPhoneStep = () => (
    <StepContainer>
      <Logo>
        <span className="neigh">Neigh</span>
        <span className="biz">Biz</span>
      </Logo>
      
      <LoadingIcon>
        <LoadingRing />
        <LoadingIconInner>📱</LoadingIconInner>
      </LoadingIcon>
      <StepTitle>휴대폰 인증</StepTitle>
      <StepDescription>
        쿠폰 받기 위해<br />
        <AuthHighlight>휴대폰 번호</AuthHighlight>를 입력해주세요
      </StepDescription>

      <FormContainer>
        <InputGroup>
          <Label>휴대폰 번호</Label>
          <Input
            type="tel"
            placeholder="010-1234-5678"
            value={formatPhoneNumber(phoneNumber)}
            onChange={e => setPhoneNumber(e.target.value)}
            disabled={loading}
            maxLength={13}
          />
        </InputGroup>

        {error && (
          <ErrorContainer>
            <span>⚠️</span>
            <ErrorText>{error}</ErrorText>
          </ErrorContainer>
        )}
      </FormContainer>

      <ButtonGroup>
        <PrimaryButton
          onClick={requestVerificationCode}
          disabled={loading || !phoneNumber.trim()}
        >
          {loading ? (
            <>
              <LoadingSpinner />
              발송 중...
            </>
          ) : (
            '인증번호 받기'
          )}
        </PrimaryButton>
      </ButtonGroup>
    </StepContainer>
  );

  const renderCodeStep = () => (
    <StepContainer>
      <Logo>
        <span className="neigh">Neigh</span>
        <span className="biz">Biz</span>
      </Logo>
      
      <LoadingIcon>
        <LoadingRing />
        <LoadingIconInner>🔐</LoadingIconInner>
      </LoadingIcon>
      <StepTitle>인증번호 확인</StepTitle>
      <StepDescription>
        발송된 6자리 인증번호를 입력해주세요
      </StepDescription>

      <FormContainer>
        <InfoBox>
          <InfoText>
            <InfoHighlight>{formatPhoneNumber(phoneNumber)}</InfoHighlight>로<br />
            인증번호를 발송했습니다.
          </InfoText>
        </InfoBox>

        <InputGroup>
          <Label>인증번호</Label>
          <Input
            verification
            type="text"
            placeholder="6자리 숫자"
            value={verificationCode}
            onChange={e =>
              setVerificationCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))
            }
            disabled={loading}
            maxLength={6}
            autoFocus
          />

          {timeLeft > 0 && (
            <TimeIndicator>
              ⏰ {formatTime(timeLeft)} 남음
            </TimeIndicator>
          )}
        </InputGroup>

        {error && (
          <ErrorContainer>
            <span>⚠️</span>
            <ErrorText>{error}</ErrorText>
          </ErrorContainer>
        )}
      </FormContainer>

      <ButtonGroup>
        <PrimaryButton
          success
          onClick={verifyCode}
          disabled={loading || verificationCode.length !== 6}
        >
          {loading ? (
            <>
              <LoadingSpinner />
              확인 중...
            </>
          ) : (
            '인증 완료'
          )}
        </PrimaryButton>

        <ButtonRow>
          <SecondaryButton
            onClick={goBackToPhone}
            disabled={loading}
          >
            이전
          </SecondaryButton>
          <ResendButton
            onClick={resendCode}
            disabled={loading || timeLeft > 240}
          >
            다시 전송
          </ResendButton>
        </ButtonRow>
      </ButtonGroup>
    </StepContainer>
  );

  const renderErrorStep = () => (
    <StepContainer>
      <LoadingIcon>
        <LoadingRing />
        <LoadingIconInner>😓</LoadingIconInner>
      </LoadingIcon>
      <StepTitle>이런! 문제가 발생했어요</StepTitle>
      <StepDescription></StepDescription>

      <ErrorContainer>
        <span>⚠️</span>
        <ErrorText>{error}</ErrorText>
      </ErrorContainer>

      <ButtonGroup>
        <PrimaryButton onClick={() => window.location.reload()}>
          <span>🔄</span>
          다시 시도하기
        </PrimaryButton>
      </ButtonGroup>
    </StepContainer>
  );

  const renderCouponStep = () => (
    <CouponContainer>
      <CouponHeader used={couponData?.status === 'used'}>
        <CouponHeaderPattern>
          <PatternCircle className="large" />
          <PatternCircle className="medium" />
          <PatternCircle className="small" />
        </CouponHeaderPattern>

        <CouponHeaderContent>
          <CouponIcon>
            {couponData?.status === 'used' ? '✅' : '🎫'}
          </CouponIcon>
          <CouponTitle>
            {couponData?.status === 'used' ? '사용 완료!' : '쿠폰 발급 완료!'}
          </CouponTitle>
          <CouponStore>
            🏪 {couponData?.partner_store}
          </CouponStore>
        </CouponHeaderContent>

        {couponData?.status === 'used' && (
          <UsedStamp>USED</UsedStamp>
        )}

        <CouponPunch className="left" />
        <CouponPunch className="right" />
      </CouponHeader>

      <CouponDivider />

      <CouponBody>
        <BenefitBox>
          <BenefitHeader>
            <BenefitIcon>🎁</BenefitIcon>
            <BenefitTitle>쿠폰 혜택</BenefitTitle>
          </BenefitHeader>
          <BenefitDescription>
            {couponData?.description}
          </BenefitDescription>
        </BenefitBox>

        <CouponInfoBox>
          <InfoContent>
            <InfoLabel>발급일시</InfoLabel>
            <InfoValue>
              {couponData?.issued_at && formatDate(couponData.issued_at)}
            </InfoValue>
          </InfoContent>
          <InfoIcon>📅</InfoIcon>
        </CouponInfoBox>

        {error && (
          <ErrorContainer>
            <span>⚠️</span>
            <ErrorText>{error}</ErrorText>
          </ErrorContainer>
        )}

        {couponData?.status === 'active' ? (
          <ActionButton onClick={useCoupon} disabled={loading}>
            {loading ? (
              <>
                <LoadingSpinner />
                <span>처리중...</span>
              </>
            ) : (
              <>
                <ButtonIcon>✨</ButtonIcon>
                <ButtonContent>
                  <ButtonText>사용하기</ButtonText>
                  <ButtonSubtext>사장님이 눌러주세요</ButtonSubtext>
                </ButtonContent>
              </>
            )}
          </ActionButton>
        ) : (
          <UsedButton>
            <UsedButtonContent>
              <UsedIcon>✅</UsedIcon>
              <UsedText>
                <UsedMainText>사용 완료</UsedMainText>
                <UsedSubtext>이미 사용된 쿠폰입니다</UsedSubtext>
              </UsedText>
            </UsedButtonContent>
          </UsedButton>
        )}

        <GuideBox>
          <GuideHeader>
            <GuideIcon>💡</GuideIcon>
            <GuideContent>
              <GuideTitle>사용 방법 안내</GuideTitle>
              <GuideText>
                매장에서 사장님께 이 화면을 보여주시고<br />
                <GuideHighlight>"쿠폰 사용하기"</GuideHighlight> 버튼을 눌러달라고 말씀해주세요.
              </GuideText>
            </GuideContent>
          </GuideHeader>
        </GuideBox>

        <BrandFooter>
          <BrandIndicator>
            <BrandDot />
            <span>네이비즈 제휴 쿠폰</span>
            <BrandDot />
          </BrandIndicator>
        </BrandFooter>
      </CouponBody>
    </CouponContainer>
  );

  // 메인 렌더
  return (
    <Container>
      <ContentWrapper>
        {step === 'loading' && renderLoadingStep()}
        {step === 'phone' && renderPhoneStep()}
        {step === 'code' && renderCodeStep()}
        {step === 'error' && renderErrorStep()}
        {step === 'coupon' && renderCouponStep()}
      </ContentWrapper>
    </Container>
  );
};

export default IssuePage;