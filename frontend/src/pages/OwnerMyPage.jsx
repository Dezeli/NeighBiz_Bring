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
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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

const MerchantName = styled.h3`
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

const ProposalSection = styled.div`
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ProposalTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-align: left;
`;

const ProposalItem = styled.div`
  background: rgba(248, 250, 252, 0.8);
  border: 1px solid rgba(226, 232, 240, 0.6);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: white;
    border-color: rgba(16, 185, 129, 0.3);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const ProposalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const ProposalInfo = styled.div`
  flex: 1;
  text-align: left;
`;

const ProposalName = styled.h5`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
`;

const ProposalMeta = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
`;

const ProposalStatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  
  ${props => {
    switch (props.status) {
      case 'pending':
        return `
          background: rgba(251, 191, 36, 0.1);
          color: #92400e;
        `;
      case 'accepted':
        return `
          background: rgba(16, 185, 129, 0.1);
          color: #065f46;
        `;
      case 'rejected':
        return `
          background: rgba(239, 68, 68, 0.1);
          color: #991b1b;
        `;
      default:
        return `
          background: rgba(107, 114, 128, 0.1);
          color: #374151;
        `;
    }
  }}
`;

const ProposalStatusDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  
  ${props => {
    switch (props.status) {
      case 'pending':
        return 'background: #fbbf24;';
      case 'accepted':
        return 'background: #10b981;';
      case 'rejected':
        return 'background: #ef4444;';
      default:
        return 'background: #6b7280;';
    }
  }}
`;

const EmptyProposalState = styled.div`
  text-align: center;
  padding: 2rem 0;
  color: #6b7280;
`;

const EmptyProposalText = styled.p`
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

const EmptyProposalSubtext = styled.p`
  font-size: 0.75rem;
  margin: 0;
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
  const [partnership, setPartnership] = useState(null);
  const [partnershipStatus, setPartnershipStatus] = useState(null);
  const [sentProposals, setSentProposals] = useState([]);
  const [receivedProposals, setReceivedProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requests = [
          apiCall({ method: 'GET', url: '/merchants/mypage' }),
          apiCall({ method: 'GET', url: '/owner/partnership/status-check/' })
        ];

        const [partnershipResponse, statusResponse] = await Promise.all(requests);
        
        setPartnership(partnershipResponse.data || null);
        setPartnershipStatus(statusResponse.data || null);

        // 쿠폰 정책이 있고 파트너십이 없을 때만 제안 데이터 가져오기
        if (statusResponse.data?.has_coupon_policy && !statusResponse.data?.has_active_partnership) {
          const proposalRequests = [
            apiCall({ method: 'GET', url: '/proposals/sent/' }),
            apiCall({ method: 'GET', url: '/proposals/received/' })
          ];

          const [sentResponse, receivedResponse] = await Promise.all(proposalRequests);
          setSentProposals(sentResponse.data || []);
          setReceivedProposals(receivedResponse.data || []);
        }
      } catch (err) {
        setPartnership(null);
        setPartnershipStatus(null);
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

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return '대기중';
      case 'accepted': return '승인됨';
      case 'rejected': return '거절됨';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
    });
  };

  const formatPrice = (price) => {
    return price.toLocaleString('ko-KR');
  };

  const canEditPolicy = () => {
    return partnershipStatus && 
           partnershipStatus.has_coupon_policy &&
           !partnershipStatus.has_received_proposal &&
           !partnershipStatus.has_sent_proposal &&
           !partnershipStatus.has_active_partnership;
  };

  const canShowStats = () => {
    return partnership && partnership.partnership_status === 'active';
  };

  const renderPartnershipContent = () => {
    if (!partnership) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <EmptyStateIcon type="error">❌</EmptyStateIcon>
          <EmptyStateTitle>정보 로드 실패</EmptyStateTitle>
          <EmptyStateDescription>가게 정보를 불러올 수 없습니다.</EmptyStateDescription>
        </div>
      );
    }

    switch (partnership.partnership_status) {
      case 'active':
        return (
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <StatusBadge status="active">
                <StatusDot status="active" />
                제휴 활성화
              </StatusBadge>
              <MerchantName>🏪 {partnership.merchant_name}</MerchantName>
              <StatusText>제휴가 활성화되었습니다</StatusText>
            </div>

            {partnership.qr_image_url && (
              <QRSection>
                <QRLabel>고객용 QR 코드</QRLabel>
                <QRImageWrapper>
                  <QRImage
                    src={partnership.qr_image_url}
                    alt="QR 코드"
                  />
                </QRImageWrapper>
                <QRDescription>
                  고객이 QR 코드를 스캔하면 제휴 쿠폰을 발급받습니다
                </QRDescription>
              </QRSection>
            )}
          </div>
        );

      case 'pending':
        return (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <EmptyStateIcon type="pending">⏳</EmptyStateIcon>
            <EmptyStateTitle>제휴 심사중</EmptyStateTitle>
            <EmptyStateDescription>
              {partnership.merchant_name}의 제휴 승인을 기다리고 있습니다.<br />
              관리자 승인 후 QR 코드가 생성됩니다.
            </EmptyStateDescription>
            <StatusBadge status="pending">
              <StatusDot status="pending" />
              승인 대기중
            </StatusBadge>
          </div>
        );

      case 'none':
      default:
        return (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <EmptyStateIcon>🤔</EmptyStateIcon>
            <EmptyStateTitle>제휴 대기중</EmptyStateTitle>
            <EmptyStateDescription>
              {partnership.merchant_name}<br />
              먼저 쿠폰 정책을 설정해보세요.
            </EmptyStateDescription>
            <ActionButton onClick={() => window.location.href = '/owner/coupon-setup'}>
              <span>🎫</span>
              쿠폰 정책 설정하기
            </ActionButton>
          </div>
        );
    }
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
            <ProfileTitle>사장님 마이페이지</ProfileTitle>
          </ProfileSection>

          <UserInfoBox>
            <InfoRow>
              <InfoLabel>📱 전화번호</InfoLabel>
              <InfoValue>{user.phone_number}</InfoValue>
            </InfoRow>
          </UserInfoBox>
        </Card>

        <Card>
          {renderPartnershipContent()}
        </Card>

        {/* 제안 관리 섹션 */}
        {partnershipStatus?.has_coupon_policy && !partnershipStatus?.has_active_partnership && (
          <Card>
            {sentProposals.length > 0 && (
              <ProposalSection>
                <ProposalTitle>
                  <span>📤</span>
                  보낸 제안 ({sentProposals.length})
                </ProposalTitle>
                {sentProposals.slice(0, 2).map((proposal) => (
                  <ProposalItem 
                    key={proposal.proposal_id}
                    onClick={() => navigate(`/owner/proposal/received/${proposal.proposal_id}`)}
                  >
                    <ProposalHeader>
                      <ProposalInfo>
                        <ProposalName>{proposal.target_merchant.name}</ProposalName>
                        <ProposalMeta>
                          {formatPrice(proposal.target_post.expected_value)}원 • {formatDate(proposal.created_at)}
                        </ProposalMeta>
                      </ProposalInfo>
                      <ProposalStatusBadge status={proposal.status}>
                        <ProposalStatusDot status={proposal.status} />
                        {getStatusText(proposal.status)}
                      </ProposalStatusBadge>
                    </ProposalHeader>
                  </ProposalItem>
                ))}
              </ProposalSection>
            )}

            {receivedProposals.length > 0 && (
              <ProposalSection>
                <ProposalTitle>
                  <span>📥</span>
                  받은 제안 ({receivedProposals.length})
                </ProposalTitle>
                {receivedProposals.slice(0, 2).map((proposal) => (
                  <ProposalItem 
                    key={proposal.proposal_id}
                    onClick={() => navigate(`/owner/proposal/received/${proposal.proposal_id}`)}
                  >
                    <ProposalHeader>
                      <ProposalInfo>
                        <ProposalName>{proposal.proposer_merchant.name}</ProposalName>
                        <ProposalMeta>
                          {formatPrice(proposal.post.expected_value)}원 • {formatDate(proposal.created_at)}
                        </ProposalMeta>
                      </ProposalInfo>
                      <ProposalStatusBadge status={proposal.status}>
                        <ProposalStatusDot status={proposal.status} />
                        {getStatusText(proposal.status)}
                      </ProposalStatusBadge>
                    </ProposalHeader>
                  </ProposalItem>
                ))}
              </ProposalSection>
            )}

            {sentProposals.length === 0 && receivedProposals.length === 0 && (
              <EmptyProposalState>
                <EmptyProposalText>아직 제안이 없습니다</EmptyProposalText>
                <EmptyProposalSubtext>
                  게시글 목록에서 제휴를 신청해보세요
                </EmptyProposalSubtext>
              </EmptyProposalState>
            )}
          </Card>
        )}

        {/* 액션 버튼들 */}
        {canShowStats() && (
          <StatsButton onClick={() => navigate('/owner/stats')}>
            <span>📊</span>
            통계 보기
          </StatsButton>
        )}

        {canEditPolicy() && (
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