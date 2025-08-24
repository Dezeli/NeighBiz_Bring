import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

const slideInScale = keyframes`
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
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

const bounce = keyframes`
  0%, 20%, 53%, 80%, 100% {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    transform: translate3d(0, 0, 0);
  }
  40%, 43% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translate3d(0, -8px, 0);
  }
  70% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translate3d(0, -4px, 0);
  }
  90% {
    transform: translate3d(0, -2px, 0);
  }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  background-size: 400% 400%;
  animation: ${gradientShift} 15s ease infinite;
  overflow: hidden;

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

const MainCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 500px;
  width: 100%;
  position: relative;
  overflow: hidden;
  animation: ${slideInScale} 1s ease-out;
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
    max-width: none;
    margin: 0;
  }
`;

const Header = styled.div`
  text-align: center;
  padding: 3rem 3rem 2rem;
  position: relative;

  @media (max-width: 768px) {
    padding: 2rem 2rem 1.5rem;
  }
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
  animation: ${bounce} 2s infinite;

  &::before {
    content: '🔐';
    font-size: 2.5rem;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
  max-width: 400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const Content = styled.div`
  padding: 0 3rem 3rem;

  @media (max-width: 768px) {
    padding: 0 2rem 2rem;
  }
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 2rem;
  transition: all 0.3s ease;
  text-decoration: none;

  &:hover {
    color: #3b82f6;
    transform: translateX(-3px);
  }

  &::before {
    content: '←';
    font-size: 1.2rem;
    transition: transform 0.3s ease;
  }

  &:hover::before {
    transform: translateX(-2px);
  }
`;

const InfoSection = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  border-left: 4px solid #3b82f6;
`;

const InfoTitle = styled.div`
  font-weight: 600;
  color: #1e40af;
  margin-bottom: 1rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: 'ℹ️';
    font-size: 1.1rem;
  }
`;

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InfoItem = styled.div`
  font-size: 0.9rem;
  color: #1e40af;
  line-height: 1.5;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;

  &::before {
    content: '•';
    color: #3b82f6;
    font-weight: bold;
    margin-top: 0.1rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
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
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '📧';
    font-size: 1rem;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
  }
`;

const RequiredMark = styled.span`
  color: #ef4444;
  font-weight: 700;
  margin-left: 2px;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1.25rem;
  padding-right: 3rem;
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

const InputIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 1.1rem;
  pointer-events: none;
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

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
  animation: spin 0.8s ease-in-out infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Message = styled.div`
  padding: 1rem 1.25rem;
  border-radius: 12px;
  font-weight: 500;
  font-size: 0.95rem;
  animation: ${fadeIn} 0.3s ease-out;
  border: 1px solid;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  ${({ type }) => type === 'error' ? `
    color: #dc2626;
    background: linear-gradient(135deg, #fef2f2, #fee2e2);
    border-color: #fecaca;
    
    &::before {
      content: '❌';
      font-size: 1rem;
    }
  ` : `
    color: #16a34a;
    background: linear-gradient(135deg, #f0fdf4, #dcfce7);
    border-color: #bbf7d0;
    
    &::before {
      content: '✅';
      font-size: 1rem;
    }
  `}
`;

const SecurityBadges = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 0;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const SecurityBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  color: #1e40af;
  backdrop-filter: blur(10px);

  span:first-child {
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.75rem;
  }
`;

const LinksSection = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const LinkRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const StyledLink = styled(Link)`
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.3rem;

  &:hover {
    color: #3b82f6;
    transform: translateY(-1px);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
`;

const SuccessCard = styled.div`
  text-align: center;
  animation: ${fadeInUp} 0.6s ease-out;
`;

const SuccessIcon = styled.div`
  width: 100px;
  height: 100px;
  margin: 0 auto 2rem;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
  box-shadow: 0 15px 40px rgba(16, 185, 129, 0.3);
  animation: ${bounce} 2s infinite;

  &::before {
    content: '✉️';
    font-size: 3.5rem;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
  }
`;

const SuccessTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
  letter-spacing: -0.01em;
`;

const SuccessText = styled.p`
  color: #6b7280;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2rem;

  strong {
    color: #3b82f6;
    font-weight: 600;
  }
`;

function ResetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      navigate('/main', { replace: true });
    }
  }, [navigate]);

  const handleSend = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('이메일 주소를 입력해주세요.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/reset-password-request/', {
        email: email,
      });
      setMessage(res.data.message);
      setError('');
      setIsEmailSent(true);
    } catch (err) {
      setError(extractFirstError(err) || '비밀번호 재설정 요청에 실패했습니다.');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend(e);
    }
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <FloatingElement size="70px" top="10%" left="15%" duration="6s" delay="0s" />
        <FloatingElement size="50px" top="20%" left="85%" duration="4s" delay="1s" />
        <FloatingElement size="35px" top="75%" left="10%" duration="5s" delay="2s" />
        <FloatingElement size="90px" top="60%" left="80%" duration="7s" delay="0.5s" />
        <FloatingElement size="45px" top="35%" left="5%" duration="4.5s" delay="1.5s" />
        <FloatingElement size="25px" top="80%" left="90%" duration="3.5s" delay="2.5s" />

        <MainCard>
          <Header>
            <IconWrapper />
            <Title>비밀번호 재설정</Title>
            <Subtitle>
              등록된 이메일 주소로 비밀번호 재설정 링크를 보내드립니다
            </Subtitle>
          </Header>

          <Content>
            {!isEmailSent ? (
              <>
                <BackButton to="/login">로그인으로 돌아가기</BackButton>
                
                <InfoSection>
                  <InfoTitle>비밀번호 재설정 안내</InfoTitle>
                  <InfoList>
                    <InfoItem>회원가입 시 등록한 이메일 주소를 입력해주세요</InfoItem>
                    <InfoItem>재설정 링크는 이메일 발송 후 24시간 동안 유효합니다</InfoItem>
                    <InfoItem>스팸함도 확인해주시기 바랍니다</InfoItem>
                  </InfoList>
                </InfoSection>

                <Form onSubmit={handleSend}>
                  <InputGroup>
                    <Label htmlFor="email">
                      이메일 주소
                      <RequiredMark>*</RequiredMark>
                    </Label>
                    <InputWrapper>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your-email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={loading}
                      />
                      <InputIcon>📧</InputIcon>
                    </InputWrapper>
                  </InputGroup>

                  {error && <Message type="error">{error}</Message>}

                  <Button type="submit" disabled={loading || !email.trim()}>
                    {loading && <LoadingSpinner />}
                    {loading ? '전송 중...' : '🚀 재설정 링크 전송'}
                  </Button>
                </Form>

                <SecurityBadges>
                  <SecurityBadge>
                    <span>🛡️</span>
                    <span>SSL 암호화</span>
                  </SecurityBadge>
                  <SecurityBadge>
                    <span>🔐</span>
                    <span>개인정보 보호</span>
                  </SecurityBadge>
                  <SecurityBadge>
                    <span>⚡</span>
                    <span>즉시 발송</span>
                  </SecurityBadge>
                </SecurityBadges>

                <LinksSection>
                  <LinkRow>
                    <StyledLink to="/find-id">🔍 아이디 찾기</StyledLink>
                    <StyledLink to="/signup">✨ 회원가입</StyledLink>
                    <StyledLink to="/help">🎧 고객센터</StyledLink>
                  </LinkRow>
                </LinksSection>
              </>
            ) : (
              <SuccessCard>
                <SuccessIcon />
                <SuccessTitle>이메일이 전송되었습니다!</SuccessTitle>
                <SuccessText>
                  <strong>{email}</strong>로<br />
                  비밀번호 재설정 링크를 보내드렸습니다.<br />
                  이메일을 확인하고 링크를 클릭해주세요.
                </SuccessText>
                
                {message && <Message type="success">{message}</Message>}
                
                <Button 
                  onClick={() => {
                    setIsEmailSent(false);
                    setEmail('');
                    setMessage('');
                  }}
                  style={{ background: 'linear-gradient(135deg, #6b7280, #4b5563)' }}
                >
                  🔄 다시 시도하기
                </Button>

                <LinksSection>
                  <LinkRow>
                    <StyledLink to="/login">← 로그인으로 돌아가기</StyledLink>
                    <StyledLink to="/signup">✨ 회원가입</StyledLink>
                  </LinkRow>
                </LinksSection>
              </SuccessCard>
            )}
          </Content>
        </MainCard>
      </Container>
    </>
  );
}

export default ResetPassword;