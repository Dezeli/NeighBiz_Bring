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
  text-align: center;
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

const PageTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const PageDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
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
  
  ${props => props.$active ? `
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

const PostsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
`;

const PostCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(226, 232, 240, 0.6);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: ${props => (props.$disabled ? 'default' : 'pointer')};
  opacity: ${props => (props.$disabled ? 0.7 : 1)};
  pointer-events: ${props => (props.$disabled ? 'none' : 'auto')};

  &:hover {
    ${props => !props.$disabled && `
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
      border-color: rgba(16, 185, 129, 0.3);
    `}
  }

  &:active {
    ${props => !props.$disabled && `transform: translateY(-1px);`}
  }
`;

const PostHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const AuthorAvatar = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  font-size: 1.125rem;
`;

const AuthorDetails = styled.div`
  flex: 1;
`;

const PostTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 0.25rem;
`;

const PostMeta = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  background: ${p => p.$bg || 'rgba(16,185,129,0.10)'};
  color: ${p => p.$color || '#065f46'};
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const StatusDot = styled.div`
  width: 6px;
  height: 6px;
  background: ${p => p.$dot || '#10b981'};
  border-radius: 50%;
`;

const CouponDescription = styled.div`
  background: rgba(248, 250, 252, 0.8);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const CouponLabel = styled.p`
  color: #374151;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const CouponText = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.4;
`;

const CouponInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const InfoBox = styled.div`
  background: ${props => props.$variant === 'value' ? 
    'rgba(59, 130, 246, 0.1)' : 'rgba(147, 51, 234, 0.1)'
  };
  border-radius: 12px;
  padding: 0.75rem;
`;

const InfoLabel = styled.p`
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: ${props => props.$variant === 'value' ? '#1e40af' : '#7c2d12'};
`;

const InfoValue = styled.p`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.$variant === 'value' ? '#1e3a8a' : '#581c87'};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(226, 232, 240, 0.6);
  border-radius: 16px;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
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

const Footer = styled.div`
  text-align: center;
  margin-top: 2rem;
  color: #9ca3af;
  font-size: 0.75rem;
`;

/** ---------- 상태/표시 유틸 ---------- */
const getStatusMeta = (status) => {
  switch (status) {
    case 'open':
      return { label: '모집중', bg: 'rgba(16,185,129,0.10)', color: '#065f46', dot: '#10b981' };
    case 'matched':
      return { label: '제휴완료', bg: 'rgba(59,130,246,0.10)', color: '#1e3a8a', dot: '#3b82f6' };
    case 'closed':
      return { label: '마감', bg: 'rgba(107,114,128,0.12)', color: '#374151', dot: '#6b7280' };
    default:
      return { label: '모집중', bg: 'rgba(16,185,129,0.10)', color: '#065f46', dot: '#10b981' };
  }
};

const isPostClickable = (status) => status === 'open';

const PostsListPage = () => {
  const navigate = useNavigate();
  const { apiCall } = useAuth();
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await apiCall({
          method: 'GET',
          url: '/posts/',
        });

        // 공통 응답 포맷 대응: { success, data, ... } 또는 배열 직접
        const data = Array.isArray(response)
          ? response
          : (response?.data ?? []);
        setPosts(data);
      } catch (err) {
        setError('게시글을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [apiCall]);

  const formatDuration = (duration) => {
    const durationMap = {
      '1_month': '1개월',
      '3_months': '3개월',
      '6_months': '6개월',
      'unlimited': '무기한',
    };
    return durationMap[duration] || duration;
  };

  const formatPrice = (price) => {
    if (price == null) return '-';
    try {
      return Number(price).toLocaleString('ko-KR');
    } catch {
      return String(price);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

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

  return (
    <Container>
      <ContentWrapper>
        <LogoSection>
          <Logo>
            <span className="neigh">Neigh</span>
            <span className="biz">Biz</span>
          </Logo>
          <PageTitle>제휴 게시글</PageTitle>
          <PageDescription>다른 사장님들의 제휴 제안을 확인해보세요</PageDescription>
        </LogoSection>

        <NavigationTabs>
          <TabButton onClick={() => navigate('/owner/mypage')}>
            <span>👤</span>
            마이페이지
          </TabButton>
          <TabButton $active>
            <span>📋</span>
            제휴 게시글
          </TabButton>
        </NavigationTabs>

        <PostsList>
          {posts.length === 0 ? (
            <EmptyState>
              <EmptyIcon>📝</EmptyIcon>
              <EmptyTitle>등록된 게시글이 없습니다</EmptyTitle>
              <EmptyDescription>
                아직 제휴 제안이 없어요.<br />
                조금 더 기다려보세요!
              </EmptyDescription>
            </EmptyState>
          ) : (
            posts.map((post) => {
              const meta = getStatusMeta(post.status);
              const disabled = !isPostClickable(post.status);
              const category = post?.author?.category; // 백엔드 스펙에 맞춰 필요시 수정

              return (
                <PostCard
                  key={post.id}
                  $disabled={disabled}
                  onClick={() => !disabled && navigate(`/owner/post/${post.id}`)}
                >
                  <PostHeader>
                    <AuthorInfo>
                      <AuthorAvatar>
                        {getCategoryIcon(category)}
                      </AuthorAvatar>
                      <AuthorDetails>
                        <PostTitle>{post.title}</PostTitle>
                        <PostMeta>
                          {getCategoryName(category)} • {formatDate(post.created_at)}
                        </PostMeta>
                      </AuthorDetails>
                    </AuthorInfo>
                    <StatusBadge $bg={meta.bg} $color={meta.color}>
                      <StatusDot $dot={meta.dot} />
                      {meta.label}
                    </StatusBadge>
                  </PostHeader>

                  <CouponDescription>
                    <CouponLabel>🎫 제공 쿠폰</CouponLabel>
                    <CouponText>{post.description}</CouponText>
                  </CouponDescription>

                  <CouponInfo>
                    <InfoBox $variant="value">
                      <InfoLabel $variant="value">예상 가치</InfoLabel>
                      <InfoValue $variant="value">
                        {formatPrice(post.expected_value)}원
                      </InfoValue>
                    </InfoBox>
                    <InfoBox $variant="duration">
                      <InfoLabel $variant="duration">유효 기간</InfoLabel>
                      <InfoValue $variant="duration">
                        {formatDuration(post.expected_duration)}
                      </InfoValue>
                    </InfoBox>
                  </CouponInfo>
                </PostCard>
              );
            })
          )}
        </PostsList>

        <Footer>
          네이비즈 소상공인 제휴 플랫폼
        </Footer>
      </ContentWrapper>
    </Container>
  );
};

export default PostsListPage;
