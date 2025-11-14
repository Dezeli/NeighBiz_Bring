import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

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

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.25rem;

  &:hover {
    background: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const Logo = styled.h1`
  font-size: 1.75rem;
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

const PageTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: #374151;
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

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  
  ${props => {
    switch (props.status) {
      case 'pending':
        return 'background: #fbbf24; animation: pulse 2s infinite;';
      case 'accepted':
        return 'background: #10b981;';
      case 'rejected':
        return 'background: #ef4444;';
      default:
        return 'background: #6b7280;';
    }
  }}
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const ProposerSection = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ProposerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(248, 250, 252, 0.8);
  border-radius: 12px;
  padding: 1rem;
`;

const ProposerAvatar = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const ProposerDetails = styled.div`
  flex: 1;
`;

const ProposerName = styled.h4`
  font-size: 1.125rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 0.25rem;
`;

const ProposerCategory = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
`;

const ProposerAddress = styled.p`
  font-size: 0.75rem;
  color: #9ca3af;
`;

const ProposerImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 12px;
  margin-top: 1rem;
`;

const PostInfo = styled.div`
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const PostTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #1e40af;
  margin-bottom: 0.5rem;
`;

const PostValue = styled.p`
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e3a8a;
`;

const CouponPolicySection = styled.div`
  margin-bottom: 2rem;
`;

const PolicyGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const PolicyBox = styled.div`
  background: rgba(16, 185, 129, 0.1);
  border-radius: 12px;
  padding: 0.75rem;
  text-align: center;
`;

const PolicyLabel = styled.p`
  font-size: 0.75rem;
  font-weight: 600;
  color: #065f46;
  margin-bottom: 0.25rem;
`;

const PolicyValue = styled.p`
  font-size: 1rem;
  font-weight: 700;
  color: #047857;
`;

const PolicyDescription = styled.div`
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const PolicyDescTitle = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: #92400e;
  margin-bottom: 0.5rem;
`;

const PolicyDescText = styled.p`
  color: #a16207;
  font-size: 0.875rem;
  line-height: 1.5;
`;

const ValidPeriod = styled.div`
  background: rgba(99, 102, 241, 0.1);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
`;

const ValidPeriodLabel = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: #3730a3;
  margin-bottom: 0.5rem;
`;

const ValidPeriodValue = styled.p`
  font-size: 0.875rem;
  color: #4338ca;
  font-weight: 600;
`;

const ActionSection = styled.div`
  margin-bottom: 1.5rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const AcceptButton = styled.button`
  flex: 1;
  height: 52px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
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

const RejectButton = styled.button`
  flex: 1;
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
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

const ErrorContainer = styled.div`
  text-align: center;
  padding: 3rem 1rem;
`;

const ErrorIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const ErrorText = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
`;

const RetryButton = styled.button`
  background: linear-gradient(135deg, #10b981 0%, #0ea5e9 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
  }
`;

const ActionSpinner = styled.div`
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

const Footer = styled.div`
  text-align: center;
  margin-top: auto;
  padding-top: 2rem;
  color: #9ca3af;
  font-size: 0.75rem;
`;

const ProposalDetailPage = () => {
  const navigate = useNavigate();
  const { proposalId } = useParams();
  const { apiCall } = useAuth();

  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [canRespond, setCanRespond] = useState(false);

  useEffect(() => {
    const fetchProposalAndCheckPermission = async () => {
      try {
        const [receivedResponse, sentResponse] = await Promise.all([
          apiCall({ method: 'GET', url: '/proposals/received/' }),
          apiCall({ method: 'GET', url: '/proposals/sent/' })
        ]);

        // receivedResponse.data가 객체인 경우 빈 배열로, 배열인 경우 그대로 사용
        const receivedProposals = Array.isArray(receivedResponse.data) ? receivedResponse.data : [];
        const sentProposals = Array.isArray(sentResponse.data) ? sentResponse.data : [];

        const allProposals = [
          ...receivedProposals,
          ...sentProposals
        ];

        const foundProposal = allProposals.find(
          p => p.proposal_id.toString() === proposalId
        );

        if (!foundProposal) {
          setError('제안을 찾을 수 없거나 접근 권한이 없습니다.');
          return;
        }

        setProposal(foundProposal);
        
        // 받은 제안인지 확인 (받은 제안만 응답 가능)
        const isReceivedProposal = receivedProposals.some(
          p => p.proposal_id.toString() === proposalId
        );
        
        // 받은 제안인지 보낸 제안인지 구분해서 저장
        setProposal({
          ...foundProposal,
          isReceived: isReceivedProposal
        });
        
        setCanRespond(isReceivedProposal && foundProposal.status === 'pending');

      } catch (err) {
        setError('제안 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProposalAndCheckPermission();
  }, [apiCall, proposalId]);

  const getCategoryIcon = (category) => {
    const categoryIcons = {
      cafe: '☕',
      restaurant: '🍽️',
      food: '🍽️',
      beauty: '💄',
      etc: '🛍️',
    };
    return categoryIcons[category] || '🏪';
  };

  const getCategoryName = (category) => {
    const categoryNames = {
      cafe: '카페',
      restaurant: '식당',
      food: '음식점',
      beauty: '미용',
      etc: '기타',
    };
    return categoryNames[category] || category || '기타';
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return '검토중';
      case 'accepted': return '승낙됨';
      case 'rejected': return '거절됨';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrice = (price) => {
    return price.toLocaleString('ko-KR');
  };

  const handleResponse = async (action) => {
    if (!proposal || actionLoading) return;

    setActionLoading(true);

    try {
      const response = await apiCall({
        method: 'POST',
        url: `/proposals/${proposal.proposal_id}/respond/`,
        data: { action }
      });

      if (response.success) {
        alert(action === 'accept' ? '제안을 승낙했습니다.' : '제안을 거절했습니다.');
        navigate('/owner/mypage');
      } else {
        alert('응답 처리에 실패했습니다.');
      }
    } catch (err) {
      alert('응답 처리 중 오류가 발생했습니다.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <ContentWrapper>
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingText>제안을 불러오는 중...</LoadingText>
          </LoadingContainer>
        </ContentWrapper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ContentWrapper>
          <ErrorContainer>
            <ErrorIcon>❌</ErrorIcon>
            <ErrorText>{error}</ErrorText>
            <RetryButton onClick={() => navigate('/owner/mypage')}>
              마이페이지로 돌아가기
            </RetryButton>
          </ErrorContainer>
        </ContentWrapper>
      </Container>
    );
  }

  if (!proposal) {
    return null;
  }

  return (
    <Container>
      <ContentWrapper>
        <BackButton onClick={() => navigate(-1)}>
          ←
        </BackButton>

        <Header>
          <Logo>
            <span className="neigh">Neigh</span>
            <span className="biz">Biz</span>
          </Logo>
          <PageTitle>제휴 제안 상세</PageTitle>
        </Header>

        {/* 제안 상태 */}
        <Card>
          <div style={{ textAlign: 'center' }}>
            <StatusBadge status={proposal.status}>
              <StatusDot status={proposal.status} />
              {getStatusText(proposal.status)}
            </StatusBadge>
          </div>
        </Card>

        {/* 제안자 정보 */}
        <Card>
          <ProposerSection>
            <SectionTitle>
              <span>🏪</span>
              {proposal.isReceived ? '제안한 가게' : '제안받은 가게'}
            </SectionTitle>
            <ProposerInfo>
              <ProposerAvatar>
                {getCategoryIcon(
                  proposal.isReceived 
                    ? proposal.proposer_merchant?.category 
                    : proposal.target_merchant?.category
                )}
              </ProposerAvatar>
              <ProposerDetails>
                <ProposerName>
                  {proposal.isReceived 
                    ? proposal.proposer_merchant?.name || '이름 없음'
                    : proposal.target_merchant?.name || '이름 없음'
                  }
                </ProposerName>
                <ProposerCategory>
                  {getCategoryName(
                    proposal.isReceived 
                      ? proposal.proposer_merchant?.category 
                      : proposal.target_merchant?.category
                  )}
                </ProposerCategory>
                <ProposerAddress>
                  {proposal.isReceived 
                    ? proposal.proposer_merchant?.address || '주소 없음'
                    : proposal.target_merchant?.address || '주소 없음'
                  }
                </ProposerAddress>
              </ProposerDetails>
            </ProposerInfo>
            {((proposal.isReceived && proposal.proposer_merchant?.image_url) || 
              (!proposal.isReceived && proposal.target_merchant?.image_url)) && (
              <ProposerImage 
                src={proposal.isReceived 
                  ? proposal.proposer_merchant.image_url 
                  : proposal.target_merchant.image_url
                } 
                alt={proposal.isReceived 
                  ? proposal.proposer_merchant?.name || '가게 이미지'
                  : proposal.target_merchant?.name || '가게 이미지'
                } 
              />
            )}
          </ProposerSection>

          <PostInfo>
            <PostTitle>
              {proposal.isReceived ? '우리가 요청한 제휴 내용' : '상대방이 요청한 제휴 내용'}
            </PostTitle>
            <PostValue>
              {formatPrice(
                proposal.isReceived 
                  ? proposal.post?.expected_value || 0
                  : proposal.target_post?.expected_value || 0
              )}원 상당의 혜택
            </PostValue>
          </PostInfo>
        </Card>

        {/* 제안하는 쿠폰 정책 */}
        <Card>
          <CouponPolicySection>
            <SectionTitle>
              <span>🎫</span>
              {proposal.isReceived ? '상대방이 제안하는 쿠폰 혜택' : '우리가 제안한 쿠폰 혜택'}
            </SectionTitle>

            <PolicyDescription>
              <PolicyDescTitle>쿠폰 내용</PolicyDescTitle>
              <PolicyDescText>
                {proposal.isReceived 
                  ? proposal.coupon_policy?.description || '쿠폰 설명 없음'
                  : proposal.my_coupon_policy?.description || '쿠폰 설명 없음'
                }
              </PolicyDescText>
            </PolicyDescription>

            <PolicyGrid>
              <PolicyBox>
                <PolicyLabel>일일 한도</PolicyLabel>
                <PolicyValue>
                  {proposal.isReceived 
                    ? proposal.coupon_policy?.daily_limit || 0
                    : proposal.my_coupon_policy?.daily_limit || 0
                  }매
                </PolicyValue>
              </PolicyBox>
              <PolicyBox>
                <PolicyLabel>총 한도</PolicyLabel>
                <PolicyValue>
                  {proposal.isReceived 
                    ? proposal.coupon_policy?.total_limit || 0
                    : proposal.my_coupon_policy?.total_limit || 0
                  }매
                </PolicyValue>
              </PolicyBox>
            </PolicyGrid>

            <ValidPeriod>
              <ValidPeriodLabel>유효 기간</ValidPeriodLabel>
              <ValidPeriodValue>
                {proposal.isReceived && proposal.coupon_policy?.valid_from ? 
                  `${formatDate(proposal.coupon_policy.valid_from)} ~ ${formatDate(proposal.coupon_policy.valid_until)}` :
                  !proposal.isReceived && proposal.my_coupon_policy?.valid_from ? 
                  `${formatDate(proposal.my_coupon_policy.valid_from)} ~ ${formatDate(proposal.my_coupon_policy.valid_until)}` :
                  '유효 기간 정보 없음'
                }
              </ValidPeriodValue>
            </ValidPeriod>
          </CouponPolicySection>
        </Card>

        {/* 응답 버튼 */}
        {canRespond && (
          <ActionSection>
            <ActionButtons>
              <AcceptButton 
                onClick={() => handleResponse('accept')}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <ActionSpinner />
                ) : (
                  <>
                    <span>✅</span>
                    승낙하기
                  </>
                )}
              </AcceptButton>
              
              <RejectButton 
                onClick={() => handleResponse('reject')}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <ActionSpinner />
                ) : (
                  <>
                    <span>❌</span>
                    거절하기
                  </>
                )}
              </RejectButton>
            </ActionButtons>
          </ActionSection>
        )}

        <Footer>
          네이비즈 소상공인 제휴 플랫폼
        </Footer>
      </ContentWrapper>
    </Container>
  );
};

export default ProposalDetailPage;