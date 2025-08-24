import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import api from '../lib/axios';
import { extractFirstError } from '../utils/error';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #1a1a1a;
    overflow-x: hidden;
  }

  html {
    scroll-behavior: smooth;
  }

  button {
    border: none;
    cursor: pointer;
    font-family: inherit;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  25% {
    transform: translateY(-20px) rotate(5deg);
  }
  50% {
    transform: translateY(-10px) rotate(-5deg);
  }
  75% {
    transform: translateY(-30px) rotate(3deg);
  }
`;

const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
  }
  70% {
    box-shadow: 0 0 0 20px rgba(59, 130, 246, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  background-size: 400% 400%;
  animation: ${gradientShift} 15s ease infinite;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const FloatingElement = styled.div`
  position: absolute;
  width: ${props => props.size};
  height: ${props => props.size};
  background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.3));
  border-radius: 50%;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  top: ${props => props.top};
  left: ${props => props.left};
  animation: ${float} ${props => props.duration} ease-in-out infinite;
  animation-delay: ${props => props.delay};
  z-index: 1;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: 3rem;
  border-radius: 24px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 500px;
  width: 100%;
  position: relative;
  overflow: hidden;
  animation: ${slideInRight} 1s ease-out;
  z-index: 2;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
  }

  @media (max-width: 768px) {
    margin: 1rem;
    padding: 2rem;
    max-width: none;
  }
`;

const CardHeader = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const Logo = styled.div`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
  color: #1f2937;

  span {
    color: #3b82f6;
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
  text-align: center;
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  margin-bottom: 2rem;
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

const SecurityIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
  animation: ${pulse} 2s ease-in-out infinite;

  &::after {
    content: '🔐';
  }
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  letter-spacing: -0.01em;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  color: #1f2937;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    transform: translateY(-1px);
  }

  &:hover {
    border-color: #d1d5db;
  }

  &::placeholder {
    color: #9ca3af;
  }

  &:disabled {
    background: #f9fafb;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const PasswordStrengthIndicator = styled.div`
  margin-top: 0.5rem;
  padding: 0.75rem;
  border-radius: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
`;

const StrengthBar = styled.div`
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  margin-bottom: 0.5rem;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${props => props.strength * 25}%;
    background: ${props => 
      props.strength <= 1 ? '#ef4444' :
      props.strength <= 2 ? '#f59e0b' :
      props.strength <= 3 ? '#eab308' :
      '#10b981'
    };
    transition: all 0.3s ease;
  }
`;

const StrengthText = styled.div`
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
`;

const RequirementsList = styled.ul`
  list-style: none;
  margin-top: 0.5rem;
  padding: 0;
`;

const RequirementItem = styled.li`
  font-size: 0.8rem;
  color: ${props => props.met ? '#10b981' : '#64748b'};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;

  &::before {
    content: '${props => props.met ? '✓' : '○'}';
    font-weight: bold;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  margin-top: 0.5rem;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 35px rgba(59, 130, 246, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: linear-gradient(135deg, #9ca3af, #6b7280);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;

    &:hover::before {
      left: -100%;
    }
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: ${rotate} 0.8s ease-in-out infinite;
  margin-right: 0.5rem;
`;

const Message = styled.div`
  padding: 1rem 1.25rem;
  border-radius: 12px;
  font-weight: 500;
  font-size: 0.95rem;
  animation: ${fadeIn} 0.3s ease-out;
  border: 1px solid;
  
  ${({ type }) => type === 'error' ? `
    color: #dc2626;
    background: linear-gradient(135deg, #fef2f2, #fee2e2);
    border-color: #fecaca;
  ` : `
    color: #16a34a;
    background: linear-gradient(135deg, #f0fdf4, #dcfce7);
    border-color: #bbf7d0;
  `}
`;

const LoadingCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: 3rem;
  border-radius: 24px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 400px;
  width: 100%;
  text-align: center;
  z-index: 2;
  animation: ${fadeInUp} 0.8s ease-out;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
  }
`;

const LoadingIcon = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: ${rotate} 1s linear infinite;
  margin: 0 auto 1.5rem;
`;

const LoadingText = styled.p`
  color: #6b7280;
  font-size: 1.1rem;
  font-weight: 500;
`;

const ErrorCard = styled(Card)`
  text-align: center;
  max-width: 450px;
`;

const ErrorIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  margin: 0 auto 2rem;
  box-shadow: 0 10px 30px rgba(239, 68, 68, 0.3);

  &::after {
    content: '⚠️';
  }
`;

const ErrorTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const ErrorDescription = styled.p`
  color: #6b7280;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #6b7280, #4b5563);
  color: white;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 25px rgba(107, 114, 128, 0.3);
  }
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981, #059669);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  margin: 0 auto 2rem;
  box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
  animation: ${bounce} 1s ease-in-out;

  &::after {
    content: '✓';
  }
`;

function ResetPasswordConfirm() {
  const [params] = useSearchParams();
  const uid = params.get('uid');
  const token = params.get('token');
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);

  // 비밀번호 강도 계산
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return Math.min(strength, 4);
  };

  const passwordStrength = calculatePasswordStrength(newPassword);

  useEffect(() => {
    const validateLink = async () => {
      setValidating(true);
      try {
        await api.get('/auth/reset-password-validate/', {
          params: { uid, token },
        });
      } catch (err) {
        setError(extractFirstError(err, '비밀번호 재설정 링크가 유효하지 않습니다.'));
      } finally {
        setValidating(false);
      }
    };

    if (!uid || !token) {
      setError('잘못된 접근입니다. 링크가 올바르지 않습니다.');
      setValidating(false);
    } else {
      validateLink();
    }
  }, [uid, token]);

  const handleReset = async () => {
    if (!newPassword.trim()) {
      setError('새 비밀번호를 입력해주세요.');
      return;
    }
    if (newPassword.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }
    if (!confirmPassword.trim()) {
      setError('비밀번호 확인란을 입력해주세요.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setError('');
    setMessage('');
    setLoading(true);

    try {
      await api.post('/auth/reset-password-confirm/', {
        uid,
        token,
        new_password: newPassword,
      });

      setMessage('비밀번호가 성공적으로 변경되었습니다.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(extractFirstError(err, '비밀번호 재설정에 실패했습니다.'));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleReset();
    }
  };

  if (validating) {
    return (
      <>
        <GlobalStyle />
        <Container>
          {/* Floating Elements */}
          <FloatingElement size="80px" top="15%" left="8%" duration="6s" delay="0s" />
          <FloatingElement size="60px" top="25%" left="85%" duration="4s" delay="1s" />
          <FloatingElement size="40px" top="70%" left="10%" duration="5s" delay="2s" />
          <FloatingElement size="100px" top="60%" left="80%" duration="7s" delay="0.5s" />
          <FloatingElement size="50px" top="40%" left="5%" duration="4.5s" delay="1.5s" />

          <LoadingCard>
            <LoadingIcon />
            <LoadingText>링크 유효성 검사 중...</LoadingText>
          </LoadingCard>
        </Container>
      </>
    );
  }

  // 링크 오류 등으로 접근 불가
  if (error && !message) {
    return (
      <>
        <GlobalStyle />
        <Container>
          {/* Floating Elements */}
          <FloatingElement size="80px" top="15%" left="8%" duration="6s" delay="0s" />
          <FloatingElement size="60px" top="25%" left="85%" duration="4s" delay="1s" />
          <FloatingElement size="40px" top="70%" left="10%" duration="5s" delay="2s" />
          <FloatingElement size="100px" top="60%" left="80%" duration="7s" delay="0.5s" />

          <ErrorCard>
            <ErrorIcon />
            <ErrorTitle>접근할 수 없습니다</ErrorTitle>
            <ErrorDescription>
              비밀번호 재설정 링크가 만료되었거나 유효하지 않습니다.
              새로운 재설정 링크를 요청해주세요.
            </ErrorDescription>
            <Message type="error">{error}</Message>
            <BackButton to="/reset-password">
              ← 비밀번호 찾기로 돌아가기
            </BackButton>
          </ErrorCard>
        </Container>
      </>
    );
  }

  return (
    <>
      <GlobalStyle />
      <Container>
        {/* Floating Elements */}
        <FloatingElement size="80px" top="15%" left="8%" duration="6s" delay="0s" />
        <FloatingElement size="60px" top="25%" left="85%" duration="4s" delay="1s" />
        <FloatingElement size="40px" top="70%" left="10%" duration="5s" delay="2s" />
        <FloatingElement size="100px" top="60%" left="80%" duration="7s" delay="0.5s" />
        <FloatingElement size="50px" top="40%" left="5%" duration="4.5s" delay="1.5s" />
        <FloatingElement size="30px" top="80%" left="90%" duration="3.5s" delay="2.5s" />

        <Card>
          <CardHeader>
            <Logo>
              Neigh<span>biz</span>
            </Logo>
            {message ? (
              <>
                <SuccessIcon />
                <Title>변경 완료!</Title>
                <Subtitle>로그인 페이지로 이동합니다...</Subtitle>
              </>
            ) : (
              <>
                <IconWrapper>
                  <SecurityIcon />
                </IconWrapper>
                <Title>비밀번호 재설정</Title>
                <Subtitle>새로운 비밀번호를 설정해주세요</Subtitle>
              </>
            )}
          </CardHeader>

          {!message && (
            <Form>
              <InputGroup>
                <Label htmlFor="new-password">새 비밀번호</Label>
                <InputWrapper>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (error) setError('');
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="6자 이상 입력"
                    disabled={loading}
                  />
                </InputWrapper>
                {newPassword && (
                  <PasswordStrengthIndicator>
                    <StrengthBar strength={passwordStrength} />
                    <StrengthText>
                      비밀번호 강도: {
                        passwordStrength <= 1 ? '약함' :
                        passwordStrength <= 2 ? '보통' :
                        passwordStrength <= 3 ? '좋음' :
                        '매우 좋음'
                      }
                    </StrengthText>
                    <RequirementsList>
                      <RequirementItem met={newPassword.length >= 6}>
                        최소 6자 이상
                      </RequirementItem>
                      <RequirementItem met={/[a-z]/.test(newPassword)}>
                        소문자 포함
                      </RequirementItem>
                      <RequirementItem met={/[A-Z]/.test(newPassword)}>
                        대문자 포함
                      </RequirementItem>
                      <RequirementItem met={/[0-9]/.test(newPassword)}>
                        숫자 포함
                      </RequirementItem>
                      <RequirementItem met={/[^A-Za-z0-9]/.test(newPassword)}>
                        특수문자 포함
                      </RequirementItem>
                    </RequirementsList>
                  </PasswordStrengthIndicator>
                )}
              </InputGroup>

              <InputGroup>
                <Label htmlFor="confirm-password">비밀번호 확인</Label>
                <InputWrapper>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (error) setError('');
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="다시 한 번 입력"
                    disabled={loading}
                  />
                </InputWrapper>
                {confirmPassword && newPassword !== confirmPassword && (
                  <Message type="error" style={{ marginTop: '0.5rem' }}>
                    비밀번호가 일치하지 않습니다
                  </Message>
                )}
              </InputGroup>

              {error && <Message type="error">{error}</Message>}

              <Button onClick={handleReset} disabled={loading || !newPassword || !confirmPassword}>
                {loading && <LoadingSpinner />}
                {loading ? '처리 중...' : '비밀번호 변경 완료'}
              </Button>
            </Form>
          )}

          {message && <Message type="success">{message}</Message>}
        </Card>
      </Container>
    </>
  );
}

export default ResetPasswordConfirm;