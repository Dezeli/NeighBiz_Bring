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

const FilterSection = styled.div`
  background: linear-gradient(135deg, #fef7ff 0%, #f0f9ff 100%);
  border: 2px solid rgba(147, 51, 234, 0.1);
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(147, 51, 234, 0.08);
`;

const FilterTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #581c87;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FilterGrid = styled.div`
  display: grid;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const FilterRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FilterLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #581c87;
`;

const FilterInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 0.75rem;
  border: 2px solid rgba(147, 51, 234, 0.2);
  border-radius: 10px;
  font-size: 0.875rem;
  background: white;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #9333ea;
    box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
  }
`;

const FilterSelect = styled.select`
  width: 100%;
  height: 40px;
  padding: 0 0.75rem;
  border: 2px solid rgba(147, 51, 234, 0.2);
  border-radius: 10px;
  font-size: 0.875rem;
  background: white;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #9333ea;
    box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
  }
`;

const FilterActions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const FilterButton = styled.button`
  flex: 1;
  height: 44px;
  border: none;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
`;

const ApplyButton = styled(FilterButton)`
  background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%);
  color: white;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(147, 51, 234, 0.4);
  }
`;

const ResetButton = styled(FilterButton)`
  background: white;
  color: #581c87;
  border: 2px solid rgba(147, 51, 234, 0.3);
  
  &:hover {
    background: #faf5ff;
    border-color: #9333ea;
  }
`;

const PostsSection = styled.div`
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%);
  border: 2px solid rgba(16, 185, 129, 0.1);
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.08);
  flex: 1;
`;

const PostsSectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #065f46;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PostsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PostCard = styled.div`
  background: white;
  border: 2px solid rgba(16, 185, 129, 0.15);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.08);
  transition: all 0.3s ease;
  cursor: ${props => (props.$disabled ? 'default' : 'pointer')};
  opacity: ${props => (props.$disabled ? 0.7 : 1)};
  pointer-events: ${props => (props.$disabled ? 'none' : 'auto')};

  &:hover {
    ${props => !props.$disabled && `
      box-shadow: 0 8px 20px rgba(16, 185, 129, 0.15);
      transform: translateY(-3px);
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
  background: white;
  border: 2px dashed rgba(16, 185, 129, 0.2);
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
  margin-top: 1rem;
  color: #9ca3af;
  font-size: 0.75rem;
`;

const PostsListPage = () => {
  const navigate = useNavigate();
  const { apiCall } = useAuth();
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState({
    category: '',
    description: '',
    expected_value_min: '',
    expected_value_max: '',
    duration: '',
    monthly_limit_min: '',
    monthly_limit_max: '',
    updated_at_after: '',
    updated_at_before: '',
    is_partnered: ''
  });

  const buildQueryParams = () => {
    const params = new URLSearchParams();
    params.append('page', currentPage.toString());
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.toString().trim()) {
        params.append(key, value.toString().trim());
      }
    });
    
    return params.toString();
  };

  const fetchPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const queryString = buildQueryParams();
      const response = await apiCall({
        method: 'GET',
        url: `/stores/posts/?${queryString}`,
      });

      // API 응답 구조: { success: true, data: { results: [...] } }
      let postsData = [];
      if (response && response.data && response.data.results && Array.isArray(response.data.results)) {
        postsData = response.data.results;
      } else if (Array.isArray(response)) {
        postsData = response;
      } else {
        console.error('Unexpected API response structure:', response);
        postsData = [];
      }

      setPosts(postsData);
    } catch (err) {
      console.error('API Error:', err);
      setError('게시글을 불러오는데 실패했습니다.');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setCurrentPage(1);
    fetchPosts();
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      description: '',
      expected_value_min: '',
      expected_value_max: '',
      duration: '',
      monthly_limit_min: '',
      monthly_limit_max: '',
      updated_at_after: '',
      updated_at_before: '',
      is_partnered: ''
    });
    setCurrentPage(1);
    fetchPosts();
  };

  const formatDuration = (duration) => {
    const durationMap = {
      '1_month': '1개월',
      '2_months': '2개월',
      '3_months': '3개월',
      '6_months': '6개월',
      '1_year': '1년',
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

  const getStatusMeta = (isPartnered) => {
    if (isPartnered) {
      return { label: '제휴완료', bg: 'rgba(59,130,246,0.10)', color: '#1e3a8a', dot: '#3b82f6' };
    } else {
      return { label: '모집중', bg: 'rgba(16,185,129,0.10)', color: '#065f46', dot: '#10b981' };
    }
  };

  const isPostClickable = (isPartnered) => !isPartnered; // 제휴완료면 클릭 불가

  if (loading && posts.length === 0) {
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
            <RetryButton onClick={fetchPosts}>
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

        <FilterSection>
          <FilterTitle>🔍 검색 필터</FilterTitle>
          <FilterGrid>
            <FilterRow>
              <FilterGroup>
                <FilterLabel>카테고리</FilterLabel>
                <FilterSelect
                  value={filters.category}
                  onChange={e => handleFilterChange('category', e.target.value)}
                >
                  <option value="">전체</option>
                  <option value="cafe">카페</option>
                  <option value="restaurant">음식점</option>
                  <option value="bakery">베이커리</option>
                  <option value="pub">주점</option>
                  <option value="fitness">운동</option>
                  <option value="study">독서실</option>
                  <option value="florist">꽃집</option>
                  <option value="convenience">편의점</option>
                  <option value="entertain">유흥시설</option>
                  <option value="other">기타</option>
                </FilterSelect>
              </FilterGroup>
              <FilterGroup>
                <FilterLabel>쿠폰 설명 검색</FilterLabel>
                <FilterInput
                  type="text"
                  placeholder="예: 아메리카노"
                  value={filters.description}
                  onChange={e => handleFilterChange('description', e.target.value)}
                />
              </FilterGroup>
            </FilterRow>
            <FilterRow>
              <FilterGroup>
                <FilterLabel>최소 가격</FilterLabel>
                <FilterInput
                  type="number"
                  placeholder="1000"
                  value={filters.expected_value_min}
                  onChange={e => handleFilterChange('expected_value_min', e.target.value)}
                />
              </FilterGroup>
              <FilterGroup>
                <FilterLabel>최대 가격</FilterLabel>
                <FilterInput
                  type="number"
                  placeholder="5000"
                  value={filters.expected_value_max}
                  onChange={e => handleFilterChange('expected_value_max', e.target.value)}
                />
              </FilterGroup>
            </FilterRow>
            <FilterRow>
              <FilterGroup>
                <FilterLabel>유효기간</FilterLabel>
                <FilterSelect
                  value={filters.duration}
                  onChange={e => handleFilterChange('duration', e.target.value)}
                >
                  <option value="">전체</option>
                  <option value="1_month">1개월</option>
                  <option value="2_months">2개월</option>
                  <option value="3_months">3개월</option>
                  <option value="6_months">6개월</option>
                  <option value="1_year">1년</option>
                </FilterSelect>
              </FilterGroup>
              <FilterGroup>
                <FilterLabel>제휴 여부</FilterLabel>
                <FilterSelect
                  value={filters.is_partnered}
                  onChange={e => handleFilterChange('is_partnered', e.target.value)}
                >
                  <option value="">전체</option>
                  <option value="true">제휴완료</option>
                  <option value="false">모집중</option>
                </FilterSelect>
              </FilterGroup>
            </FilterRow>
            <FilterRow>
              <FilterGroup>
                <FilterLabel>최소 월한도</FilterLabel>
                <FilterInput
                  type="number"
                  placeholder="10"
                  value={filters.monthly_limit_min}
                  onChange={e => handleFilterChange('monthly_limit_min', e.target.value)}
                />
              </FilterGroup>
              <FilterGroup>
                <FilterLabel>최대 월한도</FilterLabel>
                <FilterInput
                  type="number"
                  placeholder="100"
                  value={filters.monthly_limit_max}
                  onChange={e => handleFilterChange('monthly_limit_max', e.target.value)}
                />
              </FilterGroup>
            </FilterRow>
            <FilterRow>
              <FilterGroup>
                <FilterLabel>시작 날짜</FilterLabel>
                <FilterInput
                  type="date"
                  value={filters.updated_at_after}
                  onChange={e => handleFilterChange('updated_at_after', e.target.value)}
                />
              </FilterGroup>
              <FilterGroup>
                <FilterLabel>종료 날짜</FilterLabel>
                <FilterInput
                  type="date"
                  value={filters.updated_at_before}
                  onChange={e => handleFilterChange('updated_at_before', e.target.value)}
                />
              </FilterGroup>
            </FilterRow>
          </FilterGrid>
          <FilterActions>
            <ResetButton onClick={resetFilters}>초기화</ResetButton>
            <ApplyButton onClick={applyFilters}>검색</ApplyButton>
          </FilterActions>
        </FilterSection>

        <PostsSection>
          <PostsSectionTitle>📋 제휴 게시글 목록</PostsSectionTitle>
          <PostsList>
            {posts.length === 0 ? (
              <EmptyState>
                <EmptyIcon>📝</EmptyIcon>
                <EmptyTitle>조건에 맞는 게시글이 없습니다</EmptyTitle>
                <EmptyDescription>
                  필터 조건을 변경해서 다시 검색해보세요
                </EmptyDescription>
              </EmptyState>
            ) : (
              posts.map((post) => {
                const meta = getStatusMeta(post.is_partnered);
                const disabled = !isPostClickable(post.is_partnered);
                const category = post?.category;

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
                          <PostTitle>{post.store_name}</PostTitle>
                          <PostMeta>
                            {getCategoryName(category)} • {post.owner_name} • {formatDate(post.updated_at)}
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
                        <InfoLabel $variant="duration">월 한도</InfoLabel>
                        <InfoValue $variant="duration">
                          {post.monthly_limit}매
                        </InfoValue>
                      </InfoBox>
                    </CouponInfo>
                    
                    {post.expected_duration && (
                      <div style={{ 
                        background: 'rgba(147, 51, 234, 0.1)', 
                        borderRadius: '12px', 
                        padding: '0.75rem', 
                        marginBottom: '0.5rem' 
                      }}>
                        <InfoLabel style={{ color: '#7c2d12', margin: '0 0 0.25rem 0' }}>
                          유효 기간: {formatDuration(post.expected_duration)}
                        </InfoLabel>
                      </div>
                    )}
                  </PostCard>
                );
              })
            )}
          </PostsList>
        </PostsSection>

        <Footer>
          네이비즈 소상공인 제휴 플랫폼
        </Footer>
      </ContentWrapper>
    </Container>
  );
};

export default PostsListPage;