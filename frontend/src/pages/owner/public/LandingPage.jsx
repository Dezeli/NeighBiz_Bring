import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Container = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
  display: 'flex-start',
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: '2rem',
  padding: 0,
};

const ContentWrapper = {
  width: '100vw',
  maxWidth: '390px',
  minHeight: 'auto',
  background: 'white',
  display: 'flex',
  flexDirection: 'column',
};

// Hero Section
const HeroSection = {
  background: 'linear-gradient(135deg, #4CE6D1 0%, #A0F6D2 100%)',
  padding: '3rem 1.5rem 2rem',
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
};

const Logo = {
  fontSize: '2.5rem',
  fontWeight: 800,
  marginBottom: '2.0rem',
  letterSpacing: '-0.02em',
  color: '#1f2937',
  position: 'relative',
  zIndex: 1,
};


// Main Content
const MainContent = {
  flex: 1,
  padding: '2rem 1.5rem',
};

const ValueProposition = {
  textAlign: 'center',
  marginBottom: '2.5rem',
};

const MainHeadline = {
  fontSize: '1.4rem',
  fontWeight: 700,
  color: '#1f2937',
  lineHeight: 1.4,
  marginBottom: '1rem',
};

const SubHeadline = {
  color: '#6b7280',
  fontSize: '1rem',
  lineHeight: 1.6,
  fontWeight: 500,
};

// Features Section
const FeaturesSection = {
  border: '3px solid rgba(76, 230, 209, 0.5)',
  boxShadow: '0 4px 12px rgba(76, 230, 209, 0.3)',
  marginBottom: '2rem',
};

const FeatureSlider = {
  position: 'relative',
  overflow: 'hidden',
  height: '200px',
  borderRadius: '12px',
  marginBottom: '2rem',
};

const FeatureTrack = {
  display: 'flex',
  height: '100%',
  transition: 'transform 0.5s ease-in-out',
};

const FeatureSlide = {
  minWidth: '85.5%',
  padding: '1.5rem',
  background: 'rgba(255, 255, 255, 0.95)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  textAlign: 'left',
};

const FeatureIcon = {
  width: '48px',
  height: '48px',
  borderRadius: '12px',
  background: 'linear-gradient(135deg, #4CE6D1 0%, #A0F6D2 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '1rem',
};

const FeatureTitle = {
  fontSize: '1rem',
  fontWeight: 700,
  color: '#1f2937',
  marginBottom: '0.5rem',
};

const FeatureDescription = {
  fontSize: '0.9rem',
  color: '#6b7280',
  lineHeight: 1.5,
  fontWeight: 500,
};

// CTA Section
const CTASection = {
  padding: '1.5rem',
  background: 'white',
  borderTop: '1px solid #f3f4f6',
};

const ButtonGroup = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
};

const PrimaryButton = {
  width: '100%',
  height: '56px',
  background: '#1f2937',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  fontSize: '1.1rem',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 12px rgba(31, 41, 55, 0.3)',
};

const SecondaryButton = {
  width: '100%',
  height: '56px',
  background: 'white',
  color: '#374151',
  border: '2px solid #e5e7eb',
  borderRadius: '12px',
  fontSize: '1.1rem',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};

const OwnerLandingPage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const features = [
    {
      title: "원클릭 제휴 시스템",
      description: "QR 코드 스캔만으로 즉시 제휴 참여\n복잡한 계약서나 협상 과정 불필요"
    },
    {
      title: "스마트 매칭",
      description: "업종과 위치를 고려한 최적의\n제휴 파트너 자동 추천 시스템"
    },
    {
      title: "실시간 성과 분석",
      description: "제휴 효과와 고객 유입 현황을\n한눈에 확인할 수 있는 대시보드"
    },
    {
      title: "고객 확장 효과",
      description: "제휴 가게 고객들의 자연스러운\n교차 방문으로 신규 고객 확보"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    }, 1000);

    return () => clearInterval(timer);
  }, [features.length]);
  
  const handleLogin = () => {
    navigate('/login');
    console.log('로그인 페이지로 이동');
  };
  
  const handleSignup = () => {
    navigate('/signup');
    console.log('회원가입 페이지로 이동');
  };


  return (
    <div style={Container}>
      <div style={ContentWrapper}>
        {/* Hero Section */}
        <div style={HeroSection}>
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'url(/images/business-network-pattern.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.1,
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <img 
              src="/images/logo.png" 
              alt="NeighBiz Logo" 
              style={{
                width: '60px',
                height: '60px',
                position: 'relative',
                zIndex: 1,
              }}
            />
            <h1 style={Logo}>
              <span>Neigh</span>
              <span>Biz</span>
            </h1>
          </div>
        </div>

        <div style={MainContent}>
          {/* Value Proposition */}
          <div style={ValueProposition}>
            <h2 style={MainHeadline}>
              제휴로 시작하는<br />
              매출 성장의 새로운 기회
            </h2>
            <p style={SubHeadline}>
              복잡한 제휴 과정을 간소화하고<br />
              실질적인 비즈니스 성과를 만들어보세요
            </p>
          </div>

          {/* Features */}
          <div style={FeaturesSection}>
            <div style={FeatureSlider}>
              <div 
                style={{
                  ...FeatureTrack,
                  transform: `translateX(-${currentSlide * 100}%)`
                }}
              >
                {features.map((feature, index) => (
                  <div key={index} style={FeatureSlide}>
                    <div style={FeatureIcon}>
                      <img 
                        src="/images/example.png" 
                        alt={feature.title} 
                        style={{
                          width: '24px',
                          height: '24px',
                          filter: 'brightness(0) saturate(100%) invert(15%) sepia(7%) saturate(1309%) hue-rotate(169deg) brightness(94%) contrast(87%)',
                        }}
                      />
                    </div>
                    <h3 style={FeatureTitle}>{feature.title}</h3>
                    <p style={FeatureDescription}>
                      {feature.description.split('\n').map((line, i) => (
                        <span key={i}>
                          {line}
                          {i < feature.description.split('\n').length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div style={CTASection}>
          <div style={ButtonGroup}>
            <button 
              style={PrimaryButton}
              onClick={handleLogin}
              onMouseEnter={(e) => {
                e.target.style.background = '#374151';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 20px rgba(31, 41, 55, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#1f2937';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(31, 41, 55, 0.3)';
              }}
            >
              비즈니스 시작하기
            </button>
            <button 
              style={SecondaryButton}
              onClick={handleSignup}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#4CE6D1';
                e.target.style.color = '#1f2937';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(76, 230, 209, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.color = '#374151';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 0 0 transparent';
              }}
            >
              파트너 등록하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerLandingPage;