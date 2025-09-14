import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
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
  justify-content: flex-start;
  
  @media (min-width: 391px) {
    border-radius: 16px;
    min-height: 844px;
    max-height: 90vh;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(226, 232, 240, 0.8);
    overflow-y: auto;
  }
`;

const LogoSection = styled.div`
  margin-bottom: 2rem;
`;

const Logo = styled.h1`
  font-size: 2rem;
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

const NavigationTabs = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const TabButton = styled.button`
  flex: 1;
  height: 48px;
  border: none;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  ${props => props.active ? `
    background: linear-gradient(135deg, #10b981 0%, #0ea5e9 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    cursor: default;
  ` : `
    background: rgba(255, 255, 255, 0.9);
    color: #374151;
    border: 1px solid #e5e7eb;
    
    &:hover {
      background: white;
      border-color: #d1d5db;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  `}
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(226, 232, 240, 0.6);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
`;

const ProfileSection = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
`;

const ProfileIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #10b981 0%, #0ea5e9 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
`;

const ProfileTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const UserInfoBox = styled.div`
  background: rgba(248, 250, 252, 0.8);
  border-radius: 12px;
  padding: 1rem;
  text-align: left;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.span`
  color: #6b7280;
  font-size: 0.875rem;
  flex: 1;
`;

const InfoValue = styled.span`
  color: #374151;
  font-size: 0.875rem;
  font-weight: 600;
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1rem;
  
  ${props => {
    switch (props.status) {
      case 'active':
        return `
          background: rgba(16, 185, 129, 0.1);
          color: #065f46;
        `;
      case 'pending':
        return `
          background: rgba(251, 191, 36, 0.1);
          color: #92400e;
        `;
      default:
        return `
          background: rgba(107, 114, 128, 0.1);
          color: #374151;
        `;
    }
  }}
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  
  ${props => {
    switch (props.status) {
      case 'active':
        return 'background: #10b981;';
      case 'pending':
        return 'background: #fbbf24; animation: pulse 2s infinite;';
      default:
        return 'background: #6b7280;';
    }
  }}
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const StoreName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const StatusText = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1rem;
`;

const QRSection = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
`;

const QRLabel = styled.p`
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const QRImageWrapper = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 12px;
  display: inline-block;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
`;

const QRImage = styled.img`
  width: 160px;
  height: 160px;
  border-radius: 8px;
`;

const QRDescription = styled.p`
  color: #6b7280;
  font-size: 0.75rem;
  line-height: 1.4;
`;

const EmptyStateIcon = styled.div`
  width: 60px;
  height: 60px;
  background: ${props => {
    switch (props.type) {
      case 'error':
        return '#f3f4f6';
      case 'pending':
        return 'rgba(251, 191, 36, 0.1)';
      default:
        return '#f3f4f6';
    }
  }};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 1.5rem;
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const EmptyStateDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #10b981 0%, #0ea5e9 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const CouponPolicyBox = styled.div`
  background: rgba(248, 250, 252, 0.8);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  text-align: left;
`;

const PolicyLabel = styled.p`
  color: #374151;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const PolicyValue = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const StatsButton = styled.button`
  width: 100%;
  height: 48px;
  background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const EditPolicyButton = styled.button`
  width: 100%;
  height: 48px;
  background: rgba(255, 255, 255, 0.9);
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;

  &:hover {
    background: white;
    border-color: #d1d5db;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const LogoutButton = styled.button`
  width: 100%;
  height: 52px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  margin-bottom: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 3rem 1rem;
`;

const LoadingSpinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid rgba(16, 185, 129, 0.2);
  border-top: 3px solid #10b981;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
`;

const Footer = styled.div`
  text-align: center;
  margin-top: auto;
  padding-top: 2rem;
  color: #9ca3af;
  font-size: 0.75rem;
`;

const OwnerMyPage = () => {
  const navigate = useNavigate();
  const { user, logout, apiCall } = useAuth();
  const [ownerProfile, setOwnerProfile] = useState(null);
  const [couponPolicy, setCouponPolicy] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      
      try {
        // 1. 사장님 프로필 정보 가져오기
        const profileResponse = await apiCall({
          method: 'GET',
          url: '/accounts/owner-profile/',
        });

        if (profileResponse?.data) {
          setOwnerProfile(profileResponse.data);
        }

        // 2. 쿠폰 정책 가져오기 (있을 때만)
        try {
          const policyResponse = await apiCall({
            method: 'GET',
            url: '/coupons/policy/',
          });

          if (policyResponse?.data) {
            setCouponPolicy(policyResponse.data);
          }
        } catch (err) {
          // 쿠폰 정책이 없을 수 있으므로 에러 무시
          console.log('No coupon policy found');
        }

        // 3. QR 이미지 가져오기 (제휴가 있을 때만)
        try {
          const qrResponse = await apiCall({
            method: 'GET',
            url: '/partnerships/qr-image/',
          });

          if (qrResponse?.data) {
            setQrData(qrResponse.data);
          }
        } catch (err) {
          // QR이 없을 수 있으므로 에러 무시
          console.log('No QR data found');
        }

      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiCall]);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  const formatPrice = (price) => {
    if (!price) return '-';
    return price.toLocaleString('ko-KR');
  };

  const formatDuration = (duration) => {
    const durationMap = {
      'day': '1일',
      'week': '1주일',
      '1_month': '1개월',
      '3_months': '3개월',
      '6_months': '6개월',
      'unlimited': '무기한',
    };
    return durationMap[duration] || duration;
  };

  const getCategoryIcon = (category) => {
    const categoryIcons = {
      cafe: '☕',
      restaurant: '🍽️',
      bakery: '🥐',
      pub: '🍺',
      fitness: '💪',
      study: '📚',
      florist: '🌸',
      convenience: '🏪',
      entertain: '🎵',
      other: '🛍️'
    };
    return categoryIcons[category] || '🏪';
  };

  const getCategoryName = (category) => {
    const categoryNames = {
      cafe: '카페',
      restaurant: '음식점',
      bakery: '베이커리',
      pub: '주점',
      fitness: '운동',
      study: '독서실',
      florist: '꽃집',
      convenience: '편의점',
      entertain: '유흥시설',
      other: '기타'
    };
    return categoryNames[category] || category;
  };

  const renderContent = () => {
    if (!ownerProfile) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <EmptyStateIcon type="error">❌</EmptyStateIcon>
          <EmptyStateTitle>정보 로드 실패</EmptyStateTitle>
          <EmptyStateDescription>프로필 정보를 불러올 수 없습니다.</EmptyStateDescription>
        </div>
      );
    }

    // QR이 있으면 제휴 활성화 상태
    if (qrData) {
      return (
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <StatusBadge status="active">
              <StatusDot status="active" />
              제휴 활성화
            </StatusBadge>
            <StoreName>
              {getCategoryIcon(ownerProfile.store?.category)} {ownerProfile.store?.name}
            </StoreName>
            <StatusText>제휴가 활성화되었습니다</StatusText>
          </div>

          <QRSection>
            <QRLabel>고객용 QR 코드</QRLabel>
            <QRImageWrapper>
              <QRImage
                src={qrData.qr_code_url}
                alt="QR 코드"
              />
            </QRImageWrapper>
            <QRDescription>
              고객이 QR 코드를 스캔하면 제휴 쿠폰을 발급받습니다
            </QRDescription>
          </QRSection>
        </div>
      );
    }

    // 쿠폰 정책이 있으면 정책 표시
    if (couponPolicy) {
      return (
        <div style={{ textAlign: 'center' }}>
          <StatusBadge status="pending">
            <StatusDot status="pending" />
            쿠폰 정책 설정 완료
          </StatusBadge>
          <StoreName>
            {getCategoryIcon(ownerProfile.store?.category)} {ownerProfile.store?.name}
          </StoreName>
          <StatusText>제휴 게시글에서 다른 사장님들과 제휴해보세요</StatusText>
          
          <CouponPolicyBox>
            <PolicyLabel>🎫 설정된 쿠폰 정책</PolicyLabel>
            <PolicyValue><strong>설명:</strong> {couponPolicy.description}</PolicyValue>
            <PolicyValue><strong>예상 가치:</strong> {formatPrice(couponPolicy.expected_value)}원</PolicyValue>
            <PolicyValue><strong>월 한도:</strong> {couponPolicy.monthly_limit}매</PolicyValue>
            <PolicyValue><strong>유효 기간:</strong> {formatDuration(couponPolicy.expected_duration)}</PolicyValue>
          </CouponPolicyBox>
        </div>
      );
    }

    // 쿠폰 정책이 없으면 설정 유도
    return (
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <EmptyStateIcon>🤔</EmptyStateIcon>
        <EmptyStateTitle>제휴 대기중</EmptyStateTitle>
        <EmptyStateDescription>
          {ownerProfile.store?.name}<br />
          먼저 쿠폰 정책을 설정해보세요.
        </EmptyStateDescription>
        <ActionButton onClick={() => navigate('/owner/coupon-setup')}>
          <span>🎫</span>
          쿠폰 정책 설정하기
        </ActionButton>
      </div>
    );
  };

  if (!user) {
    return (
      <Container>
        <ContentWrapper>
          <LoadingContainer>
            <EmptyStateIcon type="error">🔐</EmptyStateIcon>
            <LoadingText>로그인이 필요합니다.</LoadingText>
          </LoadingContainer>
        </ContentWrapper>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container>
        <ContentWrapper>
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingText>불러오는 중...</LoadingText>
          </LoadingContainer>
        </ContentWrapper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ContentWrapper>
          <LoadingContainer>
            <EmptyStateIcon type="error">❌</EmptyStateIcon>
            <LoadingText>{error}</LoadingText>
          </LoadingContainer>
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
        </LogoSection>

        <NavigationTabs>
          <TabButton active>
            <span>👤</span>
            마이페이지
          </TabButton>
          <TabButton onClick={() => navigate('/owner/posts')}>
            <span>📋</span>
            제휴 게시글
          </TabButton>
        </NavigationTabs>

        <Card>
          <ProfileSection>
            <ProfileIcon>
              <span style={{ fontSize: '1.5rem', color: 'white' }}>👤</span>
            </ProfileIcon>
            <ProfileTitle>{ownerProfile?.owner?.name || '사장님'}</ProfileTitle>
          </ProfileSection>

          <UserInfoBox>
            <InfoRow>
              <InfoLabel>📱 전화번호</InfoLabel>
              <InfoValue>{ownerProfile?.owner?.phone || '-'}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>🏪 가게명</InfoLabel>
              <InfoValue>{ownerProfile?.store?.name || '-'}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>📍 주소</InfoLabel>
              <InfoValue>{ownerProfile?.store?.address || '-'}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>🏷️ 카테고리</InfoLabel>
              <InfoValue>{getCategoryName(ownerProfile?.store?.category) || '-'}</InfoValue>
            </InfoRow>
          </UserInfoBox>
        </Card>

        <Card>
          {renderContent()}
        </Card>

        {/* 액션 버튼들 */}
        {qrData && (
          <StatsButton onClick={() => navigate('/owner/stats')}>
            <span>📊</span>
            통계 보기
          </StatsButton>
        )}

        {couponPolicy && (
          <EditPolicyButton onClick={() => navigate('/owner/coupon-setup')}>
            <span>⚙️</span>
            쿠폰 정책 수정
          </EditPolicyButton>
        )}

        <LogoutButton onClick={handleLogout}>
          로그아웃
        </LogoutButton>

        <Footer>
          네이비즈 소상공인 제휴 플랫폼
        </Footer>
      </ContentWrapper>
    </Container>
  );
};

export default OwnerMyPage;