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

const HelpSection = styled.div`
  margin-top: 3rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const HelpTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`;

const HelpList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const HelpItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
  
  &::before {
    content: '💡';
    font-size: 1.1rem;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  }
`;

const ContactSection = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.15);
`;

const ContactTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: '📞';
    font-size: 1.2rem;
  }
`;

const ContactInfo = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
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

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
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

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &::before {
    content: '🔍';
    font-size: 1.5rem;
  }
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LabelIcon = styled.span`
  font-size: 1rem;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
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
  padding-left: 3rem;
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
  left: 1rem;
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
  margin-top: 0.5rem;
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

const SuccessActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const ActionButton = styled(Link)`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #3b82f6;
  border-radius: 8px;
  background: ${props => props.primary ? '#3b82f6' : 'white'};
  color: ${props => props.primary ? 'white' : '#3b82f6'};
  font-weight: 600;
  font-size: 0.9rem;
  text-align: center;
  transition: all 0.3s ease;
  text-decoration: none;

  &:hover {
    background: ${props => props.primary ? '#1d4ed8' : '#f8fafc'};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
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

const SecurityNote = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.85rem;
  color: #64748b;
  line-height: 1.5;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;

  &::before {
    content: '🛡️';
    font-size: 1rem;
    margin-top: 0.1rem;
  }
`;

const InfoPanel = styled.div`
  margin-top: 1.5rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  border-left: 4px solid #3b82f6;
`;

const InfoTitle = styled.div`
  font-weight: 600;
  color: #1e40af;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: 'ℹ️';
    font-size: 1rem;
  }
`;

const InfoText = styled.div`
  font-size: 0.85rem;
  color: #1e40af;
  line-height: 1.5;
`;

function FindID() {
  const [form, setForm] = useState({
    email: '',
    phone_number: '',
  });
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      navigate('/main', { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError(''); // Clear error when user starts typing
  };

  const handleFind = async (e) => {
    e.preventDefault();
    
    if (!form.email.trim()) {
      setError('이메일을 입력해주세요.');
      return;
    }
    if (!form.phone_number.trim()) {
      setError('전화번호를 입력해주세요.');
      return;
    }

    setError('');
    setResult('');
    setLoading(true);

    try {
      const res = await api.post('/auth/find-id/', form);
      setResult(`당신의 아이디: ${res.data.data.username}`);
    } catch (err) {
      setError(extractFirstError(err, '아이디 찾기 실패'));
      setResult('');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleFind(e);
    }
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        {/* Floating Elements */}
        <FloatingElement size="70px" top="10%" left="5%" duration="5s" delay="0s" />
        <FloatingElement size="50px" top="20%" left="88%" duration="4s" delay="1s" />
        <FloatingElement size="35px" top="75%" left="8%" duration="6s" delay="2s" />
        <FloatingElement size="90px" top="65%" left="85%" duration="7s" delay="0.5s" />
        <FloatingElement size="45px" top="45%" left="3%" duration="4.5s" delay="1.5s" />
        <FloatingElement size="25px" top="85%" left="92%" duration="3.5s" delay="2.5s" />

        <LeftPanel>
          <BrandSection>
            <Logo>
              Neigh<span>biz</span>
            </Logo>
            <BrandTitle>
              아이디를 잊어버리셨나요?
            </BrandTitle>
            <BrandSubtitle>
              걱정하지 마세요! 간단한 정보 입력으로<br />
              아이디를 안전하게 찾아드립니다
            </BrandSubtitle>

            <HelpSection>
              <HelpTitle>아이디 찾기 가이드</HelpTitle>
              <HelpList>
                <HelpItem>
                  회원가입 시 등록한 이메일 주소를 입력하세요
                </HelpItem>
                <HelpItem>
                  본인 인증을 위한 전화번호를 입력하세요
                </HelpItem>
                <HelpItem>
                  정보가 일치하면 즉시 아이디를 확인할 수 있습니다
                </HelpItem>
                <HelpItem>
                  여전히 문제가 있다면 고객센터로 연락하세요
                </HelpItem>
              </HelpList>
            </HelpSection>

            <ContactSection>
              <ContactTitle>도움이 필요하신가요?</ContactTitle>
              <ContactInfo>
                고객센터: 1588-0000<br />
                운영시간: 평일 09:00 - 18:00<br />
                이메일: help@neighbiz.com
              </ContactInfo>
            </ContactSection>
          </BrandSection>
        </LeftPanel>

        <RightPanel>
          <Card>
            <BackButton to="/login">
              로그인 페이지로 돌아가기
            </BackButton>

            <CardHeader>
              <Title>아이디 찾기</Title>
              <Subtitle>
                가입 시 등록한 정보를 입력하여<br />
                아이디를 찾아보세요
              </Subtitle>
            </CardHeader>

            <Form onSubmit={handleFind}>
              <InputGroup>
                <Label htmlFor="email">
                  <LabelIcon>📧</LabelIcon>
                  이메일 주소
                  <RequiredMark>*</RequiredMark>
                </Label>
                <InputWrapper>
                  <InputIcon>📧</InputIcon>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="가입 시 등록한 이메일을 입력하세요"
                    value={form.email}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                  />
                </InputWrapper>
              </InputGroup>

              <InputGroup>
                <Label htmlFor="phone_number">
                  <LabelIcon>📱</LabelIcon>
                  전화번호
                  <RequiredMark>*</RequiredMark>
                </Label>
                <InputWrapper>
                  <InputIcon>📱</InputIcon>
                  <Input
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                    placeholder="'-' 없이 숫자만 입력하세요"
                    value={form.phone_number}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                  />
                </InputWrapper>
              </InputGroup>

              {error && <Message type="error">{error}</Message>}
              
              {result && (
                <>
                  <Message type="success">{result}</Message>
                  <SuccessActions>
                    <ActionButton to="/" primary>
                      로그인하기
                    </ActionButton>
                    <ActionButton to="/reset-password">
                      비밀번호 찾기
                    </ActionButton>
                  </SuccessActions>
                </>
              )}

              <Button type="submit" disabled={loading}>
                {loading && <LoadingSpinner />}
                {loading ? '아이디 찾는 중...' : '🔍 아이디 찾기'}
              </Button>
            </Form>

            <InfoPanel>
              <InfoTitle>아이디 찾기 안내</InfoTitle>
              <InfoText>
                • 등록된 이메일과 전화번호가 일치해야 합니다<br />
                • 개인정보 보호를 위해 부분적으로 마스킹되어 표시됩니다<br />
                • 정보가 일치하지 않으면 고객센터로 문의해주세요
              </InfoText>
            </InfoPanel>

            <SecurityNote>
              개인정보 보호를 위해 SSL 암호화 통신으로 안전하게 처리됩니다.
              입력하신 정보는 아이디 찾기 목적으로만 사용되며 저장되지 않습니다.
            </SecurityNote>

            <LinksSection>
              <LinkRow>
                <StyledLink to="/forgot-password">
                  🔒 비밀번호 찾기
                </StyledLink>
                <StyledLink to="/signup">
                  ✨ 회원가입
                </StyledLink>
                <StyledLink to="/help">
                  🎧 고객센터
                </StyledLink>
              </LinkRow>
            </LinksSection>
          </Card>
        </RightPanel>
      </Container>
    </>
  );
}

export default FindID;