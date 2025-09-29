import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../../utils/api';

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
  justify-content: center;
  
  @media (min-width: 391px) {
    border-radius: 16px;
    min-height: 844px;
    max-height: 90vh;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(226, 232, 240, 0.8);
  }
`;

const LogoSection = styled.div`
  margin-bottom: 3rem;
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
`;

const InputRow = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
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

const SendButton = styled.button`
  min-width: 100px;
  height: 52px;
  background: ${props => props.disabled ? '#f3f4f6' : 'linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)'};
  color: ${props => props.disabled ? '#9ca3af' : 'white'};
  border: none;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }
`;

const Timer = styled.span`
  color: #ef4444;
  font-size: 0.875rem;
  font-weight: 600;
  margin-left: 0.5rem;
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
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const SuccessText = styled.p`
  color: #059669;
  font-size: 0.875rem;
  margin: 0;
  text-align: center;
`;

const FoundUsername = styled.div`
  background: white;
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 12px;
  padding: 1rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
`;

const ActionButton = styled.button`
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

const BackButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.5rem;
  margin-top: 1rem;
  transition: color 0.3s ease;

  &:hover {
    color: #374151;
  }
`;

const FindIdPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [foundUsername, setFoundUsername] = useState('');
  const [showResult, setShowResult] = useState(false);
  const navigate = useNavigate();

  // 타이머 효과
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(timer => timer - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPhoneNumber = (value) => {
    return value.replace(/\D/g, '');
  };

  const handleSendCode = async () => {
    setError('');
    setIsLoading(true);

    const formattedPhone = formatPhoneNumber(phoneNumber);
    if (formattedPhone.length !== 11) {
      setError('올바른 전화번호를 입력해주세요.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.post('/accounts/phone-verify-request/', {
        phone_number: formattedPhone
      });

      if (!res.data.success) {
        setError(res.data.message || '인증번호 발송에 실패했습니다.');
        return;
      }

      setTimer(180); // 3분
      setIsVerificationSent(true);
      setVerificationCode('');
      setError('');
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || '인증번호 발송에 실패했습니다.');
      } else {
        setError('인증번호 발송에 실패했습니다. 네트워크를 확인해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setError('');
    setIsLoading(true);

    try {
      const res = await api.post('/accounts/phone-verify/', {
        phone_number: formatPhoneNumber(phoneNumber),
        code: verificationCode
      });

      if (!res.data.success) {
        setError(res.data.message || '인증번호 확인에 실패했습니다.');
        return;
      }

      setIsPhoneVerified(true);
      setError('');
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || '인증번호 확인에 실패했습니다.');
      } else {
        setError('인증번호 확인에 실패했습니다. 네트워크를 확인해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFindUsername = async () => {
    setError('');
    setIsLoading(true);

    try {
      const res = await api.post('/accounts/find-username/', {
        phone_number: formatPhoneNumber(phoneNumber),
        name: name.trim()
      });

      if (!res.data.success) {
        setError(res.data.message || '아이디 찾기에 실패했습니다.');
        return;
      }

      setFoundUsername(res.data.data.username);
      setShowResult(true);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || '아이디 찾기에 실패했습니다.');
      } else {
        setError('아이디 찾기에 실패했습니다. 네트워크를 확인해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const canFindUsername = isPhoneVerified && name.trim();

  if (showResult) {
    return (
      <Container>
        <ContentWrapper>
          <LogoSection>
            <Logo>
              <span className="neigh">Neigh</span>
              <span className="biz">Biz</span>
            </Logo>
            <Subtitle>아이디 찾기</Subtitle>
          </LogoSection>

          <FormContainer>
            <SuccessContainer>
              <span style={{ fontSize: '2rem' }}>🎉</span>
              <SuccessText>아이디를 찾았습니다!</SuccessText>
              <FoundUsername>
                {foundUsername}
              </FoundUsername>
              <ActionButton
                type="button"
                onClick={() => navigate('/login')}
              >
                로그인하러 가기
              </ActionButton>
            </SuccessContainer>
          </FormContainer>
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
          <Subtitle>아이디 찾기</Subtitle>
        </LogoSection>

        <FormContainer>
          <Form>
            <InputGroup>
              <Label>전화번호</Label>
              <InputRow>
                <Input
                  type="tel"
                  placeholder="01012345678"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  disabled={isLoading || isPhoneVerified}
                  maxLength={11}
                />
                <SendButton
                  type="button"
                  onClick={handleSendCode}
                  disabled={isLoading || formatPhoneNumber(phoneNumber).length !== 11 || isPhoneVerified}
                >
                  {isLoading ? <LoadingSpinner /> : (isPhoneVerified ? '인증완료' : '인증요청')}
                </SendButton>
              </InputRow>
            </InputGroup>

            {isVerificationSent && !isPhoneVerified && (
              <InputGroup>
                <Label>
                  인증번호
                  {timer > 0 && <Timer>{formatTime(timer)}</Timer>}
                </Label>
                <InputRow>
                  <Input
                    type="text"
                    placeholder="인증번호 6자리를 입력하세요"
                    value={verificationCode}
                    onChange={e => setVerificationCode(e.target.value)}
                    disabled={isLoading}
                    maxLength={6}
                  />
                  <SendButton
                    type="button"
                    onClick={handleVerifyCode}
                    disabled={isLoading || verificationCode.length !== 6 || timer === 0}
                  >
                    {isLoading ? <LoadingSpinner /> : '확인'}
                  </SendButton>
                </InputRow>
              </InputGroup>
            )}

            {isPhoneVerified && (
              <InputGroup>
                <Label>이름</Label>
                <Input
                  type="text"
                  placeholder="가입 시 등록한 이름을 입력하세요"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  disabled={isLoading}
                />
              </InputGroup>
            )}

            {error && (
              <ErrorContainer>
                <span>⚠️</span>
                <ErrorText>{error}</ErrorText>
              </ErrorContainer>
            )}

            {isPhoneVerified && (
              <ActionButton
                type="button"
                onClick={handleFindUsername}
                disabled={isLoading || !canFindUsername}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner />
                    검색 중...
                  </>
                ) : (
                  <>
                    <span>🔍</span>
                    아이디 찾기
                  </>
                )}
              </ActionButton>
            )}
          </Form>

          <BackButton onClick={() => navigate('/login')}>
            ← 로그인으로 돌아가기
          </BackButton>
        </FormContainer>
      </ContentWrapper>
    </Container>
  );
};

export default FindIdPage;