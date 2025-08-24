import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
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

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
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

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const modalSlideIn = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -60%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
`;

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 2rem 0;

  @media (max-width: 768px) {
    padding: 1rem 0;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  animation: ${fadeInUp} 0.8s ease-out;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const HeaderSection = styled.section`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95));
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 3rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
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
    border-radius: 24px 24px 0 0;
  }

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  color: #374151;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e5e7eb;
  backdrop-filter: blur(10px);
  margin-bottom: 2rem;

  &::before {
    content: '←';
    font-size: 1.2rem;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border-color: #d1d5db;
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1rem;
    font-size: 0.8rem;
  }
`;

const PostTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 2rem;
  letter-spacing: -0.02em;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }
`;

const PostMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: rgba(59, 130, 246, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(59, 130, 246, 0.1);
  font-weight: 500;
  color: #374151;
  font-size: 0.95rem;

  &::before {
    content: '${props => props.icon}';
    font-size: 1.2rem;
  }

  @media (max-width: 768px) {
    padding: 0.8rem 1rem;
    font-size: 0.9rem;
  }
`;

const ContentSection = styled.section`
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(226, 232, 240, 0.8);
  animation: ${slideIn} 0.6s ease-out;
  animation-delay: ${props => props.delay || '0s'};
  animation-fill-mode: both;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 2rem;
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
    margin-bottom: 1.5rem;
  }
`;

const SectionContent = styled.div`
  position: relative;
`;

const ImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const ImageCard = styled.div`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${fadeIn} 0.6s ease-out;
  animation-delay: ${props => (props.index * 0.1)}s;
  animation-fill-mode: both;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  }
`;

const StyledImage = styled.img`
  width: 100%;
  height: 240px;
  object-fit: cover;
  transition: transform 0.3s ease;
  background: linear-gradient(45deg, #f3f4f6, #e5e7eb);

  ${ImageCard}:hover & {
    transform: scale(1.05);
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  padding: 1rem;
  font-weight: 600;
  font-size: 0.9rem;
  transform: translateY(100%);
  transition: transform 0.3s ease;

  ${ImageCard}:hover & {
    transform: translateY(0);
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const InfoCard = styled.div`
  background: linear-gradient(135deg, rgba(248, 250, 252, 0.8), rgba(241, 245, 249, 0.8));
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.6s ease-out;
  animation-delay: ${props => (props.index * 0.05)}s;
  animation-fill-mode: both;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    border-color: rgba(59, 130, 246, 0.3);
  }
`;

const InfoLabel = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  word-break: break-all;
`;

const CategoriesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const CategoryTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
  color: #3b82f6;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  border: 1px solid rgba(59, 130, 246, 0.2);
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.6s ease-out;
  animation-delay: ${props => (props.index * 0.05)}s;
  animation-fill-mode: both;

  &::before {
    content: '${props => props.icon}';
    font-size: 1rem;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.2);
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.15));
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1rem;
    font-size: 0.8rem;
  }
`;

const MessageSection = styled.div`
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05));
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid rgba(59, 130, 246, 0.1);
  position: relative;

  &::before {
    content: '💬';
    position: absolute;
    top: -10px;
    left: 1.5rem;
    background: white;
    padding: 0.5rem;
    border-radius: 50%;
    font-size: 1.2rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const MessageText = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #374151;
  white-space: pre-line;
  font-weight: 500;
  margin-top: 0.5rem;
`;

const PartnerButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border-radius: 16px;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  animation: ${pulse} 2s infinite;

  &::before {
    content: '🤝';
    font-size: 1.3rem;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover::after {
    left: 100%;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(59, 130, 246, 0.4);
    animation: none;
  }

  &:active {
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(226, 232, 240, 0.8);
`;

const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  margin-bottom: 1.5rem;
`;

const LoadingText = styled.p`
  color: #6b7280;
  font-size: 1.1rem;
  font-weight: 500;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(226, 232, 240, 0.8);
  text-align: center;
`;

const ErrorIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  border: 1px solid #fecaca;

  &::before {
    content: '⚠️';
  }
`;

const ErrorText = styled.p`
  color: #dc2626;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const ErrorButton = styled.button`
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 24px;
  padding: 3rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(226, 232, 240, 0.8);
  position: relative;
  animation: ${modalSlideIn} 0.3s ease-out;

  @media (max-width: 768px) {
    padding: 2rem;
    margin: 1rem;
  }
`;

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
  text-align: center;

  &::before {
    content: '💌';
    margin-right: 0.5rem;
  }
`;

const ModalTextarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.6;
  resize: vertical;
  transition: border-color 0.3s ease;
  margin-bottom: 1rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ModalButton = styled.button`
  padding: 0.75rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  cursor: pointer;

  ${props => props.primary ? `
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
    }
  ` : `
    background: rgba(255, 255, 255, 0.9);
    color: #374151;
    border: 1px solid #e5e7eb;
    
    &:hover {
      background: #f9fafb;
      border-color: #d1d5db;
    }
  `}

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ErrorMessageModal = styled.p`
  color: #dc2626;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  border: 1px solid #fecaca;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '⚠️';
  }
`;

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [partnerMessage, setPartnerMessage] = useState('');
  const [partnerError, setPartnerError] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        await api.get('/stores/me/');
      } catch (err) {
        navigate('/store/create');
        return;
      }

      try {
        setLoading(true);
        const res = await api.get(`/posts/${id}/`);
        setPost(res.data.data);
        setError(null);
      } catch (err) {
        console.error('게시글 불러오기 실패:', err);
        setError(extractFirstError(err, '존재하지 않는 게시글이거나 오류가 발생했습니다.'));
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [id, navigate]);

  const handlePartnerRequest = async () => {
    if (!partnerMessage.trim()) {
      setPartnerError('메시지를 입력해주세요.');
      return;
    }

    try {
      await api.post('/notifications/partner-request/', {
        post: post.id,
        message: partnerMessage,
      });

      alert('제휴 요청이 전송되었습니다.');
      setIsModalOpen(false);
      setPartnerMessage('');
      setPartnerError('');
    } catch (err) {
      setPartnerError(extractFirstError(err, '제휴 요청 중 오류가 발생했습니다.'));
    }
  };

  if (error) {
    return (
      <>
        <GlobalStyle />
        <Container>
          <ContentWrapper>
            <ErrorContainer>
              <ErrorIcon />
              <ErrorText>{error}</ErrorText>
              <ErrorButton onClick={() => navigate('/main')}>
                목록으로 돌아가기
              </ErrorButton>
            </ErrorContainer>
          </ContentWrapper>
        </Container>
      </>
    );
  }

  if (loading || !post) {
    return (
      <>
        <GlobalStyle />
        <Container>
          <ContentWrapper>
            <LoadingContainer>
              <LoadingSpinner />
              <LoadingText>게시글을 불러오는 중...</LoadingText>
            </LoadingContainer>
          </ContentWrapper>
        </Container>
      </>
    );
  }

  return (
    <>
      <GlobalStyle />
      <Container>
        <ContentWrapper>
          <HeaderSection>
            <BackButton onClick={() => navigate('/main')}>
              목록으로 돌아가기
            </BackButton>
            <PostTitle>{post.title}</PostTitle>
            <PostMeta>
              <MetaItem icon="🏪">가게명: {post.store_name}</MetaItem>
              <MetaItem icon="📍">위치: {post.address}</MetaItem>
              <MetaItem icon="📞">연락처: {post.phone_number}</MetaItem>
            </PostMeta>
          </HeaderSection>

          <ContentSection delay="0.1s">
            <SectionTitle>매장 이미지</SectionTitle>
            <SectionContent>
              <ImagesGrid>
                {(post.images.length > 0 ? post.images : [{ image_url: defaultImage }]).map((img, i) => (
                  <ImageCard key={i} index={i}>
                    <StyledImage
                      src={img.image_url}
                      alt={`${post.store_name} 이미지 ${i + 1}`}
                      onError={(e) => {
                        e.target.src = defaultImage;
                      }}
                    />
                    <ImageOverlay>
                      매장 사진 {i + 1}
                    </ImageOverlay>
                  </ImageCard>
                ))}
              </ImagesGrid>
            </SectionContent>
          </ContentSection>

          <ContentSection delay="0.2s">
            <SectionTitle>가게 정보</SectionTitle>
            <SectionContent>
              <InfoGrid>
                <InfoCard index={0}><InfoLabel>가게 이름</InfoLabel><InfoValue>{post.store_name}</InfoValue></InfoCard>
                <InfoCard index={1}><InfoLabel>주소</InfoLabel><InfoValue>{post.address}</InfoValue></InfoCard>
                <InfoCard index={2}><InfoLabel>전화번호</InfoLabel><InfoValue>{post.phone_number}</InfoValue></InfoCard>
                <InfoCard index={3}><InfoLabel>연락 가능 시간</InfoLabel><InfoValue>{post.available_time}</InfoValue></InfoCard>
              </InfoGrid>
            </SectionContent>
          </ContentSection>

          <ContentSection delay="0.3s">
            <SectionTitle>가게 소개</SectionTitle>
            <SectionContent>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#374151', whiteSpace: 'pre-line' }}>
                {post.description}
              </p>
            </SectionContent>
          </ContentSection>

          <ContentSection delay="0.35s">
            <SectionTitle>사업장 카테고리</SectionTitle>
            <SectionContent>
              <CategoriesList>
                {post.store_categories.map((cat, i) => (
                  <CategoryTag key={i} index={i} icon="🏷️">
                    {cat.name}
                  </CategoryTag>
                ))}
              </CategoriesList>
            </SectionContent>
          </ContentSection>

          <ContentSection delay="0.4s">
            <SectionTitle>제휴 희망 카테고리</SectionTitle>
            <SectionContent>
              <CategoriesList>
                {post.partnership_categories.map((cat, i) => (
                  <CategoryTag key={i} index={i} icon="🤝">
                    {cat.name}
                  </CategoryTag>
                ))}
              </CategoriesList>
            </SectionContent>
          </ContentSection>

          {post.extra_message && (
            <ContentSection delay="0.5s">
              <SectionTitle>사업주의 한마디</SectionTitle>
              <SectionContent>
                <MessageSection>
                  <MessageText>{post.extra_message}</MessageText>
                </MessageSection>
              </SectionContent>
            </ContentSection>
          )}

          <ContentSection delay="0.6s" style={{ textAlign: 'center' }}>
            <SectionTitle style={{ justifyContent: 'center' }}>문의하기</SectionTitle>
            <SectionContent>
              <p style={{ marginBottom: '24px', fontSize: '1.1rem', color: '#64748b' }}>
                이 매장과 제휴를 원하신다면 아래 연락처로 직접 문의해주세요.
              </p>
              <InfoGrid style={{ maxWidth: '600px', margin: '0 auto' }}>
                <InfoCard><InfoLabel>📞 전화 문의</InfoLabel><InfoValue>{post.phone_number}</InfoValue></InfoCard>
                <InfoCard><InfoLabel>⏰ 연락 시간</InfoLabel><InfoValue>{post.available_time}</InfoValue></InfoCard>
              </InfoGrid>
            </SectionContent>
          </ContentSection>

          <ContentSection delay="0.7s" style={{ textAlign: 'center' }}>
            <PartnerButton onClick={() => setIsModalOpen(true)}>제휴 맺어요</PartnerButton>
          </ContentSection>

          {isModalOpen && (
            <Modal>
              <ModalContent>
                <ModalTitle>제휴 요청 메시지</ModalTitle>
                <ModalTextarea
                  placeholder="제휴를 요청하고 싶은 메시지를 입력해주세요."
                  value={partnerMessage}
                  onChange={(e) => setPartnerMessage(e.target.value)}
                />
                {partnerError && <ErrorMessageModal>{partnerError}</ErrorMessageModal>}
                <ModalActions>
                  <ModalButton onClick={() => setIsModalOpen(false)}>취소</ModalButton>
                  <ModalButton primary onClick={handlePartnerRequest}>보내기</ModalButton>
                </ModalActions>
              </ModalContent>
            </Modal>
          )}
        </ContentWrapper>
      </Container>
    </>
  );
}

export default PostDetail;