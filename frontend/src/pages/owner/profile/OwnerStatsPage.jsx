import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";

import {
  SectionCard,
  SubtleButton,
  Spacer,
} from "../../../design/components";

import MobileShell from "../../../design/layout/MobileShell";
import PageContainer from "../../../design/layout/PageContainer";
import ScreenHeader from "../../../design/layout/ScreenHeader";

import { colors } from "../../../design/tokens/colors";
import { spacing } from "../../../design/tokens/spacing";
import { typography } from "../../../design/tokens/typography";

import { useAuth } from "../../../context/AuthContext";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
} from "recharts";


/* ---------- Styled ---------- */

const PeriodSelector = styled.div`
  display: flex;
  gap: ${spacing.sm}px;
`;

const PeriodButton = styled(SubtleButton)`
  flex: 1;
  height: 40px;
  border-radius: 10px;

  ${({ active }) =>
    active &&
    `
      background: ${colors.brandPrimary};
      color: white;
  `}
`;

const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${spacing.sm}px;
`;

const KPIGrid3 = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${spacing.md}px;
  text-align: center;
`;

const KPIIconCircle = styled.div`
  width: 70px;
  height: 50px;
  border-radius: 50%;
  margin: 0 auto ${spacing.xs}px;

  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;

  ${({ color }) => `
    background: ${color}22;
    color: ${color};
  `}
`;

const KPIItem = styled.div`
  text-align: center;
`;

const KPIValue = styled.div`
  font-size: 20px;
  font-weight: 800;
  color: ${colors.textPrimary};
`;

const KPILabel = styled.div`
  font-size: 12px;
  color: ${colors.textSecondary};
  margin-top: 4px;
`;

const ChartTitle = styled.div`
  font-size: ${typography.bodyBold.size};
  font-weight: ${typography.bodyBold.weight};
  margin-bottom: ${spacing.sm}px;
  color: ${colors.textPrimary};
`;


/* ---------- Component ---------- */

const OwnerStatsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { apiCall } = useAuth();

  const [period, setPeriod] = useState("7d");
  const [summary, setSummary] = useState(null);
  const [daily, setDaily] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async (range) => {
    setLoading(true);
    setError("");

    try {
      const response = await apiCall({
        method: "GET",
        url: `/partnerships/stats/?slug=${slug}&range=${range}`,
      });

      if (!response.success) {
        throw { response };
      }

      setSummary(response.data.summary);
      setDaily(response.data.daily);
    } catch (err) {
      const backendMessage =
        err?.response?.data?.message || "통계 데이터를 불러오지 못했습니다.";
      setError(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(period);
  }, [period, slug]);


  /* 날짜 MM/DD 포맷 */
  const formatChartData = (list) =>
    list.map((x) => {
      const [year, month, day] = x.date.split("-");
      return {
        date: `${month}/${day}`,
        발급: x.issued,
        사용: x.used,
      };
    });


  if (loading) {
    return (
      <MobileShell>
        <PageContainer>
          <ScreenHeader title="제휴 통계" showBack onBack={() => navigate("/owner/proposals")} />
          <Spacer size={spacing.lg} />
          불러오는 중...
        </PageContainer>
      </MobileShell>
    );
  }

  if (error) {
    return (
      <MobileShell>
        <PageContainer>
          <ScreenHeader title="제휴 통계" showBack onBack={() => navigate("/owner/proposals")} />
          <Spacer size={spacing.lg} />
          <div>{error}</div>
        </PageContainer>
      </MobileShell>
    );
  }

  const selectedRange = period === "7d" ? summary.last_7_days : summary.last_30_days;


  return (
    <MobileShell>
      <PageContainer>
        <ScreenHeader
          title="제휴 통계"
          showBack
          onBack={() => navigate("/owner/proposals")}
        />

        <Spacer size={spacing.lg} />

        {/* ---------- 전체 통계 카드 ---------- */}
        <SectionCard title="전체 기간 통계">
          <KPIGrid3>
            <KPIItem>
              <KPIIconCircle color="#10b981">
              <KPIValue>{summary.total.issued}</KPIValue>
              </KPIIconCircle>
              <KPILabel>총 발급</KPILabel>
            </KPIItem>

            <KPIItem>
              <KPIIconCircle color="#3b82f6">
              <KPIValue>{summary.total.used}</KPIValue>
              </KPIIconCircle>
              <KPILabel>총 사용</KPILabel>
            </KPIItem>

            <KPIItem>
              <KPIIconCircle color="#8b5cf6">
              <KPIValue>{summary.total.conversion_rate}%</KPIValue>
              </KPIIconCircle>
              <KPILabel>전환율</KPILabel>
            </KPIItem>

          </KPIGrid3>
        </SectionCard>

        <Spacer size={spacing.lg} />

        {/* ---------- 기간 버튼 ---------- */}
        <PeriodSelector>
          <PeriodButton active={period === "7d"} onClick={() => setPeriod("7d")}>
            7일
          </PeriodButton>
          <PeriodButton active={period === "30d"} onClick={() => setPeriod("30d")}>
            30일
          </PeriodButton>
        </PeriodSelector>

        <Spacer size={spacing.lg} />

        {/* ---------- 선택 기간 통계 카드 ---------- */}
        <SectionCard title={period === "7d" ? "7일 통계" : "30일 통계"}>
          <KPIGrid3>
            <KPIItem>
              <KPIIconCircle color="#10b981">
              <KPIValue>{selectedRange.issued}</KPIValue>
              </KPIIconCircle>
              <KPILabel>{period === "7d" ? "7일 발급" : "30일 발급"}</KPILabel>
            </KPIItem>

            <KPIItem>
              <KPIIconCircle color="#3b82f6">
              <KPIValue>{selectedRange.used}</KPIValue>
              </KPIIconCircle>
              <KPILabel>{period === "7d" ? "7일 사용" : "30일 사용"}</KPILabel>
            </KPIItem>
            
            <KPIItem>
              <KPIIconCircle color="#8b5cf6">
              <KPIValue>{selectedRange.conversion_rate}%</KPIValue>
              </KPIIconCircle>
              <KPILabel>전환율</KPILabel>
            </KPIItem>
          </KPIGrid3>

        </SectionCard>

        <Spacer size={spacing.lg} />

        {/* ---------- 그래프 ---------- */}
        <SectionCard>
          <ChartTitle>일별 발급/사용</ChartTitle>

          <div style={{ width: "100%", height: 240 }}>
            <ResponsiveContainer>
              <LineChart data={formatChartData(daily)}>
                <CartesianGrid stroke="#e5e7eb" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Legend />
                <Tooltip />
                {/* 🔄 색상 반전: 발급=초록, 사용=파랑 */}
                <Line type="monotone" dataKey="발급" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="사용" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <Spacer size={spacing.xl} />
      </PageContainer>
    </MobileShell>
  );
};

export default OwnerStatsPage;
