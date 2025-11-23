// src/pages/owner/posts/PostDetailPage.jsx
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

// Layout
import MobileShell from "../../../design/layout/MobileShell";
import PageContainer from "../../../design/layout/PageContainer";
import ScreenHeader from "../../../design/layout/ScreenHeader";

// UI Kit
import {
  SoftSectionCard,
  SectionCard,
  PrimaryButton,
  StatusBadge,
  Spacer,
  Divider,
  Row,
  Col,
} from "../../../design/components";

// Tokens
import { spacing } from "../../../design/tokens/spacing";
import { colors } from "../../../design/tokens/colors";
import { typography } from "../../../design/tokens/typography";
import { radius } from "../../../design/tokens/radius";


export default function PostDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { apiCall } = useAuth();

  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [proposalError, setProposalError] = useState("");

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await apiCall({
          method: "GET",
          url: `/stores/post/${id}/`,
        });

        if (response.success) {
          setStoreData(response.data);
        } else {
          throw new Error();
        }
      } catch {
        setError("가게 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [id, apiCall]);

  const formatPrice = (price) => Number(price).toLocaleString("ko-KR");
  const formatDuration = (d) =>
    ({ "1_month": "1개월", "3_months": "3개월", "6_months": "6개월", unlimited: "무기한" }[d] || d);
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getCategoryName = (category) => {
    const categoryNames = {
      cafe: "카페",
      restaurant: "음식점",
      bakery: "베이커리",
      pub: "주점",
      fitness: "운동",
      study: "독서실",
      florist: "꽃집",
      convenience: "편의점",
      entertain: "유흥시설",
      other: "기타",
    };
    return categoryNames[category] || category;
    };


  const handleProposalSubmit = async () => {
    if (storeData.is_partnered) return;

    setSubmitting(true);
    setProposalError("");

    try {
      const response = await apiCall({
        method: "POST",
        url: "/partnerships/propose/",
        data: { recipient_store_id: parseInt(id) },
      });

      if (response.success) {
        alert("제휴 요청이 성공적으로 전송되었습니다!");
        navigate("/owner/posts");
        return;
      }

      setProposalError(response.message || "제휴 요청 전송에 실패했습니다.");
    } catch {
      setProposalError("제휴 요청 전송에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <MobileShell>
        <PageContainer>
          <div>불러오는 중...</div>
        </PageContainer>
      </MobileShell>
    );

  if (error)
    return (
      <MobileShell>
        <PageContainer>
          <div>{error}</div>
        </PageContainer>
      </MobileShell>
    );

  if (!storeData) return null;

  const meta = storeData.is_partnered
    ? {
        label: "제휴 완료",
        bg: "rgba(59,130,246,0.10)",
        color: "#1e3a8a",
        dot: "#3b82f6",
      }
    : {
        label: "제휴 가능",
        bg: "rgba(16,185,129,0.10)",
        color: "#065f46",
        dot: "#10b981",
      };

  return (
    <MobileShell>
      <PageContainer>
        <Spacer size="xs" />
        <ScreenHeader
          title="가게 상세 정보"
          showBack
          onBack={() => navigate(-1)}
        />
        {/* -----------------------------
            1) 가게 기본 정보 SectionCard
        ------------------------------ */}
        <SoftSectionCard>
          <StoreHeader>

            <StoreInfoCol>

              {/* 제목 + 뱃지 세로정렬 문제 해결 */}
              <StoreTitleRow>
                <StoreName>{storeData.name}</StoreName>
                <StatusBadge
                  label={meta.label}
                  bg={meta.bg}
                  color={meta.color}
                  dot={meta.dot}
                />
              </StoreTitleRow>

              <StoreMeta>{storeData.address}</StoreMeta>
              <StoreMeta>{getCategoryName(storeData.category)}</StoreMeta>
              <StoreMeta>사장님: {storeData.owner_name}</StoreMeta>
              <StoreMeta>연락처: {storeData.phone}
              </StoreMeta>

            </StoreInfoCol>

            {/* 오른쪽 이미지 */}
            {storeData.image_url && (
              <StoreThumbnail src={storeData.image_url} />
            )}
          </StoreHeader>
        </SoftSectionCard>

        {/* -----------------------------
            2) 제휴 정책 SectionCard
        ------------------------------ */}
        <SectionCard title="제휴 정책">
          <PolicyGrid>

            {/* 1) 제휴 내용 */}
            <InfoBox>
              <InfoLabel>제휴 내용</InfoLabel>
              <InfoValue>{storeData.description || "내용 없음"}</InfoValue>
            </InfoBox>

            {/* 2) 예상 가치 */}
            <InfoBox>
              <InfoLabel>예상 가치</InfoLabel>
              <InfoValue>{formatPrice(storeData.expected_value)}원</InfoValue>
            </InfoBox>

            {/* 3) 예상 기간 */}
            <InfoBox>
              <InfoLabel>예상 기간</InfoLabel>
              <InfoValue>{formatDuration(storeData.expected_duration)}</InfoValue>
            </InfoBox>

            {/* 4) 월 한도 */}
            <InfoBox>
              <InfoLabel>월 한도</InfoLabel>
              <InfoValue>{storeData.monthly_limit}매</InfoValue>
            </InfoBox>

          </PolicyGrid>

          {storeData.coupon_updated_at && (
            <UpdatedAt>
              쿠폰 정책 업데이트: {formatDate(storeData.coupon_updated_at)}
            </UpdatedAt>
          )}
        </SectionCard>



        {/* -----------------------------
            3) 제휴 신청
        ------------------------------ */}
        {proposalError && (
          <ErrorMsg>{proposalError}</ErrorMsg>
        )}

        <PrimaryButton
          disabled={storeData.is_partnered || submitting}
          onClick={handleProposalSubmit}
        >
          {submitting
            ? "전송 중..."
            : storeData.is_partnered
            ? "이미 제휴 중"
            : "제휴 신청하기"}
        </PrimaryButton>

        <Spacer size="xl" />
      </PageContainer>
    </MobileShell>
  );
}

/* -----------------------------------
   Styled Components
------------------------------------ */

const StoreHeader = styled.div`
  display: flex;
  gap: ${spacing.md}px;
`;

const StoreInfoCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
`;

const StoreName = styled.div`
  font-size: ${typography.title2.size};
  font-weight: ${typography.title2.weight};
  color: ${colors.textPrimary};
`;

const StoreTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm}px;
`;

const StoreMeta = styled.div`
  font-size: ${typography.small.size};
  color: ${colors.textSecondary};
`;

const StoreThumbnail = styled.img`
  width: 100px;
  height: 100px;
  border-radius: ${radius.xl}px;
  object-fit: cover;
`;


const InfoBox = styled.div`
  flex: 1;
  padding: ${spacing.md}px;
  border-radius: ${radius.md}px;
  background: ${colors.bgBase};
`;

const InfoLabel = styled.div`
  font-size: ${typography.small.size};
  color: ${colors.textSecondary};
`;

const InfoValue = styled.div`
  margin-top: 4px;
  font-size: ${typography.bodyBold.size};
  color: ${colors.textPrimary};
`;

const PolicyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${spacing.sm}px;
  margin-top: ${spacing.sm}px;
`;

const UpdatedAt = styled.div`
  margin-top: ${spacing.sm}px;
  font-size: ${typography.small.size};
  color: ${colors.textSecondary};
  text-align: right;
`;

const ErrorMsg = styled.div`
  color: ${colors.error};
  font-size: ${typography.small.size};
  margin-bottom: ${spacing.sm}px;
`;
