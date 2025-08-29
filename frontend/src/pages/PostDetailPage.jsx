import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
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
  margin-bottom: 1.5rem;
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

const PostTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 0.75rem;
  text-align: center;
`;

const PostDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  text-align: center;
  margin-bottom: 1rem;
`;

const PostInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
`;

const InfoBox = styled.div`
  background: ${props => props.type === 'value' ? 
    'rgba(59, 130, 246, 0.1)' : 'rgba(147, 51, 234, 0.1)'
  };
  border-radius: 12px;
  padding: 0.75rem;
  text-align: center;
`;

const InfoLabel = styled.p`
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: ${props => props.type === 'value' ? '#1e40af' : '#7c2d12'};
`;

const InfoValue = styled.p`
  font-size: 1rem;
  font-weight: 700;
  color: ${props => props.type === 'value' ? '#1e3a8a' : '#581c87'};
`;

const MerchantHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const MerchantAvatar = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  font-size: 1.5rem;
`;

const MerchantInfo = styled.div`
  flex: 1;
`;

const MerchantName = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 0.25rem;
`;

const MerchantCategory = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
`;

const MerchantAddress = styled.p`
  font-size: 0.75rem;
  color: #9ca3af;
`;

const MerchantImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 1rem;
`;

const MerchantDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
`;

const CouponPolicyTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 1rem;
  text-align: center;
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

const ActionButton = styled.button`
  width: 100%;
  height: 52px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;

  ${props => {
    if (props.disabled) {
      return `
        background: #f3f4f6;
        color: #9ca3af;
        cursor: not-allowed;
      `;
    }
    return `
      background: linear-gradient(135deg, #10b981 0%, #0ea5e9 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
      }

      &:active {
        transform: translateY(0);
      }
    `;
  }}
`;

const DisabledReason = styled.p`
  color: #ef4444;
  font-size: 0.875rem;
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 500;
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

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 1rem;
  
  ${props => {
    if (props.status === 'open') {
      return `
        background: rgba(16, 185, 129, 0.1);
        color: #065f46;
      `;
    }
    return `
      background: rgba(107, 114, 128, 0.1);
      color: #374151;
    `;
  }}
`;

const StatusDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${props => props.status === 'open' ? '#10b981' : '#6b7280'};
`;

const PostDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { apiCall } = useAuth();
  
  const [postData, setPostData] = useState(null);
  const [partnershipStatus, setPartnershipStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postResponse, statusResponse] = await Promise.all([
          apiCall({
            method: 'GET',
            url: `/posts/${id}`,
          }),
          apiCall({
            method: 'GET',
            url: '/owner/partnership/status-check/',
          })
        ]);
        
        if (postResponse.success) {
          setPostData(postResponse.data);
        } else {
          throw new Error('게시글을 불러올 수 없습니다.');
        }
        
        if (statusResponse.success) {
          setPartnershipStatus(statusResponse.data);
        } else {
          throw new Error('상태를 확인할 수 없습니다.');
        }
      } catch (err) {
        setError('게시글을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiCall, id]);

  const getCategoryIcon = (category) => {
    const categoryIcons = {
      cafe: '☕',
      restaurant: '🍽️',
      beauty: '💄',
      etc: '🛍️',
    };
    return categoryIcons[category] || '🏪';
  };

  const getCategoryName = (category) => {
    const categoryNames = {
      cafe: '카페',
      restaurant: '식당',
      beauty: '미용',
      etc: '기타',
    };
    return categoryNames[category] || category;
  };

  const formatPrice = (price) => {
    return price.toLocaleString('ko-KR');
  };

  const formatDuration = (duration) => {
    const durationMap = {
      '1_month': '1개월',
      '3_months': '3개월',
      '6_months': '6개월',
      'unlimited': '무기한',
    };
    return durationMap[duration] || duration;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDisabledReason = () => {
    if (!partnershipStatus) return '';
    if (postData?.post.status !== 'open') return '모집 마감된 게시글입니다';
    if (!partnershipStatus.has_coupon_policy) return '쿠폰 정책을 먼저 설정해주세요';
    if (partnershipStatus.has_received_proposal) return '받은 제안을 먼저 처리해주세요';
    if (partnershipStatus.has_sent_proposal) return '이미 다른 제휴 요청을 보냈습니다';
    if (partnershipStatus.has_active_partnership) return '이미 활성화된 제휴가 있습니다';
    return '';
  };

  const isDisabled = () => {
    return getDisabledReason() !== '';
  };

  const handleProposalSubmit = async () => {
    if (isDisabled()) return;

    setSubmitting(true);
    try {
      const response = await apiCall({
        method: 'POST',
        url: `/proposals/${id}/send/`,
      });

      if (response.success) {
        alert('제휴 요청이 성공적으로 전송되었습니다!');
        navigate('/owner/posts');
      }
    } catch (err) {
      alert('제휴 요청 전송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <ContentWrapper>
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingText>게시글을 불러오는 중...</LoadingText>
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
            <RetryButton onClick={() => window.location.reload()}>
              다시 시도
            </RetryButton>
          </ErrorContainer>
        </ContentWrapper>
      </Container>
    );
  }

  if (!postData) {
    return null;
  }

  const { post, author_merchant, coupon_policy } = postData;

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

        {/* 게시글 정보 */}
        <Card>
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <StatusBadge status={post.status}>
              <StatusDot status={post.status} />
              {post.status === 'open' ? '모집중' : '모집마감'}
            </StatusBadge>
          </div>
          <PostTitle>{post.title}</PostTitle>
          <PostDescription>{post.description}</PostDescription>
          <PostInfo>
            <InfoBox type="value">
              <InfoLabel type="value">예상 가치</InfoLabel>
              <InfoValue type="value">
                {formatPrice(post.expected_value)}원
              </InfoValue>
            </InfoBox>
            <InfoBox type="duration">
              <InfoLabel type="duration">유효 기간</InfoLabel>
              <InfoValue type="duration">
                {formatDuration(post.expected_duration)}
              </InfoValue>
            </InfoBox>
          </PostInfo>
        </Card>

        {/* 작성자 가게 정보 */}
        <Card>
          <MerchantHeader>
            <MerchantAvatar>
              {getCategoryIcon(author_merchant.category)}
            </MerchantAvatar>
            <MerchantInfo>
              <MerchantName>{author_merchant.name}</MerchantName>
              <MerchantCategory>{getCategoryName(author_merchant.category)}</MerchantCategory>
              <MerchantAddress>{author_merchant.address}</MerchantAddress>
            </MerchantInfo>
          </MerchantHeader>
          {author_merchant.image_url && (
            <MerchantImage src={author_merchant.image_url} alt={author_merchant.name} />
          )}
          <MerchantDescription>{author_merchant.description}</MerchantDescription>
        </Card>

        {/* 쿠폰 정책 */}
        <Card>
          <CouponPolicyTitle>🎫 쿠폰 정책 상세</CouponPolicyTitle>
          <PolicyGrid>
            <PolicyBox>
              <PolicyLabel>일일 한도</PolicyLabel>
              <PolicyValue>{coupon_policy.daily_limit}매</PolicyValue>
            </PolicyBox>
            <PolicyBox>
              <PolicyLabel>총 한도</PolicyLabel>
              <PolicyValue>{coupon_policy.total_limit}매</PolicyValue>
            </PolicyBox>
          </PolicyGrid>
          <ValidPeriod>
            <ValidPeriodLabel>유효 기간</ValidPeriodLabel>
            <ValidPeriodValue>
              {formatDate(coupon_policy.valid_from)} ~ {formatDate(coupon_policy.valid_until)}
            </ValidPeriodValue>
          </ValidPeriod>
        </Card>

        {/* 제휴 신청 버튼 */}
        {getDisabledReason() && (
          <DisabledReason>{getDisabledReason()}</DisabledReason>
        )}
        
        <ActionButton 
          disabled={isDisabled() || submitting}
          onClick={handleProposalSubmit}
        >
          {submitting ? (
            <>
              <LoadingSpinner style={{ width: '20px', height: '20px', margin: '0' }} />
              전송 중...
            </>
          ) : (
            <>
              <span>🤝</span>
              제휴 신청하기
            </>
          )}
        </ActionButton>
      </ContentWrapper>
    </Container>
  );
};

export default PostDetailPage;