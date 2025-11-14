import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%);
  display: flex;
  align-items: flex-start;
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
  gap: 0.5rem;
  margin-bottom: 2rem;
  padding: 0.5rem;
  background: rgba(248, 250, 252, 0.8);
  border-radius: 16px;
  border: 1px solid rgba(226, 232, 240, 0.6);
`;

const TabButton = styled.button`
  flex: 1;
  height: 48px;
  border: none;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  
  ${props => props.active ? `
    background: linear-gradient(135deg, #10b981 0%, #0ea5e9 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    cursor: default;
  ` : `
    background: white;
    color: #374151;
    border: 1px solid rgba(226, 232, 240, 0.8);
    
    &:hover {
      background: #f9fafb;
      border-color: #d1d5db;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  `}
`;

const TabIcon = styled.span`
  font-size: 1rem;
`;

const TabLabel = styled.span`
  font-size: 0.7rem;
`;

const ProfileSection = styled.div`
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 2px solid rgba(59, 130, 246, 0.1);
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.08);
`;

const EditProfileButton = styled.button`
  width: 100%;
  height: 44px;
  background: white;
  color: #1d4ed8;
  border: 2px solid rgba(59, 130, 246, 0.3);
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;

  &:hover {
    background: #eff6ff;
    border-color: #3b82f6;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e40af;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ProfileIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
`;

const ProfileTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e3a8a;
  margin-bottom: 1rem;
`;

const UserInfoBox = styled.div`
  background: white;
  border: 2px solid rgba(59, 130, 246, 0.15);
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
  color: #4338ca;
  font-size: 0.875rem;
  flex: 1;
  font-weight: 600;
`;

const InfoValue = styled.span`
  color: #1e3a8a;
  font-size: 0.875rem;
  font-weight: 600;
`;

const CouponSection = styled.div`
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border: 2px solid rgba(16, 185, 129, 0.1);
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.08);
`;

const CouponPolicyBox = styled.div`
  background: white;
  border: 2px solid rgba(16, 185, 129, 0.15);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  text-align: left;
`;

const PolicyLabel = styled.p`
  color: #065f46;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const PolicyValue = styled.p`
  color: #047857;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
  font-weight: 500;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem 1rem;
  background: white;
  border: 2px dashed rgba(16, 185, 129, 0.2);
  border-radius: 12px;
`;

const EmptyStateIcon = styled.div`
  width: 60px;
  height: 60px;
  background: #f3f4f6;
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
  width: 100%;
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

const EditPolicyButton = styled.button`
  width: 100%;
  height: 48px;
  background: white;
  color: #d97706;
  border: 2px solid rgba(245, 158, 11, 0.3);
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: #fffbeb;
    border-color: #f59e0b;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
  }
`;

const ButtonSection = styled.div`
  background: linear-gradient(135deg, #fef7ff 0%, #f3e8ff 100%);
  border: 2px solid rgba(147, 51, 234, 0.1);
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(147, 51, 234, 0.08);
`;

const SettingsButton = styled.button`
  width: 100%;
  height: 48px;
  background: white;
  color: #7c3aed;
  border: 2px solid rgba(139, 92, 246, 0.3);
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;

  &:hover {
    background: #faf5ff;
    border-color: #8b5cf6;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DangerButton = styled.button`
  width: 100%;
  height: 48px;
  background: white;
  color: #dc2626;
  border: 2px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: #fef2f2;
    border-color: #ef4444;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
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
  padding-top: 1rem;
  color: #9ca3af;
  font-size: 0.75rem;
`;

const OwnerProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, apiCall } = useAuth();
  const [ownerProfile, setOwnerProfile] = useState(null);
  const [couponPolicy, setCouponPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      
      try {
        const profileResponse = await apiCall({
          method: 'GET',
          url: '/accounts/owner-profile/',
        });

        if (profileResponse?.data) {
          setOwnerProfile(profileResponse.data);
        }

        try {
          const policyResponse = await apiCall({
            method: 'GET',
            url: '/coupons/policy/',
          });

          if (policyResponse?.data) {
            setCouponPolicy(policyResponse.data);
          }
        } catch (err) {
          console.log('No coupon policy found');
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

  const handleChangePassword = () => {
    alert('비밀번호 변경 기능은 준비중입니다.');
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm('정말로 회원탈퇴 하시겠습니까?');
    if (confirmed) {
      alert('회원탈퇴 기능은 준비중입니다.');
    }
  };

  if (!user) {
    return (
      <Container>
        <ContentWrapper>
          <LoadingContainer>
            <EmptyStateIcon>🔐</EmptyStateIcon>
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
            <EmptyStateIcon>❌</EmptyStateIcon>
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
          <TabButton onClick={() => navigate('/owner/posts')}>
            <TabIcon>📋</TabIcon>
            <TabLabel>게시글</TabLabel>
          </TabButton>
          <TabButton onClick={() => navigate('/owner/proposals')}>
            <TabIcon>🤝</TabIcon>
            <TabLabel>제휴관리</TabLabel>
          </TabButton>
          <TabButton active>
            <TabIcon>👤</TabIcon>
            <TabLabel>마이페이지</TabLabel>
          </TabButton>
        </NavigationTabs>

        <ProfileSection>
          <SectionTitle>👤 내 정보</SectionTitle>
          <ProfileIcon>
            <span style={{ fontSize: '1.5rem', color: 'white' }}>👤</span>
          </ProfileIcon>
          <ProfileTitle>{ownerProfile?.owner?.name || '사장님'}</ProfileTitle>

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
          
          <EditProfileButton onClick={() => navigate('/owner/profile/edit')}>
            <span>✏️</span>
            정보 수정하기
          </EditProfileButton>
        </ProfileSection>

        <CouponSection>
          <SectionTitle>🎫 쿠폰 정책</SectionTitle>
          {couponPolicy ? (
            <>
              <CouponPolicyBox>
                <PolicyLabel>설명</PolicyLabel>
                <PolicyValue>{couponPolicy.description}</PolicyValue>
                <PolicyLabel>예상 가치</PolicyLabel>
                <PolicyValue>{formatPrice(couponPolicy.expected_value)}원</PolicyValue>
                <PolicyLabel>월 한도</PolicyLabel>
                <PolicyValue>{couponPolicy.monthly_limit}매</PolicyValue>
                <PolicyLabel>유효 기간</PolicyLabel>
                <PolicyValue>{formatDuration(couponPolicy.expected_duration)}</PolicyValue>
              </CouponPolicyBox>
              <EditPolicyButton onClick={() => navigate('/owner/coupons/edit')}>
                <span>⚙️</span>
                쿠폰 정책 수정
              </EditPolicyButton>
            </>
          ) : (
            <EmptyState>
              <EmptyStateIcon>🎫</EmptyStateIcon>
              <EmptyStateTitle>쿠폰 정책 미설정</EmptyStateTitle>
              <EmptyStateDescription>
                먼저 쿠폰 정책을 설정해보세요
              </EmptyStateDescription>
              <ActionButton onClick={() => navigate('/owner/coupons')}>
                <span>🎫</span>
                쿠폰 정책 설정하기
              </ActionButton>
            </EmptyState>
          )}
        </CouponSection>

        <ButtonSection>
          <SectionTitle>⚙️ 설정</SectionTitle>
          <SettingsButton onClick={handleChangePassword}>
            <span>🔑</span>
            비밀번호 변경
          </SettingsButton>
          <DangerButton onClick={handleDeleteAccount}>
            <span>⚠️</span>
            회원탈퇴
          </DangerButton>
        </ButtonSection>

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

export default OwnerProfilePage;