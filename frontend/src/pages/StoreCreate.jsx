import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import api from '../lib/axios';
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

  input, textarea {
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

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    padding: 0 1rem;
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
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  span {
    color: #fbbf24;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const BackButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  color: #374151;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e5e7eb;
  backdrop-filter: blur(10px);

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

const MainContent = styled.main`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
  animation: ${fadeInUp} 0.8s ease-out;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const FormContainer = styled.div`
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(226, 232, 240, 0.8);
  overflow: hidden;
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
`;

const FormHeader = styled.div`
  padding: 2.5rem 2.5rem 1.5rem;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05));
  border-bottom: 1px solid rgba(226, 232, 240, 0.5);
  text-align: center;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem 1rem;
  }
`;

const FormTitle = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 0.75rem;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;

  &::before {
    content: '🏪';
    font-size: 2.2rem;
    animation: ${float} 3s ease-in-out infinite;
  }

  @media (max-width: 768px) {
    font-size: 1.6rem;
  }
`;

const FormSubtitle = styled.p`
  font-size: 1.1rem;
  color: #6b7280;
  font-weight: 500;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const Form = styled.form`
  padding: 2.5rem;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

const FormSection = styled.div`
  margin-bottom: 2rem;
  animation: ${slideIn} 0.6s ease-out;
  animation-delay: ${props => props.delay || '0s'};
  animation-fill-mode: both;

  &:last-child {
    margin-bottom: 0;
  }
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 0.95rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: ${props => props.icon ? `'${props.icon}'` : 'none'};
    font-size: 1.1rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  font-size: 1rem;
  color: #1f2937;
  background: rgba(248, 250, 252, 0.8);
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(5px);

  &:focus {
    outline: none;
    border-color: #3b82f6;
    background: white;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    transform: translateY(-1px);
  }

  &::placeholder {
    color: #9ca3af;
    font-weight: 400;
  }

  &:hover:not(:focus) {
    border-color: #d1d5db;
    background: rgba(255, 255, 255, 0.9);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.875rem 1rem;
  font-size: 1rem;
  color: #1f2937;
  background: rgba(248, 250, 252, 0.8);
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(5px);
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  line-height: 1.6;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    background: white;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    transform: translateY(-1px);
  }

  &::placeholder {
    color: #9ca3af;
    font-weight: 400;
  }

  &:hover:not(:focus) {
    border-color: #d1d5db;
    background: rgba(255, 255, 255, 0.9);
  }
`;

const CategorySection = styled.div`
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05));
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid rgba(59, 130, 246, 0.1);
`;

const CategoryTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '🏷️';
    font-size: 1.2rem;
  }
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CategoryOption = styled.label`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background: ${props => props.checked ? 
    'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 
    'rgba(255, 255, 255, 0.8)'
  };
  color: ${props => props.checked ? 'white' : '#374151'};
  border: 2px solid ${props => props.checked ? 'transparent' : '#e5e7eb'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: ${props => props.checked ? '600' : '500'};
  font-size: 0.9rem;
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
    box-shadow: ${props => props.checked ? 
      '0 8px 25px rgba(59, 130, 246, 0.4)' : 
      '0 8px 25px rgba(0, 0, 0, 0.1)'
    };
    border-color: ${props => props.checked ? 'transparent' : '#d1d5db'};
  }

  &:active {
    transform: translateY(0);
  }

  input {
    display: none;
  }

  span {
    margin-left: 0.5rem;
    position: relative;
    z-index: 1;
  }
`;

const CheckIcon = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 4px;
  background: ${props => props.checked ? 'white' : 'transparent'};
  border: 2px solid ${props => props.checked ? 'transparent' : '#d1d5db'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;

  &::after {
    content: '✓';
    color: #3b82f6;
    font-weight: 700;
    font-size: 0.8rem;
    opacity: ${props => props.checked ? 1 : 0};
    transform: scale(${props => props.checked ? 1 : 0.3});
    transition: all 0.2s ease;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem 2rem;
  background: ${props => props.disabled ? 
    'linear-gradient(135deg, #9ca3af, #6b7280)' :
    'linear-gradient(135deg, #3b82f6, #1d4ed8)'
  };
  color: white;
  border-radius: 16px;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 0.5px;

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
    left: ${props => props.disabled ? '-100%' : '100%'};
  }

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(59, 130, 246, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.7;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: ${spin} 0.8s linear infinite;
  margin-right: 0.5rem;
`;

const ErrorMessage = styled.div`
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-weight: 500;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  animation: ${fadeIn} 0.3s ease-out;

  &::before {
    content: '⚠️';
    font-size: 1.2rem;
    flex-shrink: 0;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(226, 232, 240, 0.5);
  border-radius: 2px;
  margin-bottom: 2rem;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 2px;
  transition: width 0.3s ease;
  width: ${props => props.progress}%;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    animation: ${shimmer} 2s linear infinite;
  }
`;

const RequiredAsterisk = styled.span`
  color: #ef4444;
  margin-left: 0.25rem;
  font-weight: 700;
`;

const HelpText = styled.p`
  font-size: 0.85rem;
  color: #6b7280;
  margin-top: 0.5rem;
  line-height: 1.5;
  padding-left: 1.5rem;
  position: relative;

  &::before {
    content: '💡';
    position: absolute;
    left: 0;
    top: 0;
  }
`;

function StoreCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    address: '',
    phone_number: '',
    available_time: '',
    categories: [],
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const calculateProgress = () => {
    const fields = ['name', 'address', 'phone_number', 'available_time'];
    const filledFields = fields.filter(field => form[field].trim()).length;
    const categorySelected = form.categories.length > 0 ? 1 : 0;
    return ((filledFields + categorySelected) / (fields.length + 1)) * 100;
  };

  useEffect(() => {
    api.get('/posts/categories/')
      .then(res => setCategories(res.data.data))
      .catch(() => setCategories([]));
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleCategoryToggle = (id) => {
    setForm(prev => {
      const exists = prev.categories.includes(id);
      const updated = exists
        ? prev.categories.filter(cat => cat !== id)
        : [...prev.categories, id];
      return { ...prev, categories: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) {
      setError('상호명을 입력해주세요.');
      return;
    }
    if (!form.address.trim()) {
      setError('주소를 입력해주세요.');
      return;
    }
    if (!form.phone_number.trim()) {
      setError('매장 연락처를 입력해주세요.');
      return;
    }
    if (!form.available_time.trim()) {
      setError('연락 가능 시간을 입력해주세요.');
      return;
    }
    if (form.categories.length === 0) {
      setError('희망 제휴 카테고리를 1개 이상 선택해주세요.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/stores/', form);
      navigate('/main');
    } catch (err) {
      setError(extractFirstError(err, '가게 등록에 실패했습니다.'));
    } finally {
      setLoading(false);
    }
  };

  const handleBackToMain = () => {
    navigate('/main');
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Header>
          <HeaderContent>
            <Logo onClick={handleBackToMain}>
              Neigh<span>biz</span>
            </Logo>
            <BackButton onClick={handleBackToMain}>
              ← 메인으로
            </BackButton>
          </HeaderContent>
        </Header>

        <MainContent>
          <FormContainer>
            <FormHeader>
              <FormTitle>가게 정보 등록</FormTitle>
              <FormSubtitle>
                네이비즈에서 제휴 파트너를 찾아보세요!<br />
                정확한 정보 입력으로 더 나은 매칭을 경험하실 수 있습니다.
              </FormSubtitle>
            </FormHeader>

            <Form onSubmit={handleSubmit}>
              <ProgressBar>
                <ProgressFill progress={calculateProgress()} />
              </ProgressBar>

              {error && <ErrorMessage>{error}</ErrorMessage>}

              <FormSection delay="0.1s">
                <InputGroup>
                  <Label icon="🏪">
                    상호명<RequiredAsterisk>*</RequiredAsterisk>
                  </Label>
                  <Input
                    name="name"
                    placeholder="예: 맛있는 김밥천국"
                    value={form.name}
                    onChange={handleChange}
                  />
                  <HelpText>고객이 쉽게 찾을 수 있도록 정확한 상호명을 입력해주세요.</HelpText>
                </InputGroup>

                <InputGroup>
                  <Label icon="📝">
                    가게 소개
                  </Label>
                  <Textarea
                    name="description"
                    placeholder="우리 가게의 특별한 점, 주력 메뉴, 서비스 등을 소개해주세요."
                    value={form.description}
                    onChange={handleChange}
                  />
                  <HelpText>매력적인 소개로 더 많은 제휴 기회를 만들어보세요.</HelpText>
                </InputGroup>
              </FormSection>

              <FormSection delay="0.2s">
                <InputGroup>
                  <Label icon="📍">
                    주소<RequiredAsterisk>*</RequiredAsterisk>
                  </Label>
                  <Input
                    name="address"
                    placeholder="예: 서울특별시 강남구 테헤란로 123"
                    value={form.address}
                    onChange={handleChange}
                  />
                  <HelpText>정확한 주소로 근처 사업자와의 제휴 기회를 높여보세요.</HelpText>
                </InputGroup>

                <InputGroup>
                  <Label icon="📞">
                    매장 연락처<RequiredAsterisk>*</RequiredAsterisk>
                  </Label>
                  <Input
                    name="phone_number"
                    placeholder="예: 02-1234-5678"
                    value={form.phone_number}
                    onChange={handleChange}
                  />
                  <HelpText>제휴 문의를 받을 수 있는 연락처를 입력해주세요.</HelpText>
                </InputGroup>
              </FormSection>

              <FormSection delay="0.3s">
                <InputGroup>
                  <Label icon="⏰">
                    연락 가능 시간<RequiredAsterisk>*</RequiredAsterisk>
                  </Label>
                  <Input
                    name="available_time"
                    placeholder="예: 평일 10:00~18:00, 주말 11:00~17:00"
                    value={form.available_time}
                    onChange={handleChange}
                  />
                  <HelpText>제휴 상담이 가능한 시간대를 자세히 알려주세요.</HelpText>
                </InputGroup>
              </FormSection>

              <FormSection delay="0.4s">
                <CategorySection>
                  <CategoryTitle>내 가게 카테고리<RequiredAsterisk>*</RequiredAsterisk></CategoryTitle>
                  <CategoryGrid>
                    {categories.map(cat => (
                      <CategoryOption
                        key={cat.id}
                        checked={form.categories.includes(cat.id)}
                        onClick={() => handleCategoryToggle(cat.id)}
                      >
                        <input
                          type="checkbox"
                          checked={form.categories.includes(cat.id)}
                          onChange={() => handleCategoryToggle(cat.id)}
                        />
                        <CheckIcon checked={form.categories.includes(cat.id)} />
                        <span>{cat.name}</span>
                      </CategoryOption>
                    ))}
                  </CategoryGrid>
                  <HelpText>관심 있는 제휴 분야를 모두 선택해주세요. 더 많은 기회를 얻을 수 있습니다.</HelpText>
                </CategorySection>
              </FormSection>

              <FormSection delay="0.5s">
                <SubmitButton type="submit" disabled={loading}>
                  {loading && <LoadingSpinner />}
                  {loading ? '등록 중...' : '등록하기'}
                </SubmitButton>
              </FormSection>
            </Form>
          </FormContainer>
        </MainContent>
      </Container>
    </>
  );
}

export default StoreCreate;