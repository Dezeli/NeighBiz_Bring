import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 0;
`;

const ContentWrapper = styled.div`
  width: 100vw;
  max-width: 390px;
  min-height: 100vh;
  background: white;
  padding: 2rem 1.5rem;
  text-align: center;
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
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const PageDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 2rem;
  line-height: 1.5;
`;

const FormSection = styled.div`
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 2px solid rgba(59, 130, 246, 0.1);
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.08);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  text-align: left;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e40af;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 1rem;
  border: 2px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  box-sizing: border-box;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 1rem;
  border: 2px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  box-sizing: border-box;
  resize: vertical;
  font-family: inherit;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const Select = styled.select`
  width: 100%;
  height: 48px;
  padding: 0 1rem;
  border: 2px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ImageUploadSection = styled.div`
  margin-top: 1rem;
`;

const CurrentImage = styled.div`
  margin-bottom: 1rem;
`;

const ImagePreview = styled.img`
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 12px;
  border: 2px solid rgba(59, 130, 246, 0.2);
`;

const FileInputWrapper = styled.div`
  position: relative;
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  display: block;
  width: 100%;
  height: 48px;
  background: white;
  color: #3b82f6;
  border: 2px solid rgba(59, 130, 246, 0.3);
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: #eff6ff;
    border-color: #3b82f6;
  }
`;

const HelpText = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.5rem;
  line-height: 1.4;
`;

const TimeInputGroup = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr 1fr;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const DayLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e40af;
`;

const TimeInput = styled.input`
  height: 40px;
  padding: 0 0.75rem;
  border: 2px solid rgba(59, 130, 246, 0.2);
  border-radius: 10px;
  font-size: 0.875rem;
  background: white;
  box-sizing: border-box;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 2rem;
`;

const SubmitButton = styled.button`
  flex: 2;
  height: 52px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      transform: none;
    }
  }
`;

const CancelButton = styled.button`
  flex: 1;
  height: 52px;
  background: white;
  color: #6b7280;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  color: #dc2626;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 3rem 1rem;
`;

const LoadingSpinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid rgba(59, 130, 246, 0.2);
  border-top: 3px solid #3b82f6;
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

const Footer = styled.div`
  text-align: center;
  margin-top: auto;
  padding-top: 1rem;
  color: #9ca3af;
  font-size: 0.75rem;
`;

const OwnerProfileEditPage = () => {
  const navigate = useNavigate();
  const { apiCall } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    category: 'cafe',
    description: '',
    image_url: '',
    business_hours: {
      mon: { open: '', close: '' },
      tue: { open: '', close: '' },
      wed: { open: '', close: '' },
      thu: { open: '', close: '' },
      fri: { open: '', close: '' },
      sat: { open: '', close: '' },
      sun: { open: '', close: '' },
    },
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await apiCall({
        method: 'GET',
        url: '/accounts/owner-profile/',
      });

      if (response?.data?.store) {
        const store = response.data.store;
        setFormData({
          name: store.name || '',
          phone: store.phone || '',
          address: store.address || '',
          category: store.category || 'cafe',
          description: store.description || '',
          image_url: store.image_url || '',
          business_hours: store.business_hours || {
            mon: { open: '', close: '' },
            tue: { open: '', close: '' },
            wed: { open: '', close: '' },
            thu: { open: '', close: '' },
            fri: { open: '', close: '' },
            sat: { open: '', close: '' },
            sun: { open: '', close: '' },
          },
        });
        setPreviewUrl(store.image_url || '');
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError('정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formatBusinessHours = (hours) => {
    // 필요 없어진 함수 - 삭제 예정
    return '';
  };

  const handleBusinessHoursChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      business_hours: {
        ...prev.business_hours,
        [day]: {
          ...prev.business_hours[day],
          [field]: value,
        },
      },
    }));
    setError('');
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const uploadImage = async (file) => {
    try {
      // 1. upload URL 받기
      const uploadResponse = await apiCall({
        method: 'POST',
        url: '/upload/image/',
        data: {
          filename: file.name,
          content_type: file.type,
          image_type: 'store_image',
        },
      });

      if (!uploadResponse?.data?.upload_url || !uploadResponse?.data?.key) {
        throw new Error('업로드 URL을 받지 못했습니다');
      }

      // 2. S3에 직접 업로드
      const uploadUrl = uploadResponse.data.upload_url;
      const imageKey = uploadResponse.data.key;

      const putResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      if (!putResponse.ok) {
        throw new Error('이미지 업로드에 실패했습니다');
      }

      return imageKey;
    } catch (err) {
      console.error('Image upload failed:', err);
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 유효성 검사
    if (!formData.name.trim()) {
      setError('가게명을 입력해주세요');
      return;
    }
    
    if (!formData.phone.trim()) {
      setError('전화번호를 입력해주세요');
      return;
    }
    
    if (!formData.address.trim()) {
      setError('주소를 입력해주세요');
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      let imageUrl = formData.image_url;
      
      // 새 이미지가 선택되었으면 업로드
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      const response = await apiCall({
        method: 'PATCH',
        url: '/stores/owner-store/',
        data: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          category: formData.category,
          description: formData.description.trim(),
          image_url: imageUrl,
          business_hours: formData.business_hours, // GET에서 받은 객체 그대로 전달
        },
      });

      if (response?.success) {
        navigate('/owner/profile');
      } else {
        const errorMsg = response?.data?.global || response?.message || '정보 수정에 실패했습니다.';
        setError(errorMsg);
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      const errorMsg = err?.response?.data?.message || '정보 수정에 실패했습니다.';
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/owner/profile');
  };

  if (loading) {
    return (
      <Container>
        <ContentWrapper>
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingText>정보를 불러오는 중...</LoadingText>
          </LoadingContainer>
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

        <PageTitle>가게 정보 수정</PageTitle>
        <PageDescription>
          가게 정보를 최신 상태로 유지하세요
        </PageDescription>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <form onSubmit={handleSubmit}>
          <FormSection>
            <FormGroup>
              <Label>가게명 *</Label>
              <Input
                type="text"
                placeholder="예: 달빛커피"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                disabled={submitting}
              />
            </FormGroup>

            <FormGroup>
              <Label>전화번호 *</Label>
              <Input
                type="tel"
                placeholder="예: 02-123-4567"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                disabled={submitting}
              />
            </FormGroup>

            <FormGroup>
              <Label>주소 *</Label>
              <Input
                type="text"
                placeholder="예: 서울 강남구 테헤란로 111"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                disabled={submitting}
              />
            </FormGroup>

            <FormGroup>
              <Label>카테고리 *</Label>
              <Select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                disabled={submitting}
              >
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
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>가게 설명</Label>
              <Textarea
                placeholder="가게를 소개하는 설명을 입력하세요"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                disabled={submitting}
              />
            </FormGroup>

            <FormGroup>
              <Label>영업시간</Label>
              <div>
                <TimeInputGroup>
                  <DayLabel>월요일</DayLabel>
                  <TimeInput
                    type="time"
                    value={formData.business_hours.mon?.open || ''}
                    onChange={(e) => handleBusinessHoursChange('mon', 'open', e.target.value)}
                    disabled={submitting}
                  />
                  <TimeInput
                    type="time"
                    value={formData.business_hours.mon?.close || ''}
                    onChange={(e) => handleBusinessHoursChange('mon', 'close', e.target.value)}
                    disabled={submitting}
                  />
                </TimeInputGroup>
                <TimeInputGroup>
                  <DayLabel>화요일</DayLabel>
                  <TimeInput
                    type="time"
                    value={formData.business_hours.tue?.open || ''}
                    onChange={(e) => handleBusinessHoursChange('tue', 'open', e.target.value)}
                    disabled={submitting}
                  />
                  <TimeInput
                    type="time"
                    value={formData.business_hours.tue?.close || ''}
                    onChange={(e) => handleBusinessHoursChange('tue', 'close', e.target.value)}
                    disabled={submitting}
                  />
                </TimeInputGroup>
                <TimeInputGroup>
                  <DayLabel>수요일</DayLabel>
                  <TimeInput
                    type="time"
                    value={formData.business_hours.wed?.open || ''}
                    onChange={(e) => handleBusinessHoursChange('wed', 'open', e.target.value)}
                    disabled={submitting}
                  />
                  <TimeInput
                    type="time"
                    value={formData.business_hours.wed?.close || ''}
                    onChange={(e) => handleBusinessHoursChange('wed', 'close', e.target.value)}
                    disabled={submitting}
                  />
                </TimeInputGroup>
                <TimeInputGroup>
                  <DayLabel>목요일</DayLabel>
                  <TimeInput
                    type="time"
                    value={formData.business_hours.thu?.open || ''}
                    onChange={(e) => handleBusinessHoursChange('thu', 'open', e.target.value)}
                    disabled={submitting}
                  />
                  <TimeInput
                    type="time"
                    value={formData.business_hours.thu?.close || ''}
                    onChange={(e) => handleBusinessHoursChange('thu', 'close', e.target.value)}
                    disabled={submitting}
                  />
                </TimeInputGroup>
                <TimeInputGroup>
                  <DayLabel>금요일</DayLabel>
                  <TimeInput
                    type="time"
                    value={formData.business_hours.fri?.open || ''}
                    onChange={(e) => handleBusinessHoursChange('fri', 'open', e.target.value)}
                    disabled={submitting}
                  />
                  <TimeInput
                    type="time"
                    value={formData.business_hours.fri?.close || ''}
                    onChange={(e) => handleBusinessHoursChange('fri', 'close', e.target.value)}
                    disabled={submitting}
                  />
                </TimeInputGroup>
                <TimeInputGroup>
                  <DayLabel>토요일</DayLabel>
                  <TimeInput
                    type="time"
                    value={formData.business_hours.sat?.open || ''}
                    onChange={(e) => handleBusinessHoursChange('sat', 'open', e.target.value)}
                    disabled={submitting}
                  />
                  <TimeInput
                    type="time"
                    value={formData.business_hours.sat?.close || ''}
                    onChange={(e) => handleBusinessHoursChange('sat', 'close', e.target.value)}
                    disabled={submitting}
                  />
                </TimeInputGroup>
                <TimeInputGroup>
                  <DayLabel>일요일</DayLabel>
                  <TimeInput
                    type="time"
                    value={formData.business_hours.sun?.open || ''}
                    onChange={(e) => handleBusinessHoursChange('sun', 'open', e.target.value)}
                    disabled={submitting}
                  />
                  <TimeInput
                    type="time"
                    value={formData.business_hours.sun?.close || ''}
                    onChange={(e) => handleBusinessHoursChange('sun', 'close', e.target.value)}
                    disabled={submitting}
                  />
                </TimeInputGroup>
              </div>
              <HelpText>각 요일별 오픈/마감 시간을 설정하세요</HelpText>
            </FormGroup>

            <FormGroup>
              <Label>가게 이미지</Label>
              <ImageUploadSection>
                {previewUrl && (
                  <CurrentImage>
                    <ImagePreview src={previewUrl} alt="가게 이미지" />
                  </CurrentImage>
                )}
                <FileInputWrapper>
                  <FileInput
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={submitting}
                  />
                  <FileInputLabel htmlFor="image-upload">
                    <span>📷</span>
                    {selectedFile ? selectedFile.name : '이미지 변경하기'}
                  </FileInputLabel>
                </FileInputWrapper>
                <HelpText>이미지를 변경하지 않으면 기존 이미지가 유지됩니다</HelpText>
              </ImageUploadSection>
            </FormGroup>
          </FormSection>

          <ButtonGroup>
            <CancelButton type="button" onClick={handleCancel}>
              취소
            </CancelButton>
            <SubmitButton type="submit" disabled={submitting}>
              {submitting ? '수정 중...' : '수정 완료'}
            </SubmitButton>
          </ButtonGroup>
        </form>

        <Footer>
          네이비즈 소상공인 제휴 플랫폼
        </Footer>
      </ContentWrapper>
    </Container>
  );
};

export default OwnerProfileEditPage;