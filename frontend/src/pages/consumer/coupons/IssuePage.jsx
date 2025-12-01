import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../../context/AuthContext';

const Container = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
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
    border: 1px solid #e0e0e0;
    overflow-y: auto;
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
  border: 4px solid rgba(76, 230, 209, 0.2);
  border-radius: 50%;
  
  &.spinning {
    border-top: 4px solid #4CE6D1;
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
  background: rgba(76, 230, 209, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
`;

const StepTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d2d2d;
  margin-bottom: 0.5rem;
`;

const StepDescription = styled.p`
  color: #666666;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 2rem;
`;

const ErrorContainer = styled.div`
  background: rgba(255, 90, 90, 0.1);
  border: 1px solid rgba(255, 90, 90, 0.2);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const ErrorIcon = styled.span`
  font-size: 1.25rem;
  flex-shrink: 0;
`;

const ErrorText = styled.p`
  color: #ff5a5a;
  font-size: 0.875rem;
  margin: 0;
  flex: 1;
`;

const PrimaryButton = styled.button`
  width: 100%;
  height: 52px;
  background: linear-gradient(135deg, #4CE6D1 0%, #A0F6D2 100%);
  color: #2d2d2d;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(76, 230, 209, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(76, 230, 209, 0.4);
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

const ButtonIcon = styled.span`
  font-size: 1.25rem;
`;

const CouponContainer = styled.div`
  background: white;
  border-radius: 24px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin: 1rem 0;
`;

const CouponHeader = styled.div`
  position: relative;
  padding: 2rem 1.5rem;
  text-align: center;
  color: white;
  background: ${props => props.$used ? 
    'linear-gradient(135deg, #808080 0%, #5a5a5a 100%)' : 
    'linear-gradient(135deg, #4CE6D1 0%, #A0F6D2 100%)'
  };
`;

const CouponIconWrapper = styled.div`
  margin-bottom: 1rem;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  font-size: 4rem;
`;

const CouponTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  letter-spacing: 0.025em;
`;

const CouponCode = styled.div`
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.1em;
`;

const UsedStamp = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #ff5a5a;
  color: white;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  transform: rotate(12deg);
  box-shadow: 0 4px 8px rgba(255, 90, 90, 0.3);
`;

const CouponPunch = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  background: #f5f5f5;
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
  border-top: 2px dashed #e0e0e0;
  margin: 0 1.5rem;
`;

const CouponBody = styled.div`
  padding: 1.5rem;
`;

const InfoBox = styled.div`
  background: rgba(76, 230, 209, 0.1);
  border: 1px solid rgba(76, 230, 209, 0.2);
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
  color: #4CE6D1;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.p`
  font-size: 0.875rem;
  color: #2d2d2d;
  font-weight: 500;
  margin: 0;
`;

const InfoIconEmoji = styled.span`
  font-size: 1.75rem;
  opacity: 0.8;
`;

const ActionButton = styled.button`
  width: 100%;
  height: 60px;
  background: linear-gradient(135deg, #4CE6D1 0%, #A0F6D2 100%);
  color: #2d2d2d;
  border: none;
  border-radius: 16px;
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 24px rgba(76, 230, 209, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 12px 32px rgba(76, 230, 209, 0.5);
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

const ActionButtonIcon = styled.span`
  font-size: 1.5rem;
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
  background: #f5f5f5;
  border: 2px solid #e0e0e0;
  color: #808080;
  padding: 1rem 1.5rem;
  border-radius: 16px;
  font-size: 1.125rem;
  font-weight: 700;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const UsedIcon = styled.span`
  font-size: 1.5rem;
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(45, 45, 45, 0.3);
  border-top: 2px solid #2d2d2d;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const IssuePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { apiCall, isAuthenticated, loading: authLoading } = useAuth();
  
  const [step, setStep] = useState('loading');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [couponData, setCouponData] = useState(null);

  useEffect(() => {
    const initializePage = async () => {
      if (authLoading) return;

      if (!slug) {
        setError('잘못된 QR 코드입니다.');
        setStep('error');
        return;
      }

      if (!isAuthenticated) {
        navigate(`/consumer/auth?redirect=/issue/${slug}`);
        return;
      }

      await issueCoupon();
    };

    initializePage();
  }, [slug, navigate, isAuthenticated, authLoading]);

  const issueCoupon = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await apiCall({
        method: 'POST',
        url: '/coupons/issue/',
        data: { slug },
      });

      if (response.success && response.data?.coupon) {
        setCouponData(response.data.coupon);
        setStep('coupon');
      } else {
        setError(response.message || '쿠폰 발급에 실패했습니다.');
        setStep('error');
      }
    } catch (err) {
      console.error('Issue coupon error:', err);
      
      if (err.message && err.message.includes('login required')) {
        navigate(`/consumer/auth?redirect=/issue/${slug}`);
        return;
      }
      
      setError(err.response?.data?.message || '쿠폰 발급 중 오류가 발생했습니다.');
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  const useCoupon = async () => {
    if (!couponData?.short_code) return;

    setLoading(true);
    setError('');

    try {
      const response = await apiCall({
        method: 'POST',
        url: '/coupons/use/',
        data: { short_code: couponData.short_code },
      });

      if (response.success && response.data?.coupon) {
        setCouponData(response.data.coupon);
        alert('쿠폰이 사용 완료되었습니다!');
      } else {
        setError(response.message || '쿠폰 사용에 실패했습니다.');
      }
    } catch (err) {
      console.error('Use coupon error:', err);
      
      if (err.message && err.message.includes('login required')) {
        navigate(`/consumer/auth?redirect=/issue/${slug}`);
        return;
      }
      
      setError(err.response?.data?.message || '쿠폰 사용 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderLoadingStep = () => (
    <StepContainer>
      <LoadingIcon>
        <LoadingRing />
        <LoadingRing className="spinning" />
      </LoadingIcon>
      <StepTitle>쿠폰 발급 중</StepTitle>
      <StepDescription>특별한 혜택을 준비하고 있어요</StepDescription>
    </StepContainer>
  );

  const renderErrorStep = () => (
    <StepContainer>
      <LoadingIcon>
        <LoadingRing />
      </LoadingIcon>
      <StepTitle>문제가 발생했어요</StepTitle>
      <StepDescription>{error}</StepDescription>

      {error && (
        <ErrorContainer>
          <ErrorText>{error}</ErrorText>
        </ErrorContainer>
      )}

      <PrimaryButton onClick={() => window.location.reload()}>
        다시 시도하기
      </PrimaryButton>
    </StepContainer>
  );

  const renderCouponStep = () => (
    <CouponContainer>
      <CouponHeader $used={couponData?.status === 'used'}>
        <CouponTitle>
          {couponData?.status === 'used' ? '사용 완료!' : '쿠폰 발급 완료!'}
        </CouponTitle>
        <CouponCode>{couponData?.short_code}</CouponCode>

        {couponData?.status === 'used' && (
          <UsedStamp>USED</UsedStamp>
        )}

        <CouponPunch className="left" />
        <CouponPunch className="right" />
      </CouponHeader>

      <CouponDivider />

      <CouponBody>
        <InfoBox>
          <InfoContent>
            <InfoLabel>발급일시</InfoLabel>
            <InfoValue>{formatDate(couponData?.issued_at)}</InfoValue>
          </InfoContent>
        </InfoBox>

        {couponData?.expired_at && (
          <InfoBox>
            <InfoContent>
              <InfoLabel>유효기간</InfoLabel>
              <InfoValue>{formatDate(couponData?.expired_at)}</InfoValue>
            </InfoContent>
          </InfoBox>
        )}

        {error && (
          <ErrorContainer>
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
                <ActionButtonIcon>✨</ActionButtonIcon>
                <span>사용하기</span>
              </>
            )}
          </ActionButton>
        ) : (
          <UsedButton>
            <UsedButtonContent>
              <span>사용 완료</span>
            </UsedButtonContent>
          </UsedButton>
        )}
      </CouponBody>
    </CouponContainer>
  );

  return (
    <Container>
      <ContentWrapper>
        {step === 'loading' && renderLoadingStep()}
        {step === 'error' && renderErrorStep()}
        {step === 'coupon' && renderCouponStep()}
      </ContentWrapper>
    </Container>
  );
};

export default IssuePage;