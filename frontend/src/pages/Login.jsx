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

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  background-size: 400% 400%;
  animation: ${gradientShift} 15s ease infinite;
  overflow: hidden;
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

const LeftPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4rem 2rem;
  position: relative;
  z-index: 2;
  color: white;
  text-align: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const RightPanel = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    flex: none;
    width: 100%;
    min-height: 100vh;
  }
`;

const BrandSection = styled.div`
  animation: ${slideInLeft} 1s ease-out;
  max-width: 500px;
`;

const Logo = styled.div`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 2rem;
  letter-spacing: -0.02em;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);

  span {
    color: #fbbf24;
  }
`;

const BrandTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

const BrandSubtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateX(10px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 1.5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
`;

const FeatureText = styled.span`
  font-weight: 500;
  font-size: 1rem;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: 3rem;
  border-radius: 24px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 450px;
  width: 100%;
  position: relative;
  overflow: hidden;
  animation: ${slideInRight} 1s ease-out;

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
    margin: 2rem;
    padding: 2rem;
    max-width: none;
  }
`;

const CardHeader = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 1rem;
  font-weight: 500;
`;

const Form = styled.form`
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

const InputIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 1.2rem;
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
  animation: spin 0.8s ease-in-out infinite;
  margin-right: 0.5rem;

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

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 2rem 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
  }
  
  span {
    padding: 0 1rem;
    color: #9ca3af;
    font-size: 0.9rem;
    font-weight: 500;
  }
`;

const SocialLogin = styled.div`
  display: flex;
  gap: 1rem;
`;

const SocialButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  color: #374151;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    border-color: #d1d5db;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const LinksSection = styled.div`
  margin-top: 2rem;
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
`;

const StyledLink = styled(Link)`
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;

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

const SignupText = styled.p`
  color: #6b7280;
  font-size: 0.95rem;
  
  a {
    color: #3b82f6;
    font-weight: 600;
    transition: all 0.3s ease;
    
    &:hover {
      color: #1d4ed8;
      transform: translateY(-1px);
      display: inline-block;
    }
  }
`;

const TrustBadges = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
`;

const TrustBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  font-weight: 500;
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: 3rem;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.15);
  }
`;

const StatNumber = styled.div`
  font-size: 1.8rem;
  font-weight: 800;
  color: white;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
`;

function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) navigate('/main');
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError(''); // Clear error when user starts typing
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!form.username.trim()) {
      setError('아이디를 입력해주세요.');
      return;
    }
    if (!form.password.trim()) {
      setError('비밀번호를 입력해주세요.');
      return;
    }

    setError('');
    setLoading(true);
    
    try {
      const res = await api.post('/auth/login/', form);
      const { access, refresh } = res.data.data;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      navigate('/main');
    } catch (err) {
      setError(extractFirstError(err, '로그인에 실패했습니다.'));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin(e);
    }
  };

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

        <LeftPanel>
          <BrandSection>
            <Logo>
              Neigh<span>biz</span>
            </Logo>
            <BrandTitle>
              믿을 수 있는 비즈니스<br />
              파트너와 함께하세요
            </BrandTitle>
            <BrandSubtitle>
              검증된 사업자들과의 안전한 제휴 매칭으로<br />
              귀하의 비즈니스를 한 단계 성장시켜보세요
            </BrandSubtitle>

            <FeatureList>
              <FeatureItem>
                <FeatureIcon>🏆</FeatureIcon>
                <FeatureText>5단계 검증된 프리미엄 사업자만</FeatureText>
              </FeatureItem>
              <FeatureItem>
                <FeatureIcon>🚀</FeatureIcon>
                <FeatureText>AI 기반 정밀 매칭 시스템</FeatureText>
              </FeatureItem>
              <FeatureItem>
                <FeatureIcon>🔐</FeatureIcon>
                <FeatureText>블록체인 기반 안전한 거래</FeatureText>
              </FeatureItem>
              <FeatureItem>
                <FeatureIcon>📈</FeatureIcon>
                <FeatureText>평균 매칭 성공률 99.2%</FeatureText>
              </FeatureItem>
            </FeatureList>

            <StatsSection>
              <StatItem>
                <StatNumber>25,000+</StatNumber>
                <StatLabel>검증된 사업자</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>99.2%</StatNumber>
                <StatLabel>매칭 성공률</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>12시간</StatNumber>
                <StatLabel>평균 매칭 시간</StatLabel>
              </StatItem>
            </StatsSection>

            <TrustBadges>
              <TrustBadge>
                <span>🛡️</span>
                <span>SSL 보안</span>
              </TrustBadge>
              <TrustBadge>
                <span>✅</span>
                <span>KISA 인증</span>
              </TrustBadge>
              <TrustBadge>
                <span>🏅</span>
                <span>ISO 27001</span>
              </TrustBadge>
            </TrustBadges>
          </BrandSection>
        </LeftPanel>

        <RightPanel>
          <Card>
            <CardHeader>
              <Title>로그인</Title>
              <Subtitle>비즈니스 성공의 여정을 시작하세요</Subtitle>
            </CardHeader>

            <Form onSubmit={handleLogin}>
              <InputGroup>
                <Label htmlFor="username">아이디</Label>
                <InputWrapper>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="아이디를 입력하세요"
                    value={form.username}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                  />
                </InputWrapper>
              </InputGroup>

              <InputGroup>
                <Label htmlFor="password">비밀번호</Label>
                <InputWrapper>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="비밀번호를 입력하세요"
                    value={form.password}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                  />
                  <InputIcon 
                    style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </InputIcon>
                </InputWrapper>
              </InputGroup>

              {error && <Message type="error">{error}</Message>}

              <Button type="submit" disabled={loading}>
                {loading && <LoadingSpinner />}
                {loading ? '로그인 중...' : '로그인'}
              </Button>
            </Form>

            <LinksSection>
              <LinkRow>
                <StyledLink to="/reset-password">비밀번호 찾기</StyledLink>
                <StyledLink to="/find-id">아이디 찾기</StyledLink>
                <StyledLink to="/help">고객센터</StyledLink>
              </LinkRow>
              
              <SignupText>
                아직 계정이 없으신가요?{' '}
                <Link to="/signup">지금 회원가입하기</Link>
              </SignupText>
            </LinksSection>
          </Card>
        </RightPanel>
      </Container>
    </>
  );
}

export default Login;