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

const StatusSection = styled.div`
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border: 2px solid rgba(16, 185, 129, 0.1);
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.08);
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #065f46;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QRSection = styled.div`
  background: white;
  border: 2px solid rgba(16, 185, 129, 0.15);
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
`;

const QRLabel = styled.p`
  color: #065f46;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const QRImageWrapper = styled.div`
  background: #f8fafc;
  padding: 1rem;
  border-radius: 12px;
  display: inline-block;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  border: 1px solid rgba(16, 185, 129, 0.2);
`;

const QRImage = styled.img`
  width: 160px;
  height: 160px;
  border-radius: 8px;
`;

const QRDescription = styled.p`
  color: #059669;
  font-size: 0.75rem;
  line-height: 1.4;
  font-weight: 500;
`;

const EmptyQR = styled.div`
  text-align: center;
  padding: 2rem 1rem;
  background: white;
  border: 2px dashed rgba(16, 185, 129, 0.2);
  border-radius: 12px;
`;

const EmptyIcon = styled.div`
  width: 60px;
  height: 60px;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 1.5rem;
`;

const EmptyTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const EmptyDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
`;

const ProposalsSection = styled.div`
  background: linear-gradient(135deg, #fef7ff 0%, #f3e8ff 100%);
  border: 2px solid rgba(147, 51, 234, 0.1);
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(147, 51, 234, 0.08);
`;

const ProposalTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ProposalTab = styled.button`
  flex: 1;
  height: 40px;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${props => props.active ? `
    background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%);
    color: white;
    box-shadow: 0 2px 8px rgba(147, 51, 234, 0.3);
  ` : `
    background: white;
    color: #7c2d12;
    border: 1px solid rgba(147, 51, 234, 0.2);
    
    &:hover {
      background: #faf5ff;
      border-color: #9333ea;
    }
  `}
`;

const ProposalsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ProposalItem = styled.div`
  background: white;
  border: 2px solid rgba(147, 51, 234, 0.15);
  border-radius: 12px;
  padding: 1rem;
  text-align: left;
`;

const ProposalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
`;

const ProposalInfo = styled.div`
  flex: 1;
`;

const ProposalStore = styled.h4`
  font-size: 1rem;
  font-weight: 700;
  color: #581c87;
  margin-bottom: 0.25rem;
`;

const ProposalDate = styled.p`
  font-size: 0.75rem;
  color: #7c2d12;
  font-weight: 500;
`;

const ProposalStatus = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  
  ${props => {
    switch (props.status) {
      case 'pending':
        return `
          background: rgba(245, 158, 11, 0.15);
          color: #92400e;
        `;
      case 'accepted':
        return `
          background: rgba(16, 185, 129, 0.15);
          color: #065f46;
        `;
      case 'rejected':
        return `
          background: rgba(239, 68, 68, 0.15);
          color: #991b1b;
        `;
      default:
        return `
          background: rgba(107, 114, 128, 0.15);
          color: #374151;
        `;
    }
  }}
`;

const ProposalActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

const ActionButton = styled.button`
  flex: 1;
  height: 36px;
  border: none;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${props => props.variant === 'approve' ? `
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    box-shadow: 0 2px 6px rgba(16, 185, 129, 0.3);
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
    }
  ` : props.variant === 'reject' ? `
    background: white;
    color: #dc2626;
    border: 1.5px solid rgba(239, 68, 68, 0.3);
    
    &:hover {
      background: #fef2f2;
      border-color: #ef4444;
      transform: translateY(-1px);
    }
  ` : `
    background: white;
    color: #7c3aed;
    border: 1.5px solid rgba(147, 51, 234, 0.3);
    
    &:hover {
      background: #faf5ff;
      border-color: #9333ea;
      transform: translateY(-1px);
    }
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      transform: none;
    }
  }
`;

const EmptyProposals = styled.div`
  text-align: center;
  padding: 2rem 1rem;
  background: white;
  border: 2px dashed rgba(147, 51, 234, 0.2);
  border-radius: 12px;
`;

const StatsButton = styled.button`
  width: 100%;
  height: 52px;
  background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
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

const ProposalPage = () => {
  const navigate = useNavigate();
  const { apiCall } = useAuth();
  const [qrData, setQrData] = useState(null);
  const [proposals, setProposals] = useState({ sent: [], received: [] });
  const [activeTab, setActiveTab] = useState('received');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    try {
      // QR 이미지 가져오기
      try {
        const qrResponse = await apiCall({
          method: 'GET',
          url: '/partnerships/qr-image/',
        });

        if (qrResponse?.data) {
          setQrData(qrResponse.data);
        }
      } catch (err) {
        console.log('No QR data found');
      }

      // 제휴 제안 목록 가져오기
      try {
        const proposalsResponse = await apiCall({
          method: 'GET',
          url: '/partnerships/proposals/',
        });

        if (proposalsResponse?.data) {
          setProposals({
            sent: proposalsResponse.data.sent || [],
            received: proposalsResponse.data.received || []
          });
        }
      } catch (err) {
        console.log('No proposals found');
      }

    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProposalAction = async (proposalId, action) => {
    setActionLoading(proposalId);
    
    try {
      const response = await apiCall({
        method: 'POST',
        url: `/partnerships/action/${proposalId}/`,
        data: { action },
      });

      if (response?.success) {
        await fetchData();
      }
    } catch (err) {
      console.error('Failed to perform action:', err);
      alert('작업 처리에 실패했습니다.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelProposal = async () => {
    if (!window.confirm('정말로 제안을 취소하시겠습니까?')) {
      return;
    }

    setActionLoading('cancel');
    
    try {
      const response = await apiCall({
        method: 'POST',
        url: '/partnerships/propose-cancel/',
      });

      if (response?.success) {
        await fetchData();
      }
    } catch (err) {
      console.error('Failed to cancel proposal:', err);
      alert('제안 취소에 실패했습니다.');
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusText = (status) => {
    const statusMap = {
      'pending': '대기중',
      'accepted': '수락됨',
      'rejected': '거절됨',
    };
    return statusMap[status] || status;
  };

  const renderProposals = () => {
    const currentProposals = proposals[activeTab] || [];
    
    if (currentProposals.length === 0) {
      return (
        <EmptyProposals>
          <EmptyIcon>📝</EmptyIcon>
          <EmptyTitle>
            {activeTab === 'sent' ? '보낸 제안이 없습니다' : '받은 제안이 없습니다'}
          </EmptyTitle>
          <EmptyDescription>
            {activeTab === 'sent' 
              ? '제휴 게시글에서 다른 사장님들에게 제휴를 제안해보세요'
              : '아직 받은 제휴 제안이 없습니다'
            }
          </EmptyDescription>
        </EmptyProposals>
      );
    }

    return (
      <ProposalsList>
        {currentProposals.map((proposal) => (
          <ProposalItem key={proposal.id}>
            <ProposalHeader>
              <ProposalInfo>
                <ProposalStore>
                  {activeTab === 'sent' 
                    ? (proposal.recipient_store || '-')
                    : (proposal.proposer_store || '-')
                  }
                </ProposalStore>
                <ProposalDate>
                  {formatDate(proposal.created_at)}
                </ProposalDate>
              </ProposalInfo>
              <ProposalStatus status={proposal.status}>
                {getStatusText(proposal.status)}
              </ProposalStatus>
            </ProposalHeader>

            {activeTab === 'received' && proposal.status === 'pending' && (
              <ProposalActions>
                <ActionButton 
                  variant="approve"
                  onClick={() => handleProposalAction(proposal.id, 'approve')}
                  disabled={actionLoading === proposal.id}
                >
                  {actionLoading === proposal.id ? '처리중...' : '승낙'}
                </ActionButton>
                <ActionButton 
                  variant="reject"
                  onClick={() => handleProposalAction(proposal.id, 'reject')}
                  disabled={actionLoading === proposal.id}
                >
                  {actionLoading === proposal.id ? '처리중...' : '거절'}
                </ActionButton>
              </ProposalActions>
            )}

            {activeTab === 'sent' && proposal.status === 'pending' && (
              <ProposalActions>
                <ActionButton 
                  variant="cancel"
                  onClick={handleCancelProposal}
                  disabled={actionLoading === 'cancel'}
                >
                  {actionLoading === 'cancel' ? '취소중...' : '제안 취소'}
                </ActionButton>
              </ProposalActions>
            )}
          </ProposalItem>
        ))}
      </ProposalsList>
    );
  };

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
          <TabButton onClick={() => navigate('/owner/posts')}>
            <TabIcon>📋</TabIcon>
            <TabLabel>게시글</TabLabel>
          </TabButton>
          <TabButton active>
            <TabIcon>🤝</TabIcon>
            <TabLabel>제휴관리</TabLabel>
          </TabButton>
          <TabButton onClick={() => navigate('/owner/profile')}>
            <TabIcon>👤</TabIcon>
            <TabLabel>마이페이지</TabLabel>
          </TabButton>
        </NavigationTabs>

        <StatusSection>
          <SectionTitle>📱 제휴 상태</SectionTitle>
          {qrData ? (
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
          ) : (
            <EmptyQR>
              <EmptyIcon>🤝</EmptyIcon>
              <EmptyTitle>제휴 준비중</EmptyTitle>
              <EmptyDescription>
                제휴를 맺으면 QR 코드가 생성됩니다<br />
                게시글에서 제휴 파트너를 찾아보세요
              </EmptyDescription>
            </EmptyQR>
          )}
        </StatusSection>

        {qrData && (
          <StatsButton onClick={() => navigate('/owner/stats')}>
            <span>📊</span>
            제휴 통계 보기
          </StatsButton>
        )}

        <ProposalsSection>
          <SectionTitle>📋 제휴 제안 목록</SectionTitle>
          <ProposalTabs>
            <ProposalTab 
              active={activeTab === 'received'}
              onClick={() => setActiveTab('received')}
            >
              받은 제안 ({proposals.received?.length || 0})
            </ProposalTab>
            <ProposalTab 
              active={activeTab === 'sent'}
              onClick={() => setActiveTab('sent')}
            >
              보낸 제안 ({proposals.sent?.length || 0})
            </ProposalTab>
          </ProposalTabs>
          {renderProposals()}
        </ProposalsSection>

        <Footer>
          네이비즈 소상공인 제휴 플랫폼
        </Footer>
      </ContentWrapper>
    </Container>
  );
};

export default ProposalPage;