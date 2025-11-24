// src/pages/owner/profile/OwnerProfilePage.jsx
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
  Col,
  Spacer,
  TabButton,
  SettingButton,
  DangerButton
} from "../../../design/components";

// Tokens
import { colors } from "../../../design/tokens/colors";
import { spacing } from "../../../design/tokens/spacing";
import { radius } from "../../../design/tokens/radius";
import { typography } from "../../../design/tokens/typography";

const OwnerProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, apiCall } = useAuth();

  const [ownerProfile, setOwnerProfile] = useState(null);
  const [couponPolicy, setCouponPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showMore, setShowMore] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const profileResponse = await apiCall({
          method: "GET",
          url: "/accounts/owner-profile/",
        });

        if (profileResponse?.data) {
          setOwnerProfile(profileResponse.data);
        }

        try {
          const policyResponse = await apiCall({
            method: "GET",
            url: "/coupons/policy/",
          });

          if (policyResponse?.data) {
            setCouponPolicy(policyResponse.data);
          }
        } catch {
          // 쿠폰 정책이 없을 수 있음 (에러로 간주하지 않음)
          console.log("No coupon policy found");
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiCall]);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/login";
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return "-";
    return Number(price).toLocaleString("ko-KR");
  };

  const formatDuration = (duration) => {
    const durationMap = {
      "1_month": "1개월",
      "2_months": "2개월",
      "3_months": "3개월",
      "6_months": "6개월",
      "1_year": "1년",
    };
    return durationMap[duration] || duration;
  };

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

  const handleChangePassword = () => {
    alert("비밀번호 변경 기능은 준비중입니다.");
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm("정말로 회원탈퇴 하시겠습니까?");
    if (confirmed) {
      alert("회원탈퇴 기능은 준비중입니다.");
    }
  };

  // -------------------------------
  // 상태별 화면 처리
  // -------------------------------

  if (!user) {
    return (
      <MobileShell>
        <PageContainer>
          <SectionCard title="알림">
            <CenteredStack>
              <InfoText>로그인이 필요합니다.</InfoText>
              <Spacer size="sm" />
              <PrimaryButton onClick={() => navigate("/login")}>
                로그인 페이지로 이동
              </PrimaryButton>
            </CenteredStack>
          </SectionCard>
        </PageContainer>
      </MobileShell>
    );
  }

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

  if (error) {
    return (
      <MobileShell>
        <PageContainer>
          <SectionCard title="오류">
            <CenteredStack>
              <ErrorText>{error}</ErrorText>
              <Spacer size="sm" />
              <PrimaryButton onClick={() => window.location.reload()}>
                다시 시도
              </PrimaryButton>
            </CenteredStack>
          </SectionCard>
        </PageContainer>
      </MobileShell>
    );
  }

  // -------------------------------
  // 정상 화면
  // -------------------------------

  const ownerName = ownerProfile?.owner?.name || "사장님";
  const ownerPhone = ownerProfile?.owner?.phone || "-";
  const storeName = ownerProfile?.store?.name || "-";
  const storeAddress = ownerProfile?.store?.address || "-";
  const storeCategory = getCategoryName(ownerProfile?.store?.category) || "-";

  return (
    <MobileShell>
      <PageContainer>
        <Hero />

        {/* 상단 탭 네비게이션 */}
        <SoftSectionCard>
          <Row gap="sm" justify="space-between">
            <TabButton onClick={() => navigate("/owner/posts")}>
              게시글
            </TabButton>
            <TabButton onClick={() => navigate("/owner/proposals")}>
              제휴관리
            </TabButton>
            <TabButton $active onClick={() => navigate("/owner/profile")}>
              마이페이지
            </TabButton>
          </Row>
        </SoftSectionCard>

        {/* 1) 내 정보 */}
        <SectionCard>
          {/* 헤더: 사장님 이름 + 토글 */}
          <ProfileHeader>
            <ProfileTitle>{ownerProfile?.owner?.name || "사장님"} 사장님</ProfileTitle>

            <InfoToggle onClick={() => setShowMore(prev => !prev)}>
              {showMore ? "추가 정보 닫기 ▲" : "추가 정보 보기 ▼"}
            </InfoToggle>
          </ProfileHeader>


          {/* 2~3줄: 가게 이미지 + 정보 */}
          <StoreRow>
            {ownerProfile?.store?.image_url && (
              <StoreImage src={ownerProfile.store.image_url} alt="store" />
            )}

            <StoreInfoCol>
              <StoreName>{ownerProfile?.store?.name}</StoreName>
              <StoreDescription>
                {ownerProfile?.store?.description}
              </StoreDescription>
            </StoreInfoCol>
          </StoreRow>


          {/* ▼ 펼쳐지는 추가 정보 */}
          {showMore && (
            <>
              <MoreInfoBox>

                <InfoRow>
                  <InfoLabel>전화번호</InfoLabel>
                  <InfoValue>{ownerProfile?.owner?.phone || "-"}</InfoValue>
                </InfoRow>

                <InfoRow>
                  <InfoLabel>주소</InfoLabel>
                  <InfoValue>{ownerProfile?.store?.address || "-"}</InfoValue>
                </InfoRow>

                <InfoRow>
                  <InfoLabel>카테고리</InfoLabel>
                  <InfoValue>
                    {getCategoryName(ownerProfile?.store?.category)}
                  </InfoValue>
                </InfoRow>

              </MoreInfoBox>

              <PrimaryButton onClick={() => navigate("/owner/profile/edit")}>
                정보 수정하기
              </PrimaryButton>
            </>
          )}

        </SectionCard>

        {/* 2) 쿠폰 정책 */}
        <SectionCard title="쿠폰 정책">
          {couponPolicy ? (
            <>
              <PolicyGrid>
                <PolicyBox>
                  <PolicyLabel>쿠폰 설명</PolicyLabel>
                  <PolicyValue>{couponPolicy.description}</PolicyValue>
                </PolicyBox>

                <PolicyBox>
                  <PolicyLabel>예상 가치</PolicyLabel>
                  <PolicyValue>
                    {formatPrice(couponPolicy.expected_value)}원
                  </PolicyValue>
                </PolicyBox>

                <PolicyBox>
                  <PolicyLabel>월 한도</PolicyLabel>
                  <PolicyValue>{couponPolicy.monthly_limit}매</PolicyValue>
                </PolicyBox>

                <PolicyBox>
                  <PolicyLabel>유효 기간</PolicyLabel>
                  <PolicyValue>
                    {formatDuration(couponPolicy.expected_duration)}
                  </PolicyValue>
                </PolicyBox>
              </PolicyGrid>

              <Spacer size="sm" />

              <Row gap="sm">
                <PrimaryButton onClick={() => navigate("/owner/coupons/edit")}>
                  쿠폰 정책 수정
                </PrimaryButton>
              </Row>
            </>
          ) : (
            <EmptyState>
              <EmptyTitle>쿠폰 정책이 아직 설정되지 않았어요</EmptyTitle>
              <EmptyDescription>
                쿠폰 정책을 설정하면 제휴 제안과 통계 분석에 도움이 됩니다.
              </EmptyDescription>
              <Spacer size="lg" />
              <PrimaryButton onClick={() => navigate("/owner/coupons")}>
                쿠폰 정책 설정하기
              </PrimaryButton>
            </EmptyState>
          )}
        </SectionCard>

        {/* 3) 설정 */}
        <SectionCard title="설정">
          <SettingsList>

            {/* 비밀번호 변경 */}
            <SettingButton onClick={handleChangePassword}>
              비밀번호 변경
            </SettingButton>

            {/* 회원탈퇴 */}
            <DangerButton onClick={handleDeleteAccount}>
              회원탈퇴
            </DangerButton>

          </SettingsList>

          {/* 로그아웃은 Primary 버튼 유지 */}
          <PrimaryButton onClick={handleLogout}>
            로그아웃
          </PrimaryButton>
        </SectionCard>

        <Spacer size="md" />
        <FooterText>네이비즈 소상공인 제휴 플랫폼</FooterText>
      </PageContainer>
    </MobileShell>
  );
};

export default OwnerProfilePage;

/* ------------------------
   Styled Components
------------------------- */

const CenteredStack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InfoText = styled.div`
  font-size: ${typography.body.size};
  color: ${colors.textSecondary};
`;

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

const ErrorText = styled.div`
  font-size: ${typography.body.size};
  color: ${colors.error};
`;

// 프로필 영역
const ProfileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProfileTitle = styled.div`
  font-size: ${typography.title2.size};
  font-weight: ${typography.title2.weight};
  color: ${colors.textPrimary};
`;

const InfoToggle = styled.div`
  font-size: ${typography.small.size};
  color: ${colors.primary};
  cursor: pointer;
`;

const StoreRow = styled.div`
  display: flex;
  gap: ${spacing.md}px;
  margin-top: ${spacing.md}px;
`;

const StoreImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: ${radius.lg}px;
  object-fit: cover;
`;

const StoreInfoCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
`;

const StoreName = styled.div`
  font-size: ${typography.bodyBold.size};
  font-weight: ${typography.bodyBold.weight};
  color: ${colors.textPrimary};
`;

const StoreDescription = styled.div`
  font-size: ${typography.small.size};
  color: ${colors.textSecondary};
  line-height: 1.4;
`;

const MoreInfoBox = styled.div`
  margin-top: ${spacing.md}px;
  background: ${colors.bgBase};
  padding: ${spacing.md}px;
  border-radius: ${radius.md}px;
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm}px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const InfoLabel = styled.div`
  font-size: ${typography.small.size};
  color: ${colors.textSecondary};
`;

const InfoValue = styled.div`
  font-size: ${typography.body.size};
  color: ${colors.textPrimary};
`;




// 쿠폰 정책
const PolicyGrid = styled.div`
  margin-top: ${spacing.sm}px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${spacing.sm}px;
`;

const PolicyBox = styled.div`
  padding: ${spacing.sm}px ${spacing.md}px;
  border-radius: ${radius.md}px;
  background: ${colors.bgBase};
`;

const PolicyLabel = styled.div`
  font-size: ${typography.small.size};
  color: ${colors.textSecondary};
`;

const PolicyValue = styled.div`
  margin-top: 2px;
  font-size: ${typography.bodyBold.size};
  color: ${colors.textPrimary};
`;

// Empty State
const EmptyState = styled.div`
  padding: ${spacing.md}px 0;
  text-align: center;
`;

const EmptyTitle = styled.div`
  font-size: ${typography.subtitle.size};
  font-weight: ${typography.subtitle.weight};
  color: ${colors.textPrimary};
`;

const EmptyDescription = styled.div`
  margin-top: 4px;
  font-size: ${typography.small.size};
  color: ${colors.textSecondary};
`;

// 설정
const SettingsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm}px;
`;


// Footer
const FooterText = styled.div`
  text-align: center;
  font-size: ${typography.small.size};
  color: ${colors.textMuted};
`;
