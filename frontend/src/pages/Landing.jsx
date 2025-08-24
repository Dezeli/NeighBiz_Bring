import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled, { keyframes, createGlobalStyle } from 'styled-components';

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

const Container = styled.div`
 width: 100%;
 min-height: 100vh;
 position: relative;
 background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
 background-size: 400% 400%;
 animation: ${gradientShift} 15s ease infinite;
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

const Header = styled.header`
 position: fixed;
 top: 0;
 width: 100%;
 padding: 1rem 0;
 background: rgba(255, 255, 255, 0.95);
 backdrop-filter: blur(20px);
 border-bottom: 1px solid rgba(0, 0, 0, 0.05);
 z-index: 1000;
 transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

 &.scrolled {
   padding: 0.8rem 0;
   box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
 }
`;

const HeaderContent = styled.div`
 max-width: 1200px;
 margin: 0 auto;
 padding: 0 2rem;
 display: flex;
 justify-content: space-between;
 align-items: center;
`;

const Logo = styled.div`
 font-size: 1.8rem;
 font-weight: 800;
 color: #2563eb;
 letter-spacing: -0.02em;

 span {
   color: #7c3aed;
 }
`;

const Nav = styled.nav`
 display: flex;
 gap: 2.5rem;

 @media (max-width: 768px) {
   display: none;
 }
`;

const NavLink = styled.a`
 color: #374151;
 font-weight: 500;
 transition: all 0.3s ease;
 position: relative;

 &:hover {
   color: #2563eb;
   transform: translateY(-1px);
 }

 &::after {
   content: '';
   position: absolute;
   bottom: -5px;
   left: 0;
   width: 0;
   height: 2px;
   background: linear-gradient(90deg, #2563eb, #7c3aed);
   transition: width 0.3s ease;
 }

 &:hover::after {
   width: 100%;
 }
`;

const HeroSection = styled.section`
 min-height: 100vh;
 display: flex;
 align-items: center;
 justify-content: center;
 text-align: center;
 padding: 8rem 2rem 4rem;
 position: relative;
 z-index: 2;
`;

const HeroContent = styled.div`
 max-width: 800px;
 animation: ${fadeInUp} 1s ease-out;
`;

const HeroTitle = styled.h1`
 font-size: clamp(2.5rem, 5vw, 4rem);
 font-weight: 800;
 color: white;
 margin-bottom: 1.5rem;
 line-height: 1.2;
 text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
 letter-spacing: -0.02em;
`;

const HeroSubtitle = styled.p`
 font-size: 1.3rem;
 color: rgba(255, 255, 255, 0.9);
 margin-bottom: 3rem;
 line-height: 1.6;
 font-weight: 300;
 text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`;

const HeroButtons = styled.div`
 display: flex;
 gap: 1.5rem;
 justify-content: center;
 flex-wrap: wrap;
`;

const PrimaryButton = styled(Link)`
 background: linear-gradient(135deg, #3b82f6, #1d4ed8);
 color: white;
 padding: 1rem 2.5rem;
 border-radius: 50px;
 font-weight: 600;
 font-size: 1.1rem;
 transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
 box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
 animation: ${pulse} 2s infinite;

 &:hover {
   transform: translateY(-3px);
   box-shadow: 0 20px 40px rgba(59, 130, 246, 0.6);
   animation: none;
 }
`;

const SecondaryButton = styled(Link)`
 background: rgba(255, 255, 255, 0.2);
 color: white;
 padding: 1rem 2.5rem;
 border-radius: 50px;
 font-weight: 600;
 font-size: 1.1rem;
 border: 2px solid rgba(255, 255, 255, 0.3);
 backdrop-filter: blur(10px);
 transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

 &:hover {
   background: rgba(255, 255, 255, 0.3);
   border-color: rgba(255, 255, 255, 0.5);
   transform: translateY(-3px);
   box-shadow: 0 15px 35px rgba(255, 255, 255, 0.2);
 }
`;

const Section = styled.section`
 padding: 6rem 0;
 background: ${props => props.background || '#ffffff'};
 position: relative;
 overflow: hidden;
`;

const FeaturesSection = styled(Section)`
 background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
`;

const StatsSection = styled(Section)`
 background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
 color: white;
`;

const HowItWorksSection = styled(Section)`
 background: white;
`;

const TestimonialsSection = styled(Section)`
 background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
`;

const CTASection = styled(Section)`
 background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%);
 color: white;
 text-align: center;
`;

const SectionContainer = styled.div`
 max-width: 1200px;
 margin: 0 auto;
 padding: 0 2rem;
`;

const SectionTitle = styled.h2`
 font-size: clamp(2rem, 4vw, 3rem);
 font-weight: 800;
 text-align: center;
 margin-bottom: 1rem;
 color: ${props => props.color || '#1f2937'};
 letter-spacing: -0.02em;
`;

const SectionSubtitle = styled.p`
 font-size: 1.2rem;
 text-align: center;
 color: ${props => props.color || '#6b7280'};
 margin-bottom: 4rem;
 max-width: 600px;
 margin-left: auto;
 margin-right: auto;
 line-height: 1.6;
`;

const FeaturesGrid = styled.div`
 display: grid;
 grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
 gap: 2.5rem;
 margin-top: 4rem;
`;

const FeatureCard = styled.div`
 background: white;
 padding: 2.5rem;
 border-radius: 20px;
 box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
 transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
 border: 1px solid rgba(0, 0, 0, 0.05);
 position: relative;
 overflow: hidden;

 &::before {
   content: '';
   position: absolute;
   top: 0;
   left: 0;
   right: 0;
   height: 4px;
   background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
 }

 &:hover {
   transform: translateY(-10px);
   box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15);
 }
`;

const FeatureIcon = styled.div`
 font-size: 3rem;
 margin-bottom: 1.5rem;
 filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
`;

const FeatureTitle = styled.h3`
 font-size: 1.4rem;
 font-weight: 700;
 color: #1f2937;
 margin-bottom: 1rem;
 letter-spacing: -0.01em;
`;

const FeatureDescription = styled.p`
 color: #6b7280;
 line-height: 1.7;
 font-size: 1rem;
`;

const StatsGrid = styled.div`
 display: grid;
 grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
 gap: 3rem;
 text-align: center;
`;

const StatItem = styled.div`
 padding: 2rem;
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
 font-size: 2.5rem;
 font-weight: 800;
 color: white;
 margin-bottom: 0.5rem;
 text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`;

const StatLabel = styled.div`
 font-size: 1rem;
 color: rgba(255, 255, 255, 0.8);
 font-weight: 500;
`;

const ProcessGrid = styled.div`
 display: grid;
 grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
 gap: 3rem;
 margin-top: 4rem;
`;

const ProcessStep = styled.div`
 text-align: center;
 position: relative;
 padding: 2rem;

 &::after {
   content: '→';
   position: absolute;
   top: 2rem;
   right: -1.5rem;
   font-size: 2rem;
   color: #d1d5db;
   display: ${props => props.isLast ? 'none' : 'block'};

   @media (max-width: 768px) {
     display: none;
   }
 }
`;

const StepNumber = styled.div`
 width: 80px;
 height: 80px;
 background: linear-gradient(135deg, #3b82f6, #1d4ed8);
 color: white;
 border-radius: 50%;
 display: flex;
 align-items: center;
 justify-content: center;
 font-size: 2rem;
 font-weight: 800;
 margin: 0 auto 2rem;
 box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
`;

const StepTitle = styled.h3`
 font-size: 1.5rem;
 font-weight: 700;
 color: #1f2937;
 margin-bottom: 1rem;
`;

const StepDescription = styled.p`
 color: #6b7280;
 line-height: 1.7;
 font-size: 1rem;
`;

const TestimonialsGrid = styled.div`
 display: grid;
 grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
 gap: 2.5rem;
 margin-top: 4rem;
`;

const TestimonialCard = styled.div`
 background: white;
 padding: 2.5rem;
 border-radius: 20px;
 box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
 transition: all 0.3s ease;
 border-left: 4px solid #f59e0b;

 &:hover {
   transform: translateY(-5px);
   box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
 }
`;

const TestimonialText = styled.p`
 font-size: 1.1rem;
 line-height: 1.7;
 color: #374151;
 margin-bottom: 2rem;
 font-style: italic;
`;

const TestimonialAuthor = styled.div`
 display: flex;
 align-items: center;
 gap: 1rem;
`;

const AuthorAvatar = styled.div`
 width: 50px;
 height: 50px;
 background: linear-gradient(135deg, #f59e0b, #d97706);
 color: white;
 border-radius: 50%;
 display: flex;
 align-items: center;
 justify-content: center;
 font-weight: 700;
 font-size: 1.2rem;
`;

const AuthorInfo = styled.div``;

const AuthorName = styled.div`
 font-weight: 600;
 color: #1f2937;
 margin-bottom: 0.25rem;
`;

const AuthorTitle = styled.div`
 color: #6b7280;
 font-size: 0.9rem;
`;

const CTAContent = styled.div`
 max-width: 800px;
 margin: 0 auto;
`;

const CTATitle = styled.h2`
 font-size: clamp(2.5rem, 4vw, 3.5rem);
 font-weight: 800;
 margin-bottom: 1.5rem;
 text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

const CTAText = styled.p`
 font-size: 1.3rem;
 margin-bottom: 3rem;
 line-height: 1.6;
 color: rgba(255, 255, 255, 0.9);
`;

const CTAButtons = styled.div`
 display: flex;
 gap: 1.5rem;
 justify-content: center;
 flex-wrap: wrap;
`;

const Footer = styled.footer`
 background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
 color: white;
 padding: 4rem 0 2rem;
`;

const FooterContent = styled.div`
 max-width: 1200px;
 margin: 0 auto;
 padding: 0 2rem;
 display: grid;
 grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
 gap: 3rem;
`;

const FooterSection = styled.div``;

const FooterTitle = styled.h3`
 font-size: 1.3rem;
 font-weight: 700;
 margin-bottom: 1.5rem;
 color: white;
`;

const FooterText = styled.p`
 color: #94a3b8;
 line-height: 1.6;
 margin-bottom: 1rem;
`;

const FooterLinks = styled.div`
 display: flex;
 flex-direction: column;
 gap: 0.8rem;
`;

const FooterLink = styled.a`
 color: #94a3b8;
 transition: color 0.3s ease;

 &:hover {
   color: #3b82f6;
 }
`;

const FooterBottom = styled.div`
 max-width: 1200px;
 margin: 3rem auto 0;
 padding: 2rem 2rem 0;
 border-top: 1px solid #374151;
 text-align: center;
 color: #6b7280;
`;

function Landing() {
 const navigate = useNavigate();
 const location = useLocation();
 const [scrolled, setScrolled] = useState(false);

 useEffect(() => {
   const token = localStorage.getItem('accessToken');

   if (location.pathname === '/' && token) {
     navigate('/main', { replace: true });
   }

   const handleScroll = () => {
     setScrolled(window.scrollY > 50);
   };

   window.addEventListener('scroll', handleScroll);
   return () => window.removeEventListener('scroll', handleScroll);
 }, [location.pathname, navigate]);

 return (
   <>
     <GlobalStyle />
     <Container>
       <FloatingElement size="60px" top="10%" left="10%" duration="4s" delay="0s" />
       <FloatingElement size="40px" top="20%" left="80%" duration="3s" delay="1s" />
       <FloatingElement size="80px" top="60%" left="5%" duration="5s" delay="2s" />
       <FloatingElement size="30px" top="70%" left="90%" duration="3.5s" delay="0.5s" />
       <FloatingElement size="50px" top="30%" left="70%" duration="4.5s" delay="1.5s" />

       <Header className={scrolled ? 'scrolled' : ''}>
         <HeaderContent>
           <Logo>
             Neigh<span>biz</span>
           </Logo>
           <Nav>
             <NavLink href="#features">서비스 소개</NavLink>
             <NavLink href="#how-it-works">이용 가이드</NavLink>
             <NavLink href="#testimonials">성공 사례</NavLink>
             <NavLink href="#contact">파트너십</NavLink>
           </Nav>
         </HeaderContent>
       </Header>

       <HeroSection>
         <HeroContent>
           <HeroTitle>비즈니스의 새로운 연결,<br />Neighbiz와 함께</HeroTitle>
           <HeroSubtitle>
             검증된 사업자들과의 신뢰할 수 있는 제휴 매칭 서비스<br />
             AI 기반 매칭으로 최적의 비즈니스 파트너를 찾아보세요
           </HeroSubtitle>
           <HeroButtons>
             <PrimaryButton to="/signup">지금 시작하기</PrimaryButton>
             <SecondaryButton to="/login">서비스 둘러보기</SecondaryButton>
           </HeroButtons>
         </HeroContent>
       </HeroSection>

       <FeaturesSection id="features">
         <SectionContainer>
           <SectionTitle>왜 성공한 사업자들이 Neighbiz를 선택할까요?</SectionTitle>
           <SectionSubtitle>
             검증된 기술력과 차별화된 서비스로 귀하의 비즈니스 성장을 가속화합니다
           </SectionSubtitle>
           <FeaturesGrid>
             <FeatureCard>
               <FeatureIcon>🏆</FeatureIcon>
               <FeatureTitle>프리미엄 사업자 검증 시스템</FeatureTitle>
               <FeatureDescription>
                 5단계 검증 프로세스를 통해 선별된 우수 사업자들만 입점합니다. 
                 사업실적, 재무상태, 고객만족도까지 종합 평가하여 신뢰할 수 있는 파트너만 연결해드립니다.
               </FeatureDescription>
             </FeatureCard>
             <FeatureCard>
               <FeatureIcon>🚀</FeatureIcon>
               <FeatureTitle>AI 기반 정밀 매칭</FeatureTitle>
               <FeatureDescription>
                 머신러닝 알고리즘이 귀하의 비즈니스 모델, 규모, 목표를 분석하여 
                 최적의 파트너를 추천합니다. 평균 매칭 정확도 94%, 첫 미팅 성사율 89%를 자랑합니다.
               </FeatureDescription>
             </FeatureCard>
             <FeatureCard>
               <FeatureIcon>🔐</FeatureIcon>
               <FeatureTitle>스마트 계약 보안 시스템</FeatureTitle>
               <FeatureDescription>
                 블록체인 기반 스마트 컨트랙트와 다단계 에스크로 시스템으로 
                 거래의 투명성과 안전성을 보장합니다. 법무팀 24시간 대기로 분쟁 제로 달성.
               </FeatureDescription>
             </FeatureCard>
           </FeaturesGrid>
         </SectionContainer>
       </FeaturesSection>

       <StatsSection>
         <SectionContainer>
           <StatsGrid>
             <StatItem>
               <StatNumber>25,000+</StatNumber>
               <StatLabel>검증된 프리미엄 사업자</StatLabel>
             </StatItem>
             <StatItem>
               <StatNumber>99.2%</StatNumber>
               <StatLabel>매칭 성공률</StatLabel>
             </StatItem>
             <StatItem>
               <StatNumber>4.95/5</StatNumber>
               <StatLabel>고객 만족도</StatLabel>
             </StatItem>
             <StatItem>
               <StatNumber>12시간</StatNumber>
               <StatLabel>평균 첫 매칭 시간</StatLabel>
             </StatItem>
           </StatsGrid>
         </SectionContainer>
       </StatsSection>

       <HowItWorksSection id="how-it-works">
         <SectionContainer>
           <SectionTitle>성공적인 파트너십, 3단계면 충분합니다</SectionTitle>
           <SectionSubtitle>
             복잡한 절차 없이 간단하게, 하지만 확실한 결과를 보장하는 프로세스
           </SectionSubtitle>
           <ProcessGrid>
             <ProcessStep>
               <StepNumber>1</StepNumber>
               <StepTitle>비즈니스 프로필 구축</StepTitle>
               <StepDescription>
                 사업 현황과 목표를 상세히 입력하세요. 전담 컨설턴트가 
                 프로필 최적화를 도와드리며, 3분만에 완성 가능합니다.
               </StepDescription>
             </ProcessStep>
             <ProcessStep>
               <StepNumber>2</StepNumber>
               <StepTitle>AI 정밀 매칭</StepTitle>
               <StepDescription>
                 고도화된 매칭 알고리즘이 25,000개 사업자 데이터베이스에서 
                 귀하에게 최적화된 파트너 후보군을 선별하여 제안합니다.
               </StepDescription>
             </ProcessStep>
             <ProcessStep isLast>
               <StepNumber>3</StepNumber>
               <StepTitle>스마트 파트너십 체결</StepTitle>
               <StepDescription>
                 관심 파트너와 플랫폼 내에서 안전하게 소통하고, 
                 법무검토를 거친 표준계약서로 투명한 파트너십을 시작하세요.
               </StepDescription>
             </ProcessStep>
           </ProcessGrid>
         </SectionContainer>
       </HowItWorksSection>

       <TestimonialsSection id="testimonials">
         <SectionContainer>
           <SectionTitle>성공한 사업자들의 생생한 후기</SectionTitle>
           <SectionSubtitle>
             실제 파트너십으로 비즈니스를 성장시킨 사업자들의 경험담
           </SectionSubtitle>
           <TestimonialsGrid>
             <TestimonialCard>
               <TestimonialText>
                 "6개월간 찾지 못했던 완벽한 공급업체를 Neighbiz에서 하루 만에 찾았습니다. 
                 매출이 40% 증가했고, 이제 안정적인 공급망을 확보했어요. 정말 혁신적인 서비스입니다."
               </TestimonialText>
               <TestimonialAuthor>
                 <AuthorAvatar>김</AuthorAvatar>
                 <AuthorInfo>
                   <AuthorName>김성민 대표</AuthorName>
                   <AuthorTitle>프리미엄 카페 체인 운영</AuthorTitle>
                 </AuthorInfo>
               </TestimonialAuthor>
             </TestimonialCard>
             <TestimonialCard>
               <TestimonialText>
                 "스타트업에게는 신뢰할 수 있는 파트너 찾기가 생존과 직결됩니다. 
                 Neighbiz의 검증 시스템 덕분에 걱정 없이 대규모 프로젝트를 진행할 수 있었어요."
               </TestimonialText>
               <TestimonialAuthor>
                 <AuthorAvatar>박</AuthorAvatar>
                 <AuthorInfo>
                   <AuthorName>박지현 CEO</AuthorName>
                   <AuthorTitle>핀테크 스타트업 대표</AuthorTitle>
                 </AuthorInfo>
               </TestimonialAuthor>
             </TestimonialCard>
             <TestimonialCard>
               <TestimonialText>
                 "20년 사업 경험 중 가장 만족스러운 매칭 서비스입니다. 
                 AI 추천이 정말 정확해서 시간 낭비 없이 딱 맞는 파트너들만 만날 수 있었어요."
               </TestimonialText>
               <TestimonialAuthor>
                 <AuthorAvatar>이</AuthorAvatar>
                 <AuthorInfo>
                   <AuthorName>이동석 회장</AuthorName>
                   <AuthorTitle>건설업체 그룹 회장</AuthorTitle>
                 </AuthorInfo>
               </TestimonialAuthor>
             </TestimonialCard>
           </TestimonialsGrid>
         </SectionContainer>
       </TestimonialsSection>

       <FeaturesSection style={{background: 'white'}}>
         <SectionContainer>
           <SectionTitle>비즈니스 성공을 위한 프리미엄 기능들</SectionTitle>
           <SectionSubtitle>
             단순한 매칭을 넘어, 성공적인 파트너십 구축까지 완벽 지원
           </SectionSubtitle>
           <FeaturesGrid>
             <FeatureCard>
               <FeatureIcon>📊</FeatureIcon>
               <FeatureTitle>비즈니스 인텔리전스 대시보드</FeatureTitle>
               <FeatureDescription>
                 실시간 매칭 현황, 파트너십 성과, ROI 분석을 한눈에 확인하세요. 
                 데이터 기반 의사결정으로 더 나은 비즈니스 전략을 수립할 수 있습니다.
               </FeatureDescription>
             </FeatureCard>
             <FeatureCard>
               <FeatureIcon>💼</FeatureIcon>
               <FeatureTitle>전용 비즈니스 커뮤니케이션</FeatureTitle>
               <FeatureDescription>
                 암호화된 메시징, HD 화상회의, 안전한 파일 공유까지. 
                 모든 비즈니스 소통이 하나의 플랫폼에서 이루어집니다.
               </FeatureDescription>
             </FeatureCard>
             <FeatureCard>
               <FeatureIcon>🎯</FeatureIcon>
               <FeatureTitle>개인화 파트너 추천</FeatureTitle>
               <FeatureDescription>
                 과거 거래 패턴과 선호도를 학습하여 점점 더 정확한 
                 파트너를 추천합니다. 시간이 갈수록 더욱 똑똑해지는 AI 서비스.
               </FeatureDescription>
             </FeatureCard>
             <FeatureCard>
               <FeatureIcon>📱</FeatureIcon>
               <FeatureTitle>모바일 비즈니스 관리</FeatureTitle>
               <FeatureDescription>
                 언제 어디서나 스마트폰으로 파트너십 현황을 확인하고 
                 즉시 대응할 수 있는 완벽한 모바일 경험을 제공합니다.
               </FeatureDescription>
             </FeatureCard>
             <FeatureCard>
               <FeatureIcon>🛡️</FeatureIcon>
               <FeatureTitle>엔터프라이즈급 보안</FeatureTitle>
               <FeatureDescription>
                 은행 수준의 보안 시스템으로 귀하의 비즈니스 정보를 보호합니다. 
                 ISO 27001 인증, SOC 2 준수로 최고 수준의 보안을 보장합니다.
               </FeatureDescription>
             </FeatureCard>
             <FeatureCard>
               <FeatureIcon>🎧</FeatureIcon>
               <FeatureTitle>VIP 전담 고객지원</FeatureTitle>
               <FeatureDescription>
                 비즈니스 전문가로 구성된 전담팀이 24시간 대기합니다. 
                 전화, 화상, 채팅 등 원하는 방식으로 즉시 지원받으세요.
               </FeatureDescription>
             </FeatureCard>
           </FeaturesGrid>
         </SectionContainer>
       </FeaturesSection>

       <StatsSection style={{background: 'linear-gradient(135deg, #1e40af, #7c3aed)'}}>
         <SectionContainer>
           <SectionTitle style={{color: 'white', marginBottom: '3rem'}}>
             투명하고 합리적인 프리미엄 서비스
           </SectionTitle>
           <StatsGrid style={{maxWidth: '900px'}}>
             <StatItem>
               <StatNumber>무료</StatNumber>
               <StatLabel>기본 프로필 등록 및 매칭</StatLabel>
             </StatItem>
             <StatItem>
               <StatNumber>2.5%</StatNumber>
               <StatLabel>성공 기반 수수료만</StatLabel>
             </StatItem>
             <StatItem>
               <StatNumber>60일</StatNumber>
               <StatLabel>프리미엄 무료 체험</StatLabel>
             </StatItem>
             <StatItem>
               <StatNumber>100%</StatNumber>
               <StatLabel>만족 보장 정책</StatLabel>
             </StatItem>
           </StatsGrid>
         </SectionContainer>
       </StatsSection>

       <FeaturesSection>
         <SectionContainer>
           <SectionTitle>전 업종 네트워크로 무한한 가능성을</SectionTitle>
           <SectionSubtitle>
             업종의 경계를 넘나드는 혁신적인 파트너십을 경험하세요
           </SectionSubtitle>
           <FeaturesGrid>
             <FeatureCard>
               <FeatureIcon>🏪</FeatureIcon>
               <FeatureTitle>리테일 & 이커머스</FeatureTitle>
               <FeatureDescription>
                 글로벌 브랜드부터 로컬 매장까지, 공급망 최적화와 
                 마케팅 시너지를 창출할 수 있는 파트너들을 연결해드립니다.
               </FeatureDescription>
             </FeatureCard>
             <FeatureCard>
               <FeatureIcon>🏭</FeatureIcon>
               <FeatureTitle>제조 & 산업</FeatureTitle>
               <FeatureDescription>
                 스마트 팩토리, 친환경 소재, 첨단 기술까지. 
                 4차 산업혁명 시대의 혁신적인 제조 파트너십을 구축하세요.
               </FeatureDescription>
             </FeatureCard>
             <FeatureCard>
               <FeatureIcon>💻</FeatureIcon>
               <FeatureTitle>테크 & 스타트업</FeatureTitle>
               <FeatureDescription>
                 AI, 블록체인, IoT 전문가들과 협업하여 
                 차세대 비즈니스 모델을 만들어보세요. 기술과 비즈니스의 완벽한 결합.
               </FeatureDescription>
             </FeatureCard>
             <FeatureCard>
               <FeatureIcon>🍽️</FeatureIcon>
               <FeatureTitle>F&B & 호스피탈리티</FeatureTitle>
               <FeatureDescription>
                 프리미엄 식자재부터 독창적인 컨셉까지, 
                 고객 경험을 혁신할 수 있는 F&B 생태계 파트너들을 만나보세요.
               </FeatureDescription>
             </FeatureCard>
             <FeatureCard>
               <FeatureIcon>🏥</FeatureIcon>
               <FeatureTitle>헬스케어 & 웰니스</FeatureTitle>
               <FeatureDescription>
                 의료진, 연구기관, 헬스테크 기업들과의 협업으로 
                 더 건강한 미래를 만들어가는 혁신적인 파트너십을 시작하세요.
               </FeatureDescription>
             </FeatureCard>
             <FeatureCard>
               <FeatureIcon>🎓</FeatureIcon>
               <FeatureTitle>에듀테크 & 교육</FeatureTitle>
               <FeatureDescription>
                 미래 교육을 선도하는 에듀테크 혁신가들과 함께 
                 새로운 학습 경험을 창조하고 교육의 패러다임을 바꿔보세요.
               </FeatureDescription>
             </FeatureCard>
           </FeaturesGrid>
         </SectionContainer>
       </FeaturesSection>

       <Section style={{background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)'}}>
         <SectionContainer>
           <SectionTitle style={{color: '#0c4a6e'}}>성공 파트너십 사례</SectionTitle>
           <SectionSubtitle style={{color: '#0369a1'}}>
             Neighbiz를 통해 탄생한 혁신적인 비즈니스 성공 스토리들
           </SectionSubtitle>
           <FeaturesGrid>
             <FeatureCard style={{border: '2px solid #0ea5e9'}}>
               <FeatureIcon>🚀</FeatureIcon>
               <FeatureTitle>스타트업 × 대기업 협업</FeatureTitle>
               <FeatureDescription>
                 핀테크 스타트업과 은행의 혁신적인 파트너십으로 
                 새로운 금융 서비스 론칭. 6개월 만에 고객 50만 명 돌파.
               </FeatureDescription>
             </FeatureCard>
             <FeatureCard style={{border: '2px solid #10b981'}}>
               <FeatureIcon>🌱</FeatureIcon>
               <FeatureTitle>친환경 공급망 구축</FeatureTitle>
               <FeatureDescription>
                 유기농 농장과 프리미엄 레스토랑 체인의 직거래 시스템 구축으로 
                 친환경 가치와 수익성을 동시에 실현한 성공 사례.
               </FeatureDescription>
             </FeatureCard>
             <FeatureCard style={{border: '2px solid #f59e0b'}}>
               <FeatureIcon>🏆</FeatureIcon>
               <FeatureTitle>글로벌 진출 파트너십</FeatureTitle>
               <FeatureDescription>
                 K-뷰티 브랜드와 해외 유통업체의 매칭으로 
                 동남아 시장 진출 성공. 첫 해 매출 목표 300% 달성.
               </FeatureDescription>
             </FeatureCard>
           </FeaturesGrid>
         </SectionContainer>
       </Section>

       <Section style={{background: 'white'}}>
         <SectionContainer>
           <SectionTitle>Neighbiz만의 차별화된 장점</SectionTitle>
           <SectionSubtitle>
             왜 업계 리더들이 Neighbiz를 선택하는지 그 이유를 확인하세요
           </SectionSubtitle>
           <FeaturesGrid>
             <FeatureCard style={{background: 'linear-gradient(135deg, #fef3c7, #fde68a)'}}>
               <FeatureIcon>⚡</FeatureIcon>
               <FeatureTitle>업계 최고 매칭 속도</FeatureTitle>
               <FeatureDescription>
                 평균 12시간 내 첫 매칭 완료. 긴급한 프로젝트도 
                 빠른 대응으로 비즈니스 기회를 놓치지 않습니다.
               </FeatureDescription>
             </FeatureCard>
             <FeatureCard style={{background: 'linear-gradient(135deg, #ddd6fe, #c4b5fd)'}}>
               <FeatureIcon>🎯</FeatureIcon>
               <FeatureTitle>99.2% 매칭 정확도</FeatureTitle>
               <FeatureDescription>
                 수만 건의 성공 데이터를 학습한 AI가 제공하는 
                 업계 최고 수준의 매칭 정확도를 경험해보세요.
               </FeatureDescription>
             </FeatureCard>
             <FeatureCard style={{background: 'linear-gradient(135deg, #fecaca, #fca5a5)'}}>
               <FeatureIcon>🛡️</FeatureIcon>
               <FeatureTitle>분쟁 제로 시스템</FeatureTitle>
               <FeatureDescription>
                 스마트 컨트랙트와 전문 중재팀의 완벽한 조합으로 
                 지금까지 분쟁 발생률 0%를 달성했습니다.
               </FeatureDescription>
             </FeatureCard>
           </FeaturesGrid>
         </SectionContainer>
       </Section>

       <Section style={{background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', color: 'white'}}>
         <SectionContainer>
           <SectionTitle style={{color: 'white'}}>전문가 팀이 함께합니다</SectionTitle>
           <SectionSubtitle style={{color: 'rgba(255,255,255,0.8)'}}>
             각 분야 최고 전문가들이 귀하의 성공적인 파트너십을 도와드립니다
           </SectionSubtitle>
           <FeaturesGrid>
             <FeatureCard style={{background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)'}}>
               <FeatureIcon>👨‍💼</FeatureIcon>
               <FeatureTitle>비즈니스 컨설턴트</FeatureTitle>
               <FeatureDescription>
                 20년 이상 경력의 비즈니스 전문가들이 
                 최적의 파트너십 전략을 제안해드립니다.
               </FeatureDescription>
             </FeatureCard>
             <FeatureCard style={{background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)'}}>
               <FeatureIcon>⚖️</FeatureIcon>
               <FeatureTitle>법무 전문팀</FeatureTitle>
               <FeatureDescription>
                 계약서 검토부터 분쟁 해결까지, 
                 법적 리스크 없는 안전한 파트너십을 보장합니다.
               </FeatureDescription>
             </FeatureCard>
             <FeatureCard style={{background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)'}}>
               <FeatureIcon>📈</FeatureIcon>
               <FeatureTitle>성과 분석 전문가</FeatureTitle>
               <FeatureDescription>
                 데이터 사이언티스트가 파트너십 성과를 분석하고 
                 개선 방안을 지속적으로 제안해드립니다.
               </FeatureDescription>
             </FeatureCard>
           </FeaturesGrid>
         </SectionContainer>
       </Section>

       <CTASection id="contact">
         <CTAContent>
           <CTATitle>성공하는 사업자들의 선택</CTATitle>
           <CTAText>
             이미 25,000명의 사업자가 Neighbiz와 함께 성장하고 있습니다<br />
             당신의 비즈니스도 다음 단계로 도약할 준비가 되셨나요?
           </CTAText>
           <CTAButtons>
             <PrimaryButton to="/signup">프리미엄 체험 시작</PrimaryButton>
             <SecondaryButton to="/login">성공 사례 더보기</SecondaryButton>
           </CTAButtons>
         </CTAContent>
       </CTASection>

       <Footer>
         <FooterContent>
           <FooterSection>
             <FooterTitle>Neighbiz</FooterTitle>
             <FooterText>
               프리미엄 사업자들을 위한 
               차세대 B2B 파트너십 플랫폼
             </FooterText>
             <FooterText style={{marginTop: '2rem'}}>
               📧 business@neighbiz.com<br />
               📞 1588-0000 (24시간 VIP 라인)<br />
               🏢 서울시 강남구 테헤란로 427, 위워크타워
             </FooterText>
             <FooterText style={{marginTop: '1.5rem', fontSize: '0.9rem', opacity: 0.7}}>
               사업자등록번호: 123-45-67890<br />
               통신판매업신고: 2024-서울강남-1234
             </FooterText>
           </FooterSection>
           <FooterSection>
             <FooterTitle>프리미엄 서비스</FooterTitle>
             <FooterLinks>
               <FooterLink href="#features">AI 매칭 시스템</FooterLink>
               <FooterLink href="#features">스마트 컨트랙트</FooterLink>
               <FooterLink href="#features">비즈니스 인텔리전스</FooterLink>
               <FooterLink href="#features">전담 컨설팅</FooterLink>
               <FooterLink href="#features">글로벌 네트워크</FooterLink>
             </FooterLinks>
           </FooterSection>
           <FooterSection>
             <FooterTitle>비즈니스 정보</FooterTitle>
             <FooterLinks>
               <FooterLink href="#about">회사 소개</FooterLink>
               <FooterLink href="#team">경영진 & 자문단</FooterLink>
               <FooterLink href="#careers">인재 채용</FooterLink>
               <FooterLink href="#press">보도자료</FooterLink>
               <FooterLink href="#partnership">제휴 문의</FooterLink>
             </FooterLinks>
           </FooterSection>
           <FooterSection>
             <FooterTitle>고객 지원</FooterTitle>
             <FooterLinks>
               <FooterLink href="#help">이용 가이드</FooterLink>
               <FooterLink href="#faq">자주 묻는 질문</FooterLink>
               <FooterLink href="#support">기술 지원</FooterLink>
               <FooterLink href="#webinar">웨비나 & 교육</FooterLink>
               <FooterLink href="#api">개발자 API</FooterLink>
             </FooterLinks>
           </FooterSection>
         </FooterContent>
         <FooterBottom>
           © 2024 Neighbiz Co., Ltd. All rights reserved. | 
           <FooterLink href="#privacy" style={{marginLeft: '8px'}}>개인정보처리방침</FooterLink> | 
           <FooterLink href="#terms" style={{marginLeft: '8px'}}>서비스 이용약관</FooterLink> | 
           <FooterLink href="#business" style={{marginLeft: '8px'}}>사업자정보확인</FooterLink>
         </FooterBottom>
       </Footer>
     </Container>
   </>
 );
}

export default Landing;