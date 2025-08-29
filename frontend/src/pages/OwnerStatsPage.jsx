import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

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
`;

const BackButton = styled.button`
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
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

const PeriodSelector = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background: rgba(248, 250, 252, 0.8);
  border-radius: 12px;
  padding: 0.25rem;
`;

const PeriodButton = styled.button`
  flex: 1;
  height: 40px;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${props => props.active ? `
    background: linear-gradient(135deg, #10b981 0%, #0ea5e9 100%);
    color: white;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
  ` : `
    background: transparent;
    color: #6b7280;
    
    &:hover {
      color: #374151;
      background: rgba(255, 255, 255, 0.6);
    }
  `}
`;

const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const KPICard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(226, 232, 240, 0.6);
  border-radius: 16px;
  padding: 1.25rem;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  
  ${props => props.span && 'grid-column: 1 / -1;'}
`;

const KPIIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.75rem;
  font-size: 1.25rem;
  
  ${props => {
    switch (props.type) {
      case 'issued':
        return `background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: white;`;
      case 'used':
        return `background: linear-gradient(135deg, #10b981 0%, #047857 100%); color: white;`;
      case 'conversion':
        return `background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); color: white;`;
      default:
        return `background: #f3f4f6; color: #6b7280;`;
    }
  }}
`;

const KPIValue = styled.div`
  font-size: 1.75rem;
  font-weight: 800;
  color: #374151;
  margin-bottom: 0.25rem;
`;

const KPILabel = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
`;

const ChartCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(226, 232, 240, 0.6);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
`;

const ChartTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 200px;
  margin-bottom: 0.5rem;
`;

const DelayStatsContainer = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(248, 250, 252, 0.6);
  border-radius: 12px;
  text-align: center;
`;

const AverageDelayText = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
`;

const AverageDelayValue = styled.span`
  font-size: 1.125rem;
  font-weight: 700;
  color: #10b981;
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
  margin-top: auto;
  padding-top: 2rem;
  color: #9ca3af;
  font-size: 0.75rem;
`;

const OwnerStatsPage = () => {
  const navigate = useNavigate();
  const { apiCall } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [summaryData, setSummaryData] = useState(null);
  const [delayData, setDelayData] = useState(null);

  const fetchData = async (period) => {
    setLoading(true);
    setError('');
    
    try {
      const [summaryResponse, delayResponse] = await Promise.all([
        apiCall({
          method: 'GET',
          url: `/owner/stats/summary?range=${period}`,
        }),
        apiCall({
          method: 'GET',
          url: `/owner/stats/redemption-delay?range=${period}`,
        })
      ]);

      if (summaryResponse.success && delayResponse.success) {
        setSummaryData(summaryResponse.data);
        setDelayData(delayResponse.data);
      } else {
        throw new Error('통계 데이터를 불러올 수 없습니다.');
      }
    } catch (err) {
      setError('통계 데이터를 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedPeriod);
  }, [selectedPeriod, apiCall]);

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const formatPercentage = (rate) => {
    return `${(rate * 100).toFixed(1)}%`;
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes.toFixed(1)}분`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}시간 ${remainingMinutes.toFixed(0)}분`;
  };

  const prepareChartData = (dailyStats) => {
    return dailyStats.map(stat => ({
      date: formatDate(stat.date),
      발급: stat.issued,
      사용: stat.used,
    }));
  };

  const prepareDelayChartData = (bins) => {
    return bins.map(bin => ({
      interval: bin.interval,
      count: bin.count,
      name: bin.interval,
    }));
  };

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

  if (loading) {
    return (
      <Container>
        <ContentWrapper>
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingText>통계를 불러오는 중...</LoadingText>
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
            <ErrorIcon>📊</ErrorIcon>
            <ErrorText>{error}</ErrorText>
            <RetryButton onClick={() => fetchData(selectedPeriod)}>
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
        <BackButton onClick={() => navigate(-1)}>
          ←
        </BackButton>

        <Header>
          <Logo>
            <span className="neigh">Neigh</span>
            <span className="biz">Biz</span>
          </Logo>
          <PageTitle>쿠폰 사용 통계</PageTitle>
        </Header>

        <PeriodSelector>
          <PeriodButton 
            active={selectedPeriod === '7d'} 
            onClick={() => handlePeriodChange('7d')}
          >
            7일
          </PeriodButton>
          <PeriodButton 
            active={selectedPeriod === 'month'} 
            onClick={() => handlePeriodChange('month')}
          >
            1개월
          </PeriodButton>
        </PeriodSelector>

        {/* KPI 카드들 */}
        <KPIGrid>
          <KPICard>
            <KPIIcon type="issued">🎫</KPIIcon>
            <KPIValue>{summaryData?.kpis.issued || 0}</KPIValue>
            <KPILabel>총 발급</KPILabel>
          </KPICard>
          
          <KPICard>
            <KPIIcon type="used">✅</KPIIcon>
            <KPIValue>{summaryData?.kpis.used || 0}</KPIValue>
            <KPILabel>총 사용</KPILabel>
          </KPICard>
          
          <KPICard span>
            <KPIIcon type="conversion">📈</KPIIcon>
            <KPIValue>{formatPercentage(summaryData?.kpis.conversion_rate || 0)}</KPIValue>
            <KPILabel>전환율</KPILabel>
          </KPICard>
        </KPIGrid>

        {/* 일별 통계 차트 */}
        {summaryData?.daily_stats && summaryData.daily_stats.length > 0 && (
          <ChartCard>
            <ChartTitle>📅 일별 쿠폰 사용 현황</ChartTitle>
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={prepareChartData(summaryData.daily_stats)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    stroke="#9ca3af"
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    stroke="#9ca3af"
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="발급" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="사용" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </ChartCard>
        )}

        {/* 쿠폰 사용 지연 시간 차트 */}
        {delayData?.bins && (
          <ChartCard>
            <ChartTitle>⏱️ 쿠폰 사용 지연 시간</ChartTitle>
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prepareDelayChartData(delayData.bins)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="interval" 
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                    stroke="#9ca3af"
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    stroke="#9ca3af"
                  />
                  <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
            
            <DelayStatsContainer>
              <AverageDelayText>
                평균 사용 지연 시간: <AverageDelayValue>
                  {formatDuration(delayData.average_duration_minutes)}
                </AverageDelayValue>
              </AverageDelayText>
            </DelayStatsContainer>
          </ChartCard>
        )}

        <Footer>
          네이비즈 소상공인 제휴 플랫폼
        </Footer>
      </ContentWrapper>
    </Container>
  );
};

export default OwnerStatsPage;