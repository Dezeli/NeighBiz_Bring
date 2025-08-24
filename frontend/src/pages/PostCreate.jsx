import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
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
    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
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
  font-size: 1.8rem;
  font-weight: 800;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;

  span {
    color: #fbbf24;
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
`;

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
  animation: ${fadeInUp} 0.8s ease-out;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const FormCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(226, 232, 240, 0.8);
  backdrop-filter: blur(20px);
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
  background: linear-gradient(135deg, rgba(248, 250, 252, 0.8), rgba(255, 255, 255, 0.9));
  border-bottom: 1px solid rgba(226, 232, 240, 0.5);

  @media (max-width: 768px) {
    padding: 2rem 1.5rem 1rem;
  }
`;

const FormTitle = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const FormSubtitle = styled.p`
  color: #6b7280;
  font-size: 1rem;
  font-weight: 500;
`;

const FormBody = styled.form`
  padding: 2.5rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const Section = styled.div`
  margin-bottom: 2.5rem;
  animation: ${slideIn} 0.6s ease-out;
  animation-delay: ${props => props.delay || '0s'};
  animation-fill-mode: both;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '';
    width: 3px;
    height: 20px;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    border-radius: 2px;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  .required {
    color: #ef4444;
    font-size: 0.8rem;
  }
`;

const Input = styled.input`
  padding: 1rem 1.25rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  color: #1f2937;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &::placeholder {
    color: #9ca3af;
    font-weight: 400;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    background: white;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    transform: translateY(-1px);
  }

  &:hover {
    border-color: #d1d5db;
  }
`;

const TextArea = styled.textarea`
  padding: 1rem 1.25rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  color: #1f2937;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  resize: vertical;
  min-height: 120px;
  font-family: inherit;

  &::placeholder {
    color: #9ca3af;
    font-weight: 400;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    background: white;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    transform: translateY(-1px);
  }

  &:hover {
    border-color: #d1d5db;
  }
`;

const FileUploadArea = styled.div`
  border: 2px dashed #d1d5db;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  background: rgba(248, 250, 252, 0.5);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: #3b82f6;
    background: rgba(59, 130, 246, 0.05);
  }

  &.dragover {
    border-color: #3b82f6;
    background: rgba(59, 130, 246, 0.1);
    transform: scale(1.02);
  }

  input[type="file"] {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }
`;

const FileUploadContent = styled.div`
  pointer-events: none;

  .upload-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    display: block;
  }

  h4 {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }

  p {
    color: #6b7280;
    font-size: 0.9rem;
    line-height: 1.5;
  }
`;

const ImagePreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ImagePreview = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  background: #f3f4f6;
  border: 2px solid #e5e7eb;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .thumbnail-badge {
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
    font-size: 0.7rem;
    font-weight: 600;
  }
`;

const CategorySection = styled.div`
  background: rgba(248, 250, 252, 0.6);
  border-radius: 16px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  padding: 1.5rem;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
`;

const CategoryButton = styled.button`
  padding: 0.75rem 1rem;
  background: ${({ selected, $variant }) => 
    selected 
      ? $variant === 'store'
        ? 'linear-gradient(135deg, #10b981, #059669)' 
        : 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
      : 'rgba(255, 255, 255, 0.8)'};
  color: ${({ selected }) => (selected ? 'white' : '#374151')};
  border-radius: 10px;
  font-weight: ${({ selected }) => (selected ? '600' : '500')};
  font-size: 0.85rem;
  transition: all 0.3s ease;
  border: 1px solid ${({ selected }) => (selected ? 'transparent' : '#e5e7eb')};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ selected, $variant }) => 
      selected 
        ? $variant === 'store'
          ? '0 8px 25px rgba(16, 185, 129, 0.4)'
          : '0 8px 25px rgba(59, 130, 246, 0.4)'
        : '0 8px 25px rgba(0, 0, 0, 0.1)'};
    border-color: ${({ selected }) => (selected ? 'transparent' : '#d1d5db')};
  }

  &:active {
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 0.6rem 0.8rem;
    font-size: 0.8rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(226, 232, 240, 0.8);

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    gap: 0.75rem;
  }
`;

const SubmitButton = styled.button`
  padding: 1rem 2rem;
  background: ${props => 
    props.disabled 
      ? 'linear-gradient(135deg, #9ca3af, #6b7280)' 
      : 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
  };
  color: white;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  position: relative;
  overflow: hidden;
  min-width: 140px;

  ${props => !props.disabled && `
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
    }

    &:active {
      transform: translateY(0);
    }
  `}

  .spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid white;
    border-radius: 50%;
    animation: ${spin} 0.8s linear infinite;
    margin-right: 0.5rem;
  }
`;

const CancelButton = styled.button`
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.9);
  color: #374151;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e5e7eb;
  backdrop-filter: blur(10px);
  min-width: 140px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border-color: #d1d5db;
    background: white;
  }

  &:active {
    transform: translateY(0);
  }
`;

const ErrorMessage = styled.div`
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-weight: 500;
  font-size: 0.9rem;
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  animation: ${fadeIn} 0.3s ease-out;

  &::before {
    content: '⚠️';
    font-size: 1.2rem;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: ${props => props.columns || '1fr 1fr'};
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

const SelectedCount = styled.div`
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 1px solid rgba(59, 130, 246, 0.2);
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #1f2937;
  font-weight: 600;

  .count {
    color: #3b82f6;
    font-weight: 700;
  }
`;

function PostCreate() {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedStoreCategories, setSelectedStoreCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    store_name: '',
    description: '',
    address: '',
    phone_number: '',
    available_time: '',
    extra_message: '',
  });

  useEffect(() => {
    const init = async () => {
      try {
        await api.get('/stores/me/');
      } catch {
        navigate('/store/create');
        return;
      }

      try {
        const res = await api.get('/posts/categories/');
        setCategories(res.data.data);
      } catch (err) {
        setError(extractFirstError(err) || '카테고리 불러오기에 실패했습니다.');
      }
    };
    init();
  }, [navigate]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setImages(files);
    const previewUrls = files.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(previewUrls);
  };

  const toggleCategory = (catId) => {
    setSelectedCategories(prev =>
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  };

  const toggleStoreCategory = (catId) => {
    setSelectedStoreCategories(prev =>
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    if (window.confirm('작성 중인 내용이 사라집니다. 정말 취소하시겠습니까?')) {
      navigate('/main');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const requiredFields = {
      title: '제목을 입력해주세요.',
      store_name: '가게명을 입력해주세요.',
      description: '가게 소개를 입력해주세요.',
      address: '주소를 입력해주세요.',
      phone_number: '전화번호를 입력해주세요.',
      available_time: '연락 가능 시간을 입력해주세요.',
    };

    for (const field in requiredFields) {
      if (!form[field]?.trim()) {
        setError(requiredFields[field]);
        return;
      }
    }

    if (images.length === 0) {
      setError('이미지는 최소 1장 이상 업로드해야 합니다.');
      return;
    }

    if (images.length > 5) {
      setError('이미지는 최대 5장까지만 업로드할 수 있습니다.');
      return;
    }

    if (selectedCategories.length === 0) {
      setError('제휴 카테고리를 최소 1개 이상 선택해주세요.');
      return;
    }

    if (selectedStoreCategories.length === 0) {
      setError('사업장 카테고리를 최소 1개 이상 선택해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const uploadUrls = await Promise.all(
        images.map(file =>
          api.post('/posts/image-upload/', {
            filename: file.name,
            content_type: file.type,
          })
        )
      );
      const uploadLinks = uploadUrls.map(res => res.data.data);

      await Promise.all(
        images.map((file, i) =>
          fetch(uploadLinks[i].upload_url, {
            method: 'PUT',
            body: file,
            headers: { 'Content-Type': file.type },
          })
        )
      );

      const imageData = uploadLinks.map((link, index) => ({
        image_url: link.image_url,
        is_thumbnail: index === 0,
      }));

      await api.post('/posts/', {
        ...form,
        images: imageData,
        store_categories: selectedStoreCategories,
        partnership_categories: selectedCategories,
      });

      alert('게시글이 성공적으로 등록되었습니다!');
      navigate('/main');
    } catch (err) {
      console.error('게시글 등록 실패:', err);
      setError(extractFirstError(err) || '업로드에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Header>
          <HeaderContent>
            <Logo>
              Neigh<span>biz</span>
            </Logo>
            <BackButton onClick={() => navigate('/main')}>
              ← 메인으로 돌아가기
            </BackButton>
          </HeaderContent>
        </Header>

        <FormContainer>
          <FormCard>
            <FormHeader>
              <FormTitle>제휴 제안서 작성</FormTitle>
              <FormSubtitle>사업장 정보와 제휴 조건을 정확히 입력해주세요</FormSubtitle>
            </FormHeader>

            <FormBody onSubmit={handleSubmit}>
              <Section delay="0.1s">
                <SectionTitle>기본 정보</SectionTitle>
                <FormRow>
                  <InputGroup>
                    <Label>
                      제목 <span className="required">*</span>
                    </Label>
                    <Input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="제휴 제안서 제목을 입력하세요"
                    />
                  </InputGroup>
                  <InputGroup>
                    <Label>
                      사업장명 <span className="required">*</span>
                    </Label>
                    <Input
                      name="store_name"
                      value={form.store_name}
                      onChange={handleChange}
                      placeholder="사업장 이름을 입력하세요"
                    />
                  </InputGroup>
                </FormRow>

                <InputGroup>
                  <Label>
                    사업장 소개 <span className="required">*</span>
                  </Label>
                  <TextArea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="사업장에 대한 상세한 소개를 작성해주세요"
                  />
                </InputGroup>
              </Section>

              <Section delay="0.2s">
                <SectionTitle>연락처 정보</SectionTitle>
                <InputGroup>
                  <Label>
                    주소 <span className="required">*</span>
                  </Label>
                  <Input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="사업장 주소를 입력하세요"
                  />
                </InputGroup>

                <FormRow>
                  <InputGroup>
                    <Label>
                      전화번호 <span className="required">*</span>
                    </Label>
                    <Input
                      name="phone_number"
                      value={form.phone_number}
                      onChange={handleChange}
                      placeholder="연락 가능한 전화번호"
                    />
                  </InputGroup>
                  <InputGroup>
                    <Label>
                      연락 가능 시간 <span className="required">*</span>
                    </Label>
                    <Input
                      name="available_time"
                      value={form.available_time}
                      onChange={handleChange}
                      placeholder="예: 평일 09:00-18:00"
                    />
                  </InputGroup>
                </FormRow>

                <InputGroup>
                  <Label>추가 메시지</Label>
                  <TextArea
                    name="extra_message"
                    value={form.extra_message}
                    onChange={handleChange}
                    placeholder="제휴 파트너에게 전하고 싶은 추가 메시지가 있다면 작성해주세요"
                  />
                </InputGroup>
              </Section>

              <Section delay="0.3s">
                <SectionTitle>이미지 업로드</SectionTitle>
                <FileUploadArea>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                  />
                  <FileUploadContent>
                    <span className="upload-icon">📸</span>
                    <h4>사업장 이미지를 업로드하세요</h4>
                    <p>
                      최대 5장까지 업로드 가능합니다.<br />
                      첫 번째 이미지가 대표 이미지로 설정됩니다.
                    </p>
                  </FileUploadContent>
                </FileUploadArea>
                  {imagePreviewUrls.length > 0 && (
                  <ImagePreviewGrid>
                    {imagePreviewUrls.map((url, index) => (
                      <ImagePreview key={index}>
                        <img src={url} alt={`미리보기 ${index + 1}`} />
                        {index === 0 && (
                          <div className="thumbnail-badge">대표 이미지</div>
                        )}
                      </ImagePreview>
                    ))}
                  </ImagePreviewGrid>
                )}
              </Section>

              <Section delay="0.4s">
                <SectionTitle>사업장 카테고리 선택</SectionTitle>
                <CategorySection>
                  <CategoryGrid>
                    {categories.map(cat => (
                      <CategoryButton
                        key={`store-${cat.id}`}
                        type="button"
                        onClick={() => toggleStoreCategory(cat.id)}
                        selected={selectedStoreCategories.includes(cat.id)}
                        $variant="store"
                      >
                        {selectedStoreCategories.includes(cat.id) ? '✅' : '⬜'} {cat.name}
                      </CategoryButton>
                    ))}
                  </CategoryGrid>
                  <SelectedCount>
                    선택된 카테고리: <span className="count">{selectedStoreCategories.length}</span>개
                  </SelectedCount>
                </CategorySection>
              </Section>

              <Section delay="0.5s">
                <SectionTitle>제휴 희망 카테고리 선택</SectionTitle>
                <CategorySection>
                  <CategoryGrid>
                    {categories.map(cat => (
                      <CategoryButton
                        key={`partnership-${cat.id}`}
                        type="button"
                        onClick={() => toggleCategory(cat.id)}
                        selected={selectedCategories.includes(cat.id)}
                        $variant="partnership"
                      >  
                        {selectedCategories.includes(cat.id) ? '✅' : '⬜'} {cat.name}
                      </CategoryButton>
                    ))}
                  </CategoryGrid>
                  <SelectedCount>
                    선택된 카테고리: <span className="count">{selectedCategories.length}</span>개
                  </SelectedCount>
                </CategorySection>
              </Section>

              {error && <ErrorMessage>{error}</ErrorMessage>}

              <ButtonGroup>
                <CancelButton type="button" onClick={handleCancel}>
                  취소
                </CancelButton>
                <SubmitButton type="submit" disabled={isSubmitting}>
                  {isSubmitting && <span className="spinner" />} 등록
                </SubmitButton>
              </ButtonGroup>
            </FormBody>
          </FormCard>
        </FormContainer>
      </Container>
    </>
  );
}

export default PostCreate;
