import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import api from '../lib/axios';
import defaultImage from '../assets/image.PNG';
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

const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
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
  position: relative;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
  }
`;

const NotificationButton = styled.button`
  position: relative;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 0.6rem 0.8rem;
    font-size: 0.8rem;
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  animation: ${pulse} 2s infinite;
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

const NotificationDropdown = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 350px;
  max-height: 400px;
  overflow-y: auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(226, 232, 240, 0.8);
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;

  @media (max-width: 768px) {
    width: 300px;
    right: -50px;
  }
`;

const NotificationHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  border-radius: 16px 16px 0 0;

  h4 {
    font-size: 1.1rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
  }
`;

const NotificationList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const NotificationItem = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.isRead ? 'white' : 'rgba(59, 130, 246, 0.05)'};

  &:hover {
    background: rgba(59, 130, 246, 0.1);
  }

  &:last-child {
    border-bottom: none;
  }

  p {
    font-size: 0.9rem;
    color: #374151;
    margin-bottom: 0.5rem;
    font-weight: ${props => props.isRead ? '400' : '600'};
  }

  small {
    color: #6b7280;
    font-size: 0.8rem;
  }
`;

const EmptyNotification = styled.div`
  padding: 2rem 1.5rem;
  text-align: center;
  color: #6b7280;
  font-size: 0.9rem;
`;

const MainContainer  = styled.main`
  max-width: 1400px;
  margin: 0 auto;
  padding: 3rem 2rem;
  animation: ${fadeInUp} 0.8s ease-out;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const HeroSection = styled.section`
  text-align: center;
  margin-bottom: 4rem;
  padding: 3rem 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9));
  border-radius: 24px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
  }

  @media (max-width: 768px) {
    padding: 2rem 1rem;
    margin-bottom: 2rem;
  }
`;

const HeroTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  color: #6b7280;
  font-weight: 500;
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 768px) {
    font-size: 1rem;
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

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

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

const CategoryContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(226, 232, 240, 0.8);
  margin-bottom: 2rem;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.75rem;
  }
`;

const CategoryButton = styled.button`
  padding: 1rem 1.5rem;
  background: ${props => 
    props.selected 
      ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' 
      : 'rgba(248, 250, 252, 0.8)'
  };
  color: ${props => props.selected ? 'white' : '#374151'};
  border-radius: 12px;
  font-weight: ${props => props.selected ? '600' : '500'};
  font-size: 0.9rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid ${props => props.selected ? 'transparent' : '#e5e7eb'};
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
    transform: translateY(-2px);
    box-shadow: ${props => 
      props.selected 
        ? '0 8px 25px rgba(59, 130, 246, 0.4)' 
        : '0 8px 25px rgba(0, 0, 0, 0.1)'
    };
    border-color: ${props => props.selected ? 'transparent' : '#d1d5db'};
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 0.8rem 1rem;
    font-size: 0.8rem;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  color: #6b7280;
  font-size: 1rem;
  
  &::before {
    content: '';
    width: 24px;
    height: 24px;
    border: 2px solid #e5e7eb;
    border-top: 2px solid #3b82f6;
    border-radius: 50%;
    animation: ${spin} 0.8s linear infinite;
    margin-right: 0.75rem;
  }
`;

const SelectedCategories = styled.div`
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid rgba(59, 130, 246, 0.2);
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.5s ease-out;

  p {
    color: #1f2937;
    font-weight: 600;
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &::before {
      content: '🏷️';
      font-size: 1.2rem;
    }
  }
`;

const PostsContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(226, 232, 240, 0.8);
`;

const PostsList = styled.ul`
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const PostItem = styled.li`
  background: rgba(248, 250, 252, 0.5);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(226, 232, 240, 0.8);
  position: relative;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    border-color: rgba(59, 130, 246, 0.3);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const PostImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;
  background: linear-gradient(45deg, #f3f4f6, #e5e7eb);

  ${PostItem}:hover & {
    transform: scale(1.05);
  }
`;

const PostContent = styled.div`
  padding: 1.5rem;
  background: white;
`;

const PostTitle = styled.strong`
  font-size: 1.1rem;
  font-weight: 700;
  color: #1f2937;
  display: block;
  margin-bottom: 0.5rem;
  line-height: 1.4;
`;

const PostStore = styled.span`
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '🏪';
    font-size: 1rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
  background: rgba(248, 250, 252, 0.5);
  border-radius: 16px;
  border: 2px dashed #d1d5db;

  h4 {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #374151;
  }

  p {
    font-size: 1rem;
    line-height: 1.6;
  }

  .emoji {
    font-size: 3rem;
    margin-bottom: 1rem;
    display: block;
  }
`;

const ErrorMessage = styled.div`
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-weight: 500;
  font-size: 0.95rem;
  margin-top: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  animation: ${fadeIn} 0.3s ease-out;

  &::before {
    content: '⚠️';
    font-size: 1.2rem;
  }
`;

const StatsBar = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9));
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  backdrop-filter: blur(10px);
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: #3b82f6;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #6b7280;
  font-weight: 600;
`;

function Main() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/');
  };

  const handleWrite = () => navigate('/post/create');
  const handleMyPage = () => navigate('/mypage');

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications/');
      setNotifications(res.data.data);
    } catch (err) {
      setError(extractFirstError(err, '알림 목록을 불러오지 못했습니다.'));
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get('/notifications/unread-count/');
      setUnreadCount(res.data.data.unread_count);
    } catch (err) {
      setError(extractFirstError(err, '알림 개수를 불러오지 못했습니다.'));
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read/`);
      setNotifications(prev => prev.map(n => (n.id === id ? { ...n, is_read: true } : n)));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      setError(extractFirstError(err, '알림 읽음 처리에 실패했습니다.'));
    }
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        await api.get('/stores/me/');
      } catch {
        navigate('/store/create');
        return;
      }

      try {
        const postRes = await api.get('/posts/');
        setPosts(postRes.data.data);
      } catch (err) {
        setError(extractFirstError(err, '게시글을 불러오지 못했습니다.'));
      } finally {
        setLoading(false);
      }

      try {
        const catRes = await api.get('/posts/categories/');
        setCategories(catRes.data.data);
      } catch (err) {
        setError(extractFirstError(err, '카테고리를 불러오지 못했습니다.'));
      } finally {
        setCategoriesLoading(false);
      }

      fetchUnreadCount();
    };

    init();
  }, [navigate]);

  const toggleCategory = (categoryName) => {
    setSelectedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const filteredPosts = selectedCategories.length === 0
    ? posts
    : posts.filter(post =>
        post.partnership_categories.some(cat => selectedCategories.includes(cat.name))
      );

  return (
    <>
      <GlobalStyle />
      <Container>
        <Header>
          <HeaderContent>
            <Logo>
              Neigh<span>biz</span>
            </Logo>
            <HeaderActions>
              <NotificationButton onClick={() => {
                fetchNotifications();
                setShowDropdown(!showDropdown);
              }}>
                알림 {unreadCount > 0 && <NotificationBadge>{unreadCount}</NotificationBadge>}
              </NotificationButton>
              {showDropdown && (
                <NotificationDropdown ref={dropdownRef}>
                  <NotificationHeader>
                    <h4>알림</h4>
                  </NotificationHeader>
                  <NotificationList>
                    {notifications.length === 0 ? (
                      <EmptyNotification>알림이 없습니다.</EmptyNotification>
                    ) : (
                      notifications.map(n => (
                        <NotificationItem
                          key={n.id}
                          isRead={n.is_read}
                          onMouseEnter={() => !n.is_read && markAsRead(n.id)}
                          onClick={() => navigate(`/post/${n.post}`)}
                        >
                          <p>{n.sender_username}님의 제안: {n.message}</p>
                          <small>{new Date(n.created_at).toLocaleString()}</small>
                        </NotificationItem>
                      ))
                    )}
                  </NotificationList>
                </NotificationDropdown>
              )}
              <HeaderButton primary onClick={handleWrite}>제휴 글쓰기</HeaderButton>
              <HeaderButton onClick={handleMyPage}>마이페이지</HeaderButton>
              <HeaderButton onClick={handleLogout}>로그아웃</HeaderButton>
            </HeaderActions>
          </HeaderContent>
        </Header>

        <MainContainer >
          <HeroSection>
            <HeroTitle>제휴 파트너 찾기</HeroTitle>
            <HeroSubtitle>검증된 사업자들과 함께 성장할 기회를 발견하세요</HeroSubtitle>
          </HeroSection>

          <StatsBar>
            <StatCard>
              <StatNumber>{posts.length}</StatNumber>
              <StatLabel>전체 제휴 제안서</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{categories.length}</StatNumber>
              <StatLabel>활성 카테고리</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{filteredPosts.length}</StatNumber>
              <StatLabel>필터링된 제안서</StatLabel>
            </StatCard>
          </StatsBar>

          <Section delay="0.1s">
            <SectionTitle>카테고리</SectionTitle>
            <CategoryContainer>
              {categoriesLoading ? (
                <LoadingSpinner>카테고리를 불러오는 중...</LoadingSpinner>
              ) : (
                <CategoryGrid>
                  {categories.map(cat => (
                    <CategoryButton
                      key={cat.id}
                      selected={selectedCategories.includes(cat.name)}
                      onClick={() => toggleCategory(cat.name)}
                    >
                      {cat.name}
                    </CategoryButton>
                  ))}
                                </CategoryGrid>
              )}
            </CategoryContainer>
          </Section>

          {selectedCategories.length > 0 && (
            <SelectedCategories>
              <p>선택된 카테고리: {selectedCategories.join(', ')}</p>
            </SelectedCategories>
          )}

          <Section delay="0.2s">
            <SectionTitle>제휴 제안서 목록</SectionTitle>
            <PostsContainer>
              {loading ? (
                <LoadingSpinner>제안서를 불러오는 중...</LoadingSpinner>
              ) : filteredPosts.length === 0 ? (
                <EmptyState>
                  <div className="emoji">📭</div>
                  <h4>등록된 제안서가 없습니다</h4>
                  <p>
                    조건에 맞는 제안서를 찾지 못했습니다.
                    <br />
                    다른 카테고리를 선택해보세요!
                  </p>
                </EmptyState>
              ) : (
                <PostsList>
                  {filteredPosts.map((post) => (
                    <PostItem key={post.id} onClick={() => navigate(`/post/${post.id}`)}>
                      <PostImage
                        src={post.images?.[0]?.image_url || defaultImage}
                        alt="썸네일"
                        onError={(e) => {
                          e.target.src = defaultImage;
                        }}
                      />
                      <PostContent>
                        <PostTitle>{post.title}</PostTitle>
                        <PostStore>{post.store_name}</PostStore>
                      </PostContent>
                    </PostItem>
                  ))}
                </PostsList>
              )}
            </PostsContainer>
          </Section>

          {error && <ErrorMessage>{error}</ErrorMessage>}
        </MainContainer >
      </Container>
    </>
  );
}

export default Main;