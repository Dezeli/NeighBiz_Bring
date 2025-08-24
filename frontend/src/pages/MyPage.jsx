import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import api from '../lib/axios';
import { useNavigate } from 'react-router-dom';
import { extractFirstError } from '../utils/error';

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
    background: #f8fafc;
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

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(59, 130, 246, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 2rem 0;
`;

const Header = styled.header`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
`;

const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    padding: 0 1rem;
    flex-direction: column;
    gap: 1rem;
  }
`;

const Logo = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
  cursor: pointer;

  span {
    color: #fbbf24;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
  }
`;

const HeaderButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${props => 
    props.primary 
      ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' 
      : 'rgba(255, 255, 255, 0.9)'
  };
  color: ${props => props.primary ? 'white' : '#374151'};
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid ${props => props.primary ? 'transparent' : '#e5e7eb'};
  backdrop-filter: blur(10px);

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => 
      props.primary 
        ? '0 8px 25px rgba(59, 130, 246, 0.4)' 
        : '0 8px 25px rgba(0, 0, 0, 0.1)'
    };
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1rem;
    font-size: 0.8rem;
  }
`;

const MainContainer = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  animation: ${fadeInUp} 0.8s ease-out;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const PageTitle = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem 0;

  h1 {
    font-size: 2.5rem;
    font-weight: 800;
    color: #1f2937;
    margin-bottom: 0.5rem;
    letter-spacing: -0.02em;
    line-height: 1.2;
  }

  p {
    font-size: 1.1rem;
    color: #6b7280;
    font-weight: 500;
  }

  @media (max-width: 768px) {
    margin-bottom: 2rem;
    padding: 1rem 0;

    h1 {
      font-size: 1.8rem;
    }

    p {
      font-size: 1rem;
    }
  }
`;

const Section = styled.section`
  margin-bottom: 3rem;
  animation: ${slideIn} 0.6s ease-out;
  animation-delay: ${props => props.delay || '0s'};
  animation-fill-mode: both;

  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &::before {
    content: '';
    width: 4px;
    height: 24px;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const SectionBadge = styled.span`
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-left: 0.5rem;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

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
    transform: translateY(-5px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    border-color: rgba(59, 130, 246, 0.3);
  }
`;

const CardContent = styled.div`
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const StoreInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: rgba(248, 250, 252, 0.8);
  border-radius: 12px;
  border: 1px solid rgba(226, 232, 240, 0.6);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(59, 130, 246, 0.05);
    border-color: rgba(59, 130, 246, 0.2);
  }
`;

const InfoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  flex-shrink: 0;
`;

const InfoContent = styled.div`
  flex: 1;

  .label {
    font-size: 0.85rem;
    color: #6b7280;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  .value {
    font-size: 1rem;
    color: #1f2937;
    font-weight: 600;
  }
`;

const ListContainer = styled.div`
  display: grid;
  gap: 1rem;
`;

const ListItem = styled.div`
  background: rgba(248, 250, 252, 0.8);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(59, 130, 246, 0.1),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    transform: translateY(-3px);
    background: white;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
    border-color: rgba(59, 130, 246, 0.3);
  }

  &:active {
    transform: translateY(-1px);
  }
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const ItemTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.4;
  margin: 0;
`;

const ItemDate = styled.span`
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 500;
  background: rgba(107, 114, 128, 0.1);
  padding: 0.25rem 0.6rem;
  border-radius: 8px;
  white-space: nowrap;
`;

const ItemMessage = styled.p`
  font-size: 0.95rem;
  color: #4b5563;
  font-style: italic;
  margin: 0.75rem 0 0 0;
  padding: 0.75rem;
  background: rgba(59, 130, 246, 0.05);
  border-left: 3px solid #3b82f6;
  border-radius: 0 8px 8px 0;
  line-height: 1.5;

  &::before {
    content: '"';
    color: #3b82f6;
    font-size: 1.2rem;
    font-weight: bold;
  }

  &::after {
    content: '"';
    color: #3b82f6;
    font-size: 1.2rem;
    font-weight: bold;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
  background: rgba(248, 250, 252, 0.8);
  border-radius: 16px;
  border: 2px dashed #d1d5db;
  margin-top: 1rem;

  .emoji {
    font-size: 3rem;
    margin-bottom: 1rem;
    display: block;
  }

  h4 {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #374151;
  }

  p {
    font-size: 1rem;
    line-height: 1.6;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  color: #6b7280;
  font-size: 1.1rem;
  font-weight: 600;
  
  &::before {
    content: '';
    width: 32px;
    height: 32px;
    border: 3px solid #e5e7eb;
    border-top: 3px solid #3b82f6;
    border-radius: 50%;
    animation: ${spin} 0.8s linear infinite;
    margin-right: 1rem;
  }
`;

const ErrorMessage = styled.div`
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 1.5rem 2rem;
  border-radius: 16px;
  font-weight: 600;
  font-size: 1rem;
  margin: 2rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
  animation: ${fadeIn} 0.3s ease-out;
  box-shadow: 0 4px 15px rgba(220, 38, 38, 0.1);

  &::before {
    content: '⚠️';
    font-size: 1.5rem;
  }
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(226, 232, 240, 0.8);

  @media (max-width: 768px) {
    justify-content: center;
    flex-wrap: wrap;
  }
`;

const ActionButton = styled.button`
  padding: 1rem 2rem;
  background: ${props => 
    props.primary 
      ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' 
      : 'rgba(255, 255, 255, 0.9)'
  };
  color: ${props => props.primary ? 'white' : '#374151'};
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid ${props => props.primary ? 'transparent' : '#e5e7eb'};
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${props => 
      props.primary 
        ? '0 10px 30px rgba(59, 130, 246, 0.4)' 
        : '0 10px 30px rgba(0, 0, 0, 0.1)'
    };
  }

  &:active {
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 0.8rem 1.5rem;
    font-size: 0.9rem;
  }
`;

const CategoryTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const CategoryTag = styled.span`
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
  color: #3b82f6;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid rgba(59, 130, 246, 0.2);
`;

function MyPage() {
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        await api.get('/stores/me/');
      } catch (err) {
        if (isMounted) {
          const msg = extractFirstError(err, '가게 정보 확인 중 오류가 발생했습니다.');
          setError(msg);
          navigate('/store/create');
        }
        return;
      }

      try {
        const [storeRes, postsRes, categoryRes, notiRes] = await Promise.all([
          api.get('/stores/me/'),
          api.get('/posts/myposts/'),
          api.get('/posts/categories/'),
          api.get('/notifications/mypage/'),
        ]);

        if (!isMounted) return;

        setStore(storeRes.data.data);
        setPosts(Array.isArray(postsRes.data.data) ? postsRes.data.data : []);
        setCategories(Array.isArray(categoryRes.data.data) ? categoryRes.data.data : []);
        setSentRequests(
          Array.isArray(notiRes.data.data?.sent_requests)
            ? notiRes.data.data.sent_requests
            : []
        );
      } catch (err) {
        if (isMounted) {
          const msg = extractFirstError(err, '마이페이지 정보를 불러오는 중 오류가 발생했습니다.');
          setError(msg);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    init();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const getCategoryName = (id) => {
    const match = categories.find(cat => cat.id === id);
    return match ? match.name : null;
  };

  if (error) {
    return (
      <>
        <GlobalStyle />
        <Container>
          <MainContainer>
            <ErrorMessage>{error}</ErrorMessage>
          </MainContainer>
        </Container>
      </>
    );
  }

  if (loading || !store) {
    return (
      <>
        <GlobalStyle />
        <Container>
          <MainContainer>
            <LoadingSpinner>가게 정보를 불러오는 중입니다...</LoadingSpinner>
          </MainContainer>
        </Container>
      </>
    );
  }

  return (
    <>
      <GlobalStyle />
      <Container>
        <Header>
          <HeaderContent>
            <Logo onClick={() => navigate('/')}>
              Neigh<span>biz</span>
            </Logo>
            <HeaderActions>
              <HeaderButton onClick={() => navigate('/')}>홈으로</HeaderButton>
              <HeaderButton onClick={() => navigate('/post/create')}>글 작성하기</HeaderButton>
            </HeaderActions>
          </HeaderContent>
        </Header>

        <MainContainer>
          <PageTitle>
            <h1>마이페이지</h1>
            <p>내 가게 정보와 제휴 현황을 한눈에 확인하세요</p>
          </PageTitle>

          <Section delay="0.1s">
            <SectionHeader>
              <SectionTitle>
                내 가게 정보
                <SectionBadge>사업자</SectionBadge>
              </SectionTitle>
            </SectionHeader>
            <Card>
              <CardContent>
                <StoreInfoGrid>
                  <InfoItem>
                    <InfoIcon>🏪</InfoIcon>
                    <InfoContent>
                      <div className="label">상호명</div>
                      <div className="value">{store.name}</div>
                    </InfoContent>
                  </InfoItem>
                  <InfoItem>
                    <InfoIcon>🏷️</InfoIcon>
                    <InfoContent>
                      <div className="label">사업 카테고리</div>
                      <div className="value">
                        {Array.isArray(store.categories) && store.categories.length > 0 ? (
                          <CategoryTags>
                            {store.categories.map(id => {
                              const categoryName = getCategoryName(id);
                              return categoryName ? (
                                <CategoryTag key={id}>{categoryName}</CategoryTag>
                              ) : null;
                            })}
                          </CategoryTags>
                        ) : (
                          '카테고리 없음'
                        )}
                      </div>
                    </InfoContent>
                  </InfoItem>
                </StoreInfoGrid>
              </CardContent>
            </Card>
          </Section>

          <Section delay="0.2s">
            <SectionHeader>
              <SectionTitle>
                내가 작성한 글
                <SectionBadge>{posts.length}</SectionBadge>
              </SectionTitle>
            </SectionHeader>
            <Card>
              <CardContent>
                {posts.length === 0 ? (
                  <EmptyState>
                    <div className="emoji">📝</div>
                    <h4>아직 작성한 게시글이 없습니다</h4>
                    <p>첫 제휴 제안서를 작성해보세요!</p>
                  </EmptyState>
                ) : (
                  <ListContainer>
                    {posts.map(post => (
                      <ListItem
                        key={post.id}
                        onClick={() => navigate(`/post/${post.id}`)}
                      >
                        <ItemHeader>
                          <ItemTitle>{post.title}</ItemTitle>
                          <ItemDate>
                            등록일: {new Date(post.created_at).toLocaleDateString()}
                          </ItemDate>
                        </ItemHeader>
                      </ListItem>
                    ))}
                  </ListContainer>
                )}
              </CardContent>
            </Card>
          </Section>

          <Section delay="0.3s">
            <SectionHeader>
              <SectionTitle>
                제휴 요청한 가게
                <SectionBadge>{sentRequests.length}</SectionBadge>
              </SectionTitle>
            </SectionHeader>
            <Card>
              <CardContent>
                {sentRequests.length === 0 ? (
                  <EmptyState>
                    <div className="emoji">🤝</div>
                    <h4>아직 보낸 제휴 요청이 없습니다</h4>
                    <p>관심 있는 사업자에게 제휴를 제안해보세요!</p>
                  </EmptyState>
                ) : (
                  <ListContainer>
                    {sentRequests.map(req => (
                      <ListItem
                        key={req.id}
                        onClick={() => navigate(`/post/${req.post}`)}
                      >
                        <ItemHeader>
                          <ItemTitle>{req.post_title}</ItemTitle>
                          <ItemDate>
                            보낸 날짜: {new Date(req.created_at).toLocaleDateString()}
                          </ItemDate>
                        </ItemHeader>
                        <ItemMessage>{req.message}</ItemMessage>
                      </ListItem>
                    ))}
                  </ListContainer>
                )}
              </CardContent>
            </Card>
          </Section>

          <ActionBar>
            <ActionButton 
              primary 
              onClick={() => navigate('/post/create')}
            >
              새 제휴 제안서 작성
            </ActionButton>
          </ActionBar>
        </MainContainer>
      </Container>
    </>
  );
}

export default MyPage;