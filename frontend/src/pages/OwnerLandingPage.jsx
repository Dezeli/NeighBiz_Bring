import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

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
  font-size: 2.75rem;
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

const Tagline = styled.p`
  color: #64748b;
  font-size: 0.95rem;
  font-weight: 500;
`;

const Description = styled.p`
  color: #475569;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2.5rem;
  font-weight: 400;
`;

const FeatureBox = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(226, 232, 240, 0.6);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  color: #374151;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
  
  &:last-child {
    margin-bottom: 0;
  }

  &:before {
    content: "✓";
    display: inline-block;
    width: 20px;
    height: 20px;
    background: linear-gradient(135deg, #10b981 0%, #0ea5e9 100%);
    color: white;
    border-radius: 50%;
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    line-height: 20px;
    margin-right: 12px;
    flex-shrink: 0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
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

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SecondaryButton = styled.button`
  width: 100%;
  height: 52px;
  background: rgba(255, 255, 255, 0.9);
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: white;
    border-color: #d1d5db;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

const OwnerLandingPage = () => {
  const navigate = useNavigate();
  
  const handleLogin = () => {
    navigate('/login');
    console.log('로그인 페이지로 이동');
  };
  
  const handleSignup = () => {
    navigate('/signup');
    console.log('회원가입 페이지로 이동');
  };

  return (
    <Container>
      <ContentWrapper>
        <LogoSection>
          <Logo>
            <span className="neigh">Neigh</span>
            <span className="biz">Biz</span>
          </Logo>
          <Tagline>사장님 센터</Tagline>
        </LogoSection>

        <Description>
          우리 동네 가게들과 제휴하고<br />
          고객에게 특별한 혜택을 제공하세요
        </Description>

        <FeatureBox>
          <FeatureList>
            <FeatureItem>QR 코드로 간편한 쿠폰 발급</FeatureItem>
            <FeatureItem>제휴 가게와 상호 마케팅 효과</FeatureItem>
            <FeatureItem>실시간 성과 분석 대시보드</FeatureItem>
            <FeatureItem>고객 재방문율 증대</FeatureItem>
          </FeatureList>
        </FeatureBox>

        <ButtonGroup>
          <PrimaryButton onClick={handleLogin}>
            로그인하기
          </PrimaryButton>
          <SecondaryButton onClick={handleSignup}>
            회원가입하기
          </SecondaryButton>
        </ButtonGroup>
        </ContentWrapper>
    </Container>
  );
};

export default OwnerLandingPage;