// src/pages/owner/proposals/ProposalPage.jsx
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

// Layout
import MobileShell from "../../../design/layout/MobileShell";
import PageContainer from "../../../design/layout/PageContainer";

// UI Kit
import {
  SectionCard,
  SoftSectionCard,
  PrimaryButton,
  SubtleButton,
  Hero,
  Row,
  Spacer,
  TabButton,
} from "../../../design/components";

// Tokens
import { colors } from "../../../design/tokens/colors";
import { spacing } from "../../../design/tokens/spacing";
import { radius } from "../../../design/tokens/radius";
import { typography } from "../../../design/tokens/typography";

const ProposalPage = () => {
  const navigate = useNavigate();
  const { apiCall } = useAuth();

  const [qrData, setQrData] = useState(null);
  const [proposals, setProposals] = useState({ sent: [], received: [] });
  const [activeTab, setActiveTab] = useState("received");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    setLoading(true);

    try {
      // QR 이미지 가져오기
      try {
        const qrResponse = await apiCall({
          method: "GET",
          url: "/partnerships/qr-image/",
        });

        if (qrResponse?.data) {
          setQrData(qrResponse.data);
        } else {
          setQrData(null);
        }
      } catch (err) {
        console.log("No QR data found");
        setQrData(null);
      }

      // 제휴 제안 목록 가져오기
      try {
        const proposalsResponse = await apiCall({
          method: "GET",
          url: "/partnerships/proposals/",
        });

        if (proposalsResponse?.data) {
          setProposals({
            sent: proposalsResponse.data.sent || [],
            received: proposalsResponse.data.received || [],
          });
        } else {
          setProposals({ sent: [], received: [] });
        }
      } catch (err) {
        console.log("No proposals found");
        setProposals({ sent: [], received: [] });
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleProposalAction = async (proposalId, action) => {
    setActionLoading(proposalId);

    try {
      const response = await apiCall({
        method: "POST",
        url: `/partnerships/action/${proposalId}/`,
        data: { action },
      });

      if (response?.success) {
        await fetchData();
      }
    } catch (err) {
      console.error("Failed to perform action:", err);
      window.alert("작업 처리에 실패했습니다.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelProposal = async () => {
    if (!window.confirm("정말로 제안을 취소하시겠습니까?")) {
      return;
    }

    setActionLoading("cancel");

    try {
      const response = await apiCall({
        method: "POST",
        url: "/partnerships/propose-cancel/",
      });

      if (response?.success) {
        await fetchData();
      }
    } catch (err) {
      console.error("Failed to cancel proposal:", err);
      window.alert("제안 취소에 실패했습니다.");
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: "대기중",
      accepted: "수락",
      rejected: "거절",
    };
    return statusMap[status] || status;
  };

  const renderProposals = () => {
    const currentProposals = proposals[activeTab] || [];

    if (currentProposals.length === 0) {
      return (
        <EmptyState>
          <EmptyTitle>
            {activeTab === "sent" ? "보낸 제안이 없습니다" : "받은 제안이 없습니다"}
          </EmptyTitle>
          <EmptyDescription>
            {activeTab === "sent"
              ? "제휴 게시글에서 다른 사장님에게 제휴를 제안해보세요."
              : "아직 받은 제휴 제안이 없습니다."}
          </EmptyDescription>
        </EmptyState>
      );
    }

    return (
      <ProposalsList>
        {currentProposals.map((proposal) => (
          <ProposalItem key={proposal.id}>
            <ProposalHeader>
              <ProposalInfo>
                <ProposalStore>
                  {activeTab === "sent"
                    ? proposal.recipient_store || "-"
                    : proposal.proposer_store || "-"}
                </ProposalStore>
                <ProposalMeta>{formatDate(proposal.created_at)}</ProposalMeta>
              </ProposalInfo>

              <StatusPill $status={proposal.status}>
                {getStatusText(proposal.status)}
              </StatusPill>
            </ProposalHeader>

            {activeTab === "received" && proposal.status === "pending" && (
              <ButtonsRow>
                <PrimaryButton
                  onClick={() => handleProposalAction(proposal.id, "approve")}
                  disabled={actionLoading === proposal.id}
                >
                  {actionLoading === proposal.id ? "처리중..." : "승낙"}
                </PrimaryButton>
                <SubtleDangerButton
                  onClick={() => handleProposalAction(proposal.id, "reject")}
                  disabled={actionLoading === proposal.id}
                >
                  {actionLoading === proposal.id ? "처리중..." : "거절"}
                </SubtleDangerButton>
              </ButtonsRow>
            )}

            {activeTab === "sent" && proposal.status === "pending" && (
              <ButtonsRow>
                <SubtleButton
                  onClick={handleCancelProposal}
                  disabled={actionLoading === "cancel"}
                >
                  {actionLoading === "cancel" ? "취소중..." : "제안 취소"}
                </SubtleButton>
              </ButtonsRow>
            )}
          </ProposalItem>
        ))}
      </ProposalsList>
    );
  };

  if (loading) {
    return (
      <MobileShell>
        <PageContainer>
          <SectionCard>
            <LoadingState>
              <Spinner />
              <LoadingText>불러오는 중입니다...</LoadingText>
            </LoadingState>
          </SectionCard>
        </PageContainer>
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      <PageContainer>
        <Hero title="제휴 관리" />

        {/* 상단 네비게이션 탭 */}
        <SoftSectionCard>
          <Row gap="sm" justify="space-between">
            <TabButton onClick={() => navigate("/owner/posts")}>게시글</TabButton>
            <TabButton
              $active={true}
              onClick={() => navigate("/owner/proposals")}
            >
              제휴관리
            </TabButton>
            <TabButton onClick={() => navigate("/owner/profile")}>
              마이페이지
            </TabButton>
          </Row>
        </SoftSectionCard>

        <Spacer size="xs" />

        {/* 제휴 상태 / QR 코드 */}
        <SectionCard title="제휴 상태">
          {qrData ? (
            <QRWrapper>
              <QRLabel>고객용 QR 코드</QRLabel>
              <QRImageBox>
                <QRImage src={qrData.qr_code_url} alt="제휴 QR 코드" />
              </QRImageBox>
              <QRDescription>
                고객이 이 QR 코드를 스캔하면
                <br />
                제휴 쿠폰을 발급받을 수 있어요.
              </QRDescription>
            </QRWrapper>
          ) : (
            <EmptyState>
              <EmptyTitle>진행 중인 제휴가 없습니다</EmptyTitle>
              <EmptyDescription>
                제휴를 맺으면 자동으로 QR 코드가 생성돼요.
                <br />
                게시글에서 제휴 파트너를 먼저 찾아보세요.
              </EmptyDescription>
            </EmptyState>
          )}
        </SectionCard>

        {qrData && (
          <>
            <SectionCard>
              <PrimaryButton onClick={() => navigate(`/owner/stats/${qrData.partner_slug}`)}>
                제휴 통계 보기
              </PrimaryButton>
            </SectionCard>
          </>
        )}


        {/* 제휴 제안 목록 */}
        <SectionCard title="제휴 제안 목록">
          <ProposalTabs>
            <ProposalTab
              type="button"
              $active={activeTab === "received"}
              onClick={() => setActiveTab("received")}
            >
              받은 제안 ({proposals.received?.length || 0})
            </ProposalTab>
            <ProposalTab
              type="button"
              $active={activeTab === "sent"}
              onClick={() => setActiveTab("sent")}
            >
              보낸 제안 ({proposals.sent?.length || 0})
            </ProposalTab>
          </ProposalTabs>

          {renderProposals()}
        </SectionCard>

        <Spacer size="lg" />

        <FooterText>네이비즈 소상공인 제휴 플랫폼</FooterText>
      </PageContainer>
    </MobileShell>
  );
};

export default ProposalPage;

// Loading
const LoadingState = styled.div`
  padding: ${spacing.lg}px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${spacing.sm}px;
`;

const Spinner = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 999px;
  border: 3px solid rgba(0, 0, 0, 0.06);
  border-top-color: ${colors.primary};
  animation: spin 0.7s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  font-size: ${typography.body.size};
  color: ${colors.textSecondary};
`;

// QR 영역
const QRWrapper = styled.div`
  padding: ${spacing.md}px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${spacing.sm}px;
`;

const QRLabel = styled.div`
  font-size: ${typography.bodyBold.size};
  font-weight: ${typography.bodyBold.weight};
  color: ${colors.textPrimary};
`;

const QRImageBox = styled.div`
  padding: ${spacing.md}px;
  border-radius: ${radius.md}px;
  background: ${colors.bgBase};
  border: 1px solid rgba(0, 0, 0, 0.06);
`;

const QRImage = styled.img`
  width: 168px;
  height: 168px;
  border-radius: ${radius.sm}px;
  object-fit: contain;
`;

const QRDescription = styled.div`
  font-size: ${typography.small.size};
  color: ${colors.textSecondary};
`;

// Empty state (공통)
const EmptyState = styled.div`
  padding: ${spacing.lg}px 0;
  text-align: center;
`;

const EmptyIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 999px;
  background: ${colors.bgBase};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${spacing.sm}px;
  font-size: 24px;
`;

const EmptyTitle = styled.div`
  font-size: ${typography.subtitle.size};
  font-weight: ${typography.subtitle.weight};
`;

const EmptyDescription = styled.div`
  margin-top: 4px;
  font-size: ${typography.small.size};
  color: ${colors.textSecondary};
`;

// Proposals
const ProposalTabs = styled.div`
  display: flex;
  gap: ${spacing.xs}px;
  margin-bottom: ${spacing.sm}px;
`;

const ProposalTab = styled.button`
  flex: 1;
  padding: 0 ${spacing.sm}px;
  height: 36px;
  border-radius: ${radius.lg}px;
  border: 1px solid
    ${(p) => (p.$active ? colors.primary : "rgba(0, 0, 0, 0.06)")};
  background: ${(p) => (p.$active ? colors.primary : colors.white)};
  color: ${(p) => (p.$active ? colors.white : colors.textSecondary)};
  font-size: ${typography.small.size};
  font-weight: ${typography.bodyBold.weight};
  cursor: pointer;
`;

const ProposalsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm}px;
`;

const ProposalItem = styled.div`
  padding: ${spacing.md}px;
  border-radius: ${radius.lg}px;
  background: ${colors.white};
  border: 1px solid rgba(0, 0, 0, 0.06);
`;

const ProposalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${spacing.sm}px;
`;

const ProposalInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ProposalStore = styled.div`
  font-size: ${typography.bodyBold.size};
  font-weight: ${typography.bodyBold.weight};
  color: ${colors.textPrimary};
`;

const ProposalMeta = styled.div`
  font-size: ${typography.small.size};
  color: ${colors.textSecondary};
`;

const StatusPill = styled.div`
  padding: 4px 10px;
  border-radius: 999px;
  font-size: ${typography.small.size};
  font-weight: ${typography.bodyBold.weight};
  white-space: nowrap;
  background: ${({ $status }) => {
    switch ($status) {
      case "pending":
        return "rgba(245, 158, 11, 0.12)";
      case "accepted":
        return "rgba(16, 185, 129, 0.12)";
      case "rejected":
        return "rgba(239, 68, 68, 0.12)";
      default:
        return colors.bgBase;
    }
  }};
  color: ${({ $status }) => {
    switch ($status) {
      case "pending":
        return "#92400e";
      case "accepted":
        return "#065f46";
      case "rejected":
        return "#991b1b";
      default:
        return colors.textSecondary;
    }
  }};
`;

const ButtonsRow = styled.div`
  margin-top: ${spacing.sm}px;
  display: flex;
  gap: ${spacing.sm}px;

  & > * {
    flex: 1;
  }
`;

// Danger 스타일의 Subtle 버튼
const SubtleDangerButton = styled(SubtleButton)`
  color: ${colors.error};
`;

// Footer
const FooterText = styled.div`
  text-align: center;
  font-size: ${typography.small.size};
  color: ${colors.textMuted};
`;
