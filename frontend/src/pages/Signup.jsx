import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  25% {
    transform: translateY(-20px) rotate(5deg);
  }
  50% {
    transform: translateY(-10px) rotate(-5deg);
  }
  75% {
    transform: translateY(-30px) rotate(3deg);
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

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
  }
  70% {
    box-shadow: 0 0 0 20px rgba(59, 130, 246, 0);
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

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  background-size: 400% 400%;
  animation: ${gradientShift} 15s ease infinite;
  overflow: hidden;
`;

const FloatingElement = styled.div`
  position: absolute;
  width: ${props => props.size};
  height: ${props => props.size};
  background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.3));
  border-radius: 50%;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  top: ${props => props.top};
  left: ${props => props.left};
  animation: ${float} ${props => props.duration} ease-in-out infinite;
  animation-delay: ${props => props.delay};
  z-index: 1;
`;

const LeftPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4rem 2rem;
  position: relative;
  z-index: 2;
  color: white;
  text-align: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const RightPanel = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    flex: none;
    width: 100%;
    min-height: 100vh;
  }
`;

const BrandSection = styled.div`
  animation: ${slideInLeft} 1s ease-out;
  max-width: 500px;
`;

const Logo = styled.div`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 2rem;
  letter-spacing: -0.02em;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);

  span {
    color: #fbbf24;
  }
`;

const BrandTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

const BrandSubtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateX(10px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 1.5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
`;

const FeatureText = styled.span`
  font-weight: 500;
  font-size: 1rem;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: 3rem;
  border-radius: 24px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 550px;
  width: 100%;
  position: relative;
  overflow: hidden;
  animation: ${slideInRight} 1s ease-out;
  max-height: 90vh;
  overflow-y: auto;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    border-radius: 10px;
  }

  @media (max-width: 768px) {
    margin: 2rem;
    padding: 2rem;
    max-width: none;
    max-height: none;
  }
`;

const CardHeader = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 1rem;
  font-weight: 500;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  letter-spacing: -0.01em;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  gap: 0.75rem;
  align-items: stretch;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  color: #1f2937;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    transform: translateY(-1px);
  }

  &:hover {
    border-color: #d1d5db;
  }

  &::placeholder {
    color: #9ca3af;
  }

  &:disabled {
    background: #f9fafb;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const FlexInput = styled(Input)`
  flex: 1;
`;

const ActionButton = styled.button`
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #059669, #065f46);
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  min-width: 140px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 25px rgba(5, 150, 105, 0.4);
    background: linear-gradient(135deg, #047857, #064e3b);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: linear-gradient(135deg, #9ca3af, #6b7280);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  margin-top: 0.5rem;

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
    box-shadow: 0 15px 35px rgba(59, 130, 246, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: linear-gradient(135deg, #9ca3af, #6b7280);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;

    &:hover::before {
      left: -100%;
    }
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s ease-in-out infinite;
  margin-right: 0.5rem;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Message = styled.div`
  padding: 1rem 1.25rem;
  border-radius: 12px;
  font-weight: 500;
  font-size: 0.95rem;
  animation: ${fadeIn} 0.3s ease-out;
  border: 1px solid;
  margin-top: 0.75rem;
  
  ${({ type }) => {
    if (type === 'error') {
      return `
        color: #dc2626;
        background: linear-gradient(135deg, #fef2f2, #fee2e2);
        border-color: #fecaca;
      `;
    } else if (type === 'success') {
      return `
        color: #16a34a;
        background: linear-gradient(135deg, #f0fdf4, #dcfce7);
        border-color: #bbf7d0;
      `;
    } else {
      return `
        color: #2563eb;
        background: linear-gradient(135deg, #eff6ff, #dbeafe);
        border-color: #bfdbfe;
      `;
    }
  }}
`;

const ImageUploadSection = styled.div`
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  background: #f9fafb;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: #3b82f6;
    background: #eff6ff;
    transform: translateY(-2px);
  }

  &.has-image {
    border-color: #10b981;
    background: #f0fdf4;
  }

  input[type="file"] {
    display: none;
  }
`;

const ImageUploadContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const ImageUploadIcon = styled.div`
  font-size: 3rem;
  color: #9ca3af;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;

  ${ImageUploadSection}:hover & {
    color: #3b82f6;
    transform: scale(1.1);
  }
`;

const ImageUploadText = styled.div`
  color: #6b7280;
  font-weight: 500;
  
  strong {
    color: #3b82f6;
    cursor: pointer;
  }
`;

const ImagePreview = styled.div`
  position: relative;
  margin-top: 1rem;
  animation: ${scaleIn} 0.3s ease-out;
`;

const PreviewImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 12px;
  border: 3px solid #10b981;
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #ef4444;
  color: white;
  border: 2px solid white;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
  transition: all 0.3s ease;

  &:hover {
    background: #dc2626;
    transform: scale(1.1);
  }
`;

const ProgressSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem 0;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  border-radius: 16px;
  border: 1px solid #e2e8f0;
`;

const ProgressStep = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 15px;
    left: 60%;
    width: 80%;
    height: 2px;
    background: ${props => props.completed ? '#10b981' : '#e5e7eb'};
    z-index: 1;
    
    ${props => props.isLast && 'display: none;'}
  }
`;

const StepCircle = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
  
  ${props => props.completed ? `
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
  ` : props.active ? `
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  ` : `
    background: #e5e7eb;
    color: #9ca3af;
  `}
`;

const StepLabel = styled.div`
  font-size: 0.8rem;
  font-weight: 500;
  color: ${props => props.completed || props.active ? '#374151' : '#9ca3af'};
  text-align: center;
`;

const LinksSection = styled.div`
  margin-top: 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SignupText = styled.p`
  color: #6b7280;
  font-size: 0.95rem;
  
  a {
    color: #3b82f6;
    font-weight: 600;
    transition: all 0.3s ease;
    
    &:hover {
      color: #1d4ed8;
      transform: translateY(-1px);
      display: inline-block;
    }
  }
`;

const StepsGuide = styled.div`
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border: 1px solid #f59e0b;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const GuideTitle = styled.h3`
  color: #92400e;
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const GuideList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const GuideItem = styled.li`
  color: #92400e;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;

  &::before {
    content: '✓';
    color: #16a34a;
    font-weight: 700;
  }
`;

const TrustBadges = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
`;

const TrustBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  font-weight: 500;
`;

function Signup() {
  const [form, setForm] = useState({
    username: '',
    name: '',
    email: '',
    phone_number: '',
    password: '',
    image_url: '',
  });
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [emailMsg, setEmailMsg] = useState('');
  const [codeMsg, setCodeMsg] = useState('');
  const [uploadMsg, setUploadMsg] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [codeLoading, setCodeLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      navigate('/main', { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
    if (successMsg) setSuccessMsg('');
  };

  const handleSignup = async () => {
    if (!form.username) {
      setError('아이디를 입력해주세요.');
      return;
    }
    if (!form.name) {
      setError('이름을 입력해주세요.');
      return;
    }
    if (!form.email) {
      setError('이메일을 입력해주세요.');
      return;
    }
    if (!form.phone_number) {
      setError('전화번호를 입력해주세요.');
      return;
    }
    if (!form.password) {
      setError('비밀번호를 입력해주세요.');
      return;
    }
    if (!form.image_url) {
      setError('인증 사진을 업로드해주세요.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/signup/', form);
      setSuccessMsg(res.data.message);
      setError('');
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (err) {
      const msg = extractFirstError(err) || '회원가입에 실패했습니다.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };


  const handleSendEmailCode = async () => {
    if (!form.email) {
      setEmailMsg('이메일을 먼저 입력해주세요.');
      return;
    }
    
    setEmailLoading(true);
    try {
      const res = await api.post('/auth/email-verify/send/', {
        email: form.email,
      });
      setEmailMsg(res.data.message);
    } catch (err) {
      const msg = extractFirstError(err) || '이메일 인증 요청에 실패했습니다.';
      setEmailMsg(msg);
    } finally {
      setEmailLoading(false);
    }
  };

  const handleConfirmEmailCode = async () => {
    if (!code) {
      setCodeMsg('인증코드를 입력해주세요.');
      return;
    }
    
    setCodeLoading(true);
    try {
      const res = await api.post('/auth/email-verify/confirm/', {
        email: form.email,
        code: code,
      });
      setCodeMsg(res.data.message);
    } catch (err) {
      const msg = extractFirstError(err) || '인증 코드 확인에 실패했습니다.';
      setCodeMsg(msg);
    } finally {
      setCodeLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadMsg('이미지 업로드 중...');
      const res = await api.post('/auth/image-upload/', {
        filename: file.name,
        content_type: file.type,
      });

      const { upload_url, image_url } = res.data.data;

      await fetch(upload_url, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      setForm((prev) => ({ ...prev, image_url }));
      setPreviewUrl(image_url);
      setUploadMsg('이미지 업로드 완료!');
    } catch (err) {
      const msg = extractFirstError(err) || '이미지 업로드에 실패했습니다.';
      setUploadMsg(msg);
    }
  };

  const removeImage = () => {
    setForm((prev) => ({ ...prev, image_url: '' }));
    setPreviewUrl('');
    setUploadMsg('');
  };

  const getStepStatus = (step) => {
    switch (step) {
      case 1: return form.username && form.name;
      case 2: return form.email && codeMsg && codeMsg.includes('성공');
      case 3: return form.phone_number && form.password;
      case 4: return form.image_url;
      default: return false;
    }
  };

  const getCurrentStep = () => {
    if (!form.username || !form.name) return 1;
    if (!form.email || !codeMsg || !codeMsg.includes('성공')) return 2;
    if (!form.phone_number || !form.password) return 3;
    if (!form.image_url) return 4;
    return 5;
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        {/* Floating Elements */}
        <FloatingElement size="80px" top="15%" left="8%" duration="6s" delay="0s" />
        <FloatingElement size="60px" top="25%" left="85%" duration="4s" delay="1s" />
        <FloatingElement size="40px" top="70%" left="10%" duration="5s" delay="2s" />
        <FloatingElement size="100px" top="60%" left="80%" duration="7s" delay="0.5s" />
        <FloatingElement size="50px" top="40%" left="5%" duration="4.5s" delay="1.5s" />
        <FloatingElement size="30px" top="80%" left="90%" duration="3.5s" delay="2.5s" />

        <LeftPanel>
          <BrandSection>
            <Logo>
              Neigh<span>biz</span>
            </Logo>
            <BrandTitle>
              함께 성장하는<br />
              비즈니스 파트너십
            </BrandTitle>
            <BrandSubtitle>
              신뢰할 수 있는 사업자 네트워크에 합류하여<br />
              새로운 비즈니스 기회를 발굴해보세요
            </BrandSubtitle>

            <FeatureList>
              <FeatureItem>
                <FeatureIcon>🎯</FeatureIcon>
                <FeatureText>정확한 사업자 매칭 시스템</FeatureText>
              </FeatureItem>
              <FeatureItem>
                <FeatureIcon>🤝</FeatureIcon>
                <FeatureText>신뢰도 기반 제휴 네트워크</FeatureText>
              </FeatureItem>
              <FeatureItem>
                <FeatureIcon>💡</FeatureIcon>
                <FeatureText>맞춤형 비즈니스 솔루션</FeatureText>
              </FeatureItem>
              <FeatureItem>
                <FeatureIcon>📊</FeatureIcon>
                <FeatureText>실시간 성과 분석 대시보드</FeatureText>
              </FeatureItem>
            </FeatureList>

            <TrustBadges>
              <TrustBadge>
                <span>🛡️</span>
                <span>개인정보보호</span>
              </TrustBadge>              
              <TrustBadge>
                <span>🔒</span>
                <span>보안 인증 전송</span>
              </TrustBadge>
            </TrustBadges>
          </BrandSection>
        </LeftPanel>

        <RightPanel>
          <Card>
            <CardHeader>
              <Title>회원가입</Title>
              <Subtitle>파트너십 플랫폼에 오신 걸 환영합니다</Subtitle>
            </CardHeader>

            <ProgressSection>
              {[1, 2, 3, 4].map((step, idx) => (
                <ProgressStep
                  key={step}
                  completed={getStepStatus(step)}
                  isLast={step === 4}
                >
                  <StepCircle
                    completed={getStepStatus(step)}
                    active={getCurrentStep() === step}
                  >
                    {step}
                  </StepCircle>
                  <StepLabel
                    completed={getStepStatus(step)}
                    active={getCurrentStep() === step}
                  >
                    {['정보 입력', '이메일 인증', '비밀번호', '사진 인증'][idx]}
                  </StepLabel>
                </ProgressStep>
              ))}
            </ProgressSection>

            <Form>
              <InputGroup>
                <Label htmlFor="username">아이디</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="아이디를 입력하세요"
                  onChange={handleChange}
                />
              </InputGroup>

              <InputGroup>
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="이름을 입력하세요"
                  onChange={handleChange}
                />
              </InputGroup>

              {/* 이메일 인증 */}
              <InputGroup>
                <Label htmlFor="email">이메일</Label>
                <InputWrapper>
                  <FlexInput
                    id="email"
                    name="email"
                    placeholder="이메일 주소"
                    onChange={handleChange}
                  />
                  <ActionButton type="button" onClick={handleSendEmailCode} disabled={emailLoading}>
                    {emailLoading ? <LoadingSpinner /> : '코드 전송'}
                  </ActionButton>
                </InputWrapper>
                {emailMsg && <Message type={emailMsg.includes('성공') ? 'success' : 'error'}>{emailMsg}</Message>}
              </InputGroup>

              <InputGroup>
                <Label htmlFor="code">인증코드</Label>
                <InputWrapper>
                  <FlexInput
                    id="code"
                    name="code"
                    placeholder="인증코드 입력"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                  <ActionButton type="button" onClick={handleConfirmEmailCode} disabled={codeLoading}>
                    {codeLoading ? <LoadingSpinner /> : '인증 확인'}
                  </ActionButton>
                </InputWrapper>
                {codeMsg && <Message type={codeMsg.includes('성공') ? 'success' : 'error'}>{codeMsg}</Message>}
              </InputGroup>

              {/* 전화번호/비밀번호 */}
              <InputGroup>
                <Label htmlFor="phone_number">전화번호</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  placeholder="010-1234-5678"
                  onChange={handleChange}
                />
              </InputGroup>

              <InputGroup>
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  onChange={handleChange}
                />
              </InputGroup>

              {/* 이미지 업로드 */}
              <InputGroup>
                <Label>인증 사진 업로드</Label>
                <ImageUploadSection className={previewUrl ? 'has-image' : ''}>
                  <label htmlFor="image-upload">
                    <ImageUploadContent>
                      <ImageUploadIcon>📷</ImageUploadIcon>
                      <ImageUploadText>
                        {previewUrl ? '이미지를 다시 업로드하려면 클릭하세요' : '사진을 클릭하여 업로드'}
                      </ImageUploadText>
                    </ImageUploadContent>
                  </label>
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  {previewUrl && (
                    <ImagePreview>
                      <PreviewImage src={previewUrl} alt="미리보기" />
                      <RemoveImageButton type="button" onClick={removeImage}>×</RemoveImageButton>
                    </ImagePreview>
                  )}
                  {uploadMsg && <Message type={uploadMsg.includes('완료') ? 'success' : 'error'}>{uploadMsg}</Message>}
                </ImageUploadSection>
              </InputGroup>

              {/* 제출 */}
              <Button type="button" onClick={handleSignup} disabled={loading}>
                {loading ? <LoadingSpinner /> : '가입하기'}
              </Button>
              {error && <Message type="error">{error}</Message>}
              {successMsg && <Message type="success">{successMsg}</Message>}
            </Form>

            <LinksSection>
              <SignupText>
                이미 계정이 있으신가요? <Link to="/login">로그인</Link>
              </SignupText>
            </LinksSection>
          </Card>
        </RightPanel>
      </Container>
    </>
  );
}

export default Signup;
