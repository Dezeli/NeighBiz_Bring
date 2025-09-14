import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

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

const LoginButton = styled.button`
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

const FindButtonsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const FindButton = styled.button`
  flex: 1;
  padding: 0.75rem 1rem;
  background: rgba(148, 163, 184, 0.1);
  border: 1px solid rgba(148, 163, 184, 0.3);
  border-radius: 10px;
  color: #475569;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(148, 163, 184, 0.15);
    border-color: rgba(148, 163, 184, 0.4);
    color: #334155;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const SignupLink = styled.a`
  color: #0ea5e9;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    color: #0284c7;
    text-decoration: underline;
  }
`;

const Footer = styled.div`
  margin-top: 2rem;
  color: #9ca3af;
  font-size: 0.875rem;
`;

const OwnerLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // 디바이스 정보 생성 함수
  const getDeviceInfo = () => {
    const userAgent = navigator.userAgent;
    let browser = 'Unknown';
    let os = 'Unknown';

    // 브라우저 감지
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';

    // OS 감지
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS')) os = 'iOS';

    return `${browser} on ${os}`;
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await api.post('/accounts/owner-login/', { 
        username, 
        password,
        device_info: getDeviceInfo()
      });

      if (!res.data.success) {
        setError(res.data.message || '로그인에 실패했습니다.');
        return;
      }

      const { access, refresh } = res.data.data;
      await login(access, refresh);
      navigate('/owner/mypage');
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || '로그인에 실패했습니다.');
      } else {
        setError('로그인에 실패했습니다. 네트워크를 확인해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFindId = () => {
    navigate('/find-id');
  };

  const handleFindPassword = () => {
    navigate('/reset-password');
  };

  return (
    <Container>
      <ContentWrapper>
        <LogoSection>
          <Logo>
            <span className="neigh">Neigh</span>
            <span className="biz">Biz</span>
          </Logo>
          <Subtitle>사장님 로그인</Subtitle>
        </LogoSection>

        <FormContainer>
          <Form>
            <InputGroup>
              <Label>아이디</Label>
              <Input
                type="text"
                placeholder="아이디를 입력하세요"
                value={username}
                onChange={e => setUsername(e.target.value)}
                disabled={isLoading}
                required
              />
            </InputGroup>

            <InputGroup>
              <Label>비밀번호</Label>
              <Input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </InputGroup>

            {error && (
              <ErrorContainer>
                <span>⚠️</span>
                <ErrorText>{error}</ErrorText>
              </ErrorContainer>
            )}

            <LoginButton
              type="button"
              onClick={handleLogin}
              disabled={isLoading || !username.trim() || !password.trim()}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  로그인 중...
                </>
              ) : (
                <>
                  <span>🚀</span>
                  로그인
                </>
              )}
            </LoginButton>
          </Form>

          <FindButtonsContainer>
            <FindButton type="button" onClick={handleFindId}>
              아이디 찾기
            </FindButton>
            <FindButton type="button" onClick={handleFindPassword}>
              비밀번호 찾기
            </FindButton>
          </FindButtonsContainer>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <SignupLink href="/signup">
              계정이 없으신가요? 회원가입하기
            </SignupLink>
          </div>
        </FormContainer>

        <Footer>
          소상공인 간 제휴를 통한 상생 플랫폼
        </Footer>
      </ContentWrapper>
    </Container>
  );
};

export default OwnerLoginPage;