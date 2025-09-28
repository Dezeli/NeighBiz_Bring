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
  margin-bottom: 2rem;
  position: relative;
`;

const BackButton = styled.button`
  position: absolute;
  top: -0.5rem;
  left: -0.5rem;
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

const StatusSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(248, 250, 252, 0.8);
  border-radius: 16px;
  border: 1px solid rgba(226, 232, 240, 0.6);
`;

const PartnershipStatus = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 700;
  
  ${props => {
    if (props.isPartnered) {
      return `
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      `;
    }
    return `
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
    `;
  }}
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
`;

const StoreInfoSection = styled.div`
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 2px solid rgba(59, 130, 246, 0.1);
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.08);
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e40af;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StoreHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.25rem;
`;

const StoreAvatar = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  font-size: 1.5rem;
  border: 2px solid rgba(59, 130, 246, 0.2);
`;

const StoreInfo = styled.div`
  flex: 1;
`;

const StoreName = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e3a8a;
  margin-bottom: 0.25rem;
`;

const OwnerName = styled.p`
  font-size: 0.875rem;
  color: #3730a3;
  margin-bottom: 0.25rem;
  font-weight: 600;
`;

const StoreCategory = styled.p`
  font-size: 0.875rem;
  color: #4338ca;
  margin-bottom: 0.25rem;
  font-weight: 500;
`;

const StoreAddress = styled.p`
  font-size: 0.75rem;
  color: #6366f1;
`;

const StoreImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 1rem;
  border: 2px solid rgba(59, 130, 246, 0.1);
`;

const StoreDescription = styled.p`
  color: #1e40af;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  background: white;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid rgba(59, 130, 246, 0.2);
`;

const ContactInfo = styled.div`
  background: white;
  border: 2px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  padding: 1rem;
`;

const ContactLabel = styled.p`
  font-size: 0.875rem;
  font-weight: 700;
  color: #1e40af;
  margin-bottom: 0.5rem;
`;

const ContactValue = styled.p`
  font-size: 1rem;
  color: #1e3a8a;
  font-weight: 600;
`;

const PolicySection = styled.div`
  background: linear-gradient(135deg, #fef7ff 0%, #f3e8ff 100%);
  border: 2px solid rgba(147, 51, 234, 0.1);
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(147, 51, 234, 0.08);
`;

const PolicyInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const PolicyBox = styled.div`
  background: white;
  border: 2px solid rgba(147, 51, 234, 0.15);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
`;

const PolicyLabel = styled.p`
  font-size: 0.875rem;
  font-weight: 700;
  color: #7c2d12;
  margin-bottom: 0.5rem;
`;

const PolicyValue = styled.p`
  font-size: 1.125rem;
  font-weight: 700;
  color: #581c87;
`;

const BusinessHoursSection = styled.div`
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border: 2px solid rgba(16, 185, 129, 0.1);
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.08);
`;

const BusinessHours = styled.div`
  background: white;
  border: 2px solid rgba(16, 185, 129, 0.15);
  border-radius: 12px;
  padding: 1rem;
`;

const BusinessHoursTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #065f46;
  margin-bottom: 0.75rem;
  text-align: center;
`;

const DaySchedule = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(16, 185, 129, 0.1);

  &:last-child {
    border-bottom: none;
  }
`;

const DayName = styled.span`
  font-size: 0.875rem;
  font-weight: 700;
  color: #047857;
  min-width: 40px;
`;

const DayHours = styled.span`
  font-size: 0.875rem;
  color: #059669;
  font-weight: 600;
`;

const ActionSection = styled.div`
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border: 2px solid rgba(245, 158, 11, 0.1);
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.08);
`;

const ActionButton = styled.button`
  width: 100%;
  height: 52px;
  border: none;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  ${props => {
    if (props.disabled) {
      return `
        background: #f3f4f6;
        color: #9ca3af;
        cursor: not-allowed;
        border: 2px solid #e5e7eb;
      `;
    }
    return `
      background: linear-gradient(135deg, #10b981 0%, #0ea5e9 100%);
      color: white;
      box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 24px rgba(16, 185, 129, 0.5);
      }

      &:active {
        transform: translateY(-1px);
      }
    `;
  }}
`;

const ErrorMessage = styled.p`
  color: #ef4444;
  font-size: 0.875rem;
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 600;
  background: rgba(254, 242, 242, 0.8);
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(239, 68, 68, 0.2);
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

const StoreDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { apiCall } = useAuth();
  
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [proposalError, setProposalError] = useState('');

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await apiCall({
          method: 'GET',
          url: `/stores/post/${id}/`,
        });
        
        if (response.success) {
          setStoreData(response.data);
        } else {
          throw new Error('가게 정보를 불러올 수 없습니다.');
        }
      } catch (err) {
        setError('가게 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDayName = (day) => {
    const dayNames = {
      mon: '월',
      tue: '화',
      wed: '수',
      thu: '목',
      fri: '금',
      sat: '토',
      sun: '일',
    };
    return dayNames[day] || day;
  };

  const formatBusinessHours = (dayInfo) => {
    if (dayInfo.closed) {
      return '휴무';
    }
    
    let hours = `${dayInfo.open} - ${dayInfo.close}`;
    if (dayInfo.break && dayInfo.break.length === 2) {
      hours += ` (브레이크 ${dayInfo.break[0]} - ${dayInfo.break[1]})`;
    }
    
    return hours;
  };

  const handleProposalSubmit = async () => {
    if (storeData.is_partnered) return;

    setSubmitting(true);
    setProposalError('');
    
    try {
      const response = await apiCall({
        method: 'POST',
        url: '/partnerships/propose/',
        data: {
          recipient_store_id: parseInt(id),
        },
      });

      if (response.success) {
        alert(response.data.global || '제휴 요청이 성공적으로 전송되었습니다!');
        navigate('/owner/posts');
      } else {
        const errorMsg = response.message || '제휴 요청 전송에 실패했습니다.';
        setProposalError(errorMsg);
      }
    } catch (err) {
      setProposalError('제휴 요청 전송에 실패했습니다. 다시 시도해주세요.');
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
            <LoadingText>가게 정보를 불러오는 중...</LoadingText>
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

  if (!storeData) {
    return null;
  }

  return (
    <Container>
      <ContentWrapper>
        <Header>
          <BackButton onClick={() => navigate(-1)}>
            ←
          </BackButton>
          <Logo>
            <span className="neigh">Neigh</span>
            <span className="biz">Biz</span>
          </Logo>
          <PageTitle>가게 상세 정보</PageTitle>
        </Header>

        {/* 제휴 상태 */}
        <StatusSection>
          <PartnershipStatus isPartnered={storeData.is_partnered}>
            <StatusDot isPartnered={storeData.is_partnered} />
            {storeData.is_partnered ? '제휴 중' : '제휴 가능'}
          </PartnershipStatus>
        </StatusSection>

        {/* 가게 기본 정보 */}
        <StoreInfoSection>
          <SectionTitle>🏪 가게 정보</SectionTitle>
          <StoreHeader>
            <StoreAvatar>
              {getCategoryIcon(storeData.category)}
            </StoreAvatar>
            <StoreInfo>
              <StoreName>{storeData.name}</StoreName>
              <OwnerName>사장님: {storeData.owner_name}</OwnerName>
              <StoreCategory>{getCategoryName(storeData.category)}</StoreCategory>
              <StoreAddress>{storeData.address}</StoreAddress>
            </StoreInfo>
          </StoreHeader>
          
          {storeData.image_url && (
            <StoreImage src={storeData.image_url} alt={storeData.name} />
          )}
          
          {storeData.description && (
            <StoreDescription>{storeData.description}</StoreDescription>
          )}

          <ContactInfo>
            <ContactLabel>📞 연락처</ContactLabel>
            <ContactValue>{storeData.phone}</ContactValue>
          </ContactInfo>
        </StoreInfoSection>

        {/* 제휴 정책 정보 */}
        <PolicySection>
          <SectionTitle>🤝 제휴 정책</SectionTitle>
          <PolicyInfo>
            <PolicyBox>
              <PolicyLabel>예상 가치</PolicyLabel>
              <PolicyValue>{formatPrice(storeData.expected_value)}원</PolicyValue>
            </PolicyBox>
            <PolicyBox>
              <PolicyLabel>예상 기간</PolicyLabel>
              <PolicyValue>{formatDuration(storeData.expected_duration)}</PolicyValue>
            </PolicyBox>
          </PolicyInfo>
          
          <PolicyBox style={{ gridColumn: 'span 2', background: 'white', border: '2px solid rgba(147, 51, 234, 0.15)' }}>
            <PolicyLabel style={{ color: '#7c2d12' }}>월 한도</PolicyLabel>
            <PolicyValue style={{ color: '#581c87' }}>{storeData.monthly_limit}매</PolicyValue>
          </PolicyBox>
          
          {storeData.coupon_updated_at && (
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <p style={{ fontSize: '0.75rem', color: '#7c2d12', fontWeight: '600' }}>
                쿠폰 정책 업데이트: {formatDate(storeData.coupon_updated_at)}
              </p>
            </div>
          )}
        </PolicySection>

        {/* 영업 시간 */}
        {storeData.business_hours && (
          <BusinessHoursSection>
            <SectionTitle>🕒 영업시간</SectionTitle>
            <BusinessHours>
              <BusinessHoursTitle>운영 시간</BusinessHoursTitle>
              {Object.entries(storeData.business_hours).map(([day, hours]) => (
                <DaySchedule key={day}>
                  <DayName>{getDayName(day)}</DayName>
                  <DayHours>{formatBusinessHours(hours)}</DayHours>
                </DaySchedule>
              ))}
            </BusinessHours>
          </BusinessHoursSection>
        )}

        {/* 제휴 신청 */}
        <ActionSection>
          <SectionTitle>💌 제휴 신청</SectionTitle>
          
          {/* 에러 메시지 */}
          {proposalError && (
            <ErrorMessage>{proposalError}</ErrorMessage>
          )}
          
          {/* 제휴 신청 버튼 */}
          <ActionButton 
            disabled={storeData.is_partnered || submitting}
            onClick={handleProposalSubmit}
          >
            {submitting ? (
              <>
                <LoadingSpinner style={{ width: '20px', height: '20px', margin: '0' }} />
                전송 중...
              </>
            ) : storeData.is_partnered ? (
              <>
                <span>✅</span>
                이미 제휴 중
              </>
            ) : (
              <>
                <span>🤝</span>
                제휴 신청하기
              </>
            )}
          </ActionButton>
        </ActionSection>
      </ContentWrapper>
    </Container>
  );
};

export default StoreDetailPage;