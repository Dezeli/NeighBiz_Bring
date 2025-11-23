// src/pages/owner/posts/PostsListPage.jsx
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

// Layout
import MobileShell from "../../../design/layout/MobileShell";
import PageContainer from "../../../design/layout/PageContainer";

// UI Kit
import {
  Input,
  PrimaryButton,
  SubtleButton,
  SectionCard,
  SoftSectionCard,
  Spacer,
  Hero,
  Row,
  Col,
  Divider,
  ClickableCard,
  StatusBadge,
  Select,
  TabButton 
} from "../../../design/components";

import { colors } from "../../../design/tokens/colors";
import { spacing } from "../../../design/tokens/spacing";
import { radius } from "../../../design/tokens/radius";
import { typography } from "../../../design/tokens/typography";

const PostsListPage = () => {
  const navigate = useNavigate();
  const { apiCall } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);




  const [filters, setFilters] = useState({
    category: "",
    description: "",
    expected_value_min: "",
    expected_value_max: "",
    duration: "",
    monthly_limit_min: "",
    monthly_limit_max: "",
    updated_at_after: "",
    updated_at_before: "",
    is_partnered: "",
  });

  const buildQueryParams = () => {
    const params = new URLSearchParams();
    params.append("page", currentPage.toString());

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.toString().trim()) {
        params.append(key, value.toString().trim());
      }
    });

    return params.toString();
  };

  const fetchPosts = async () => {
    setLoading(true);
    setError("");

    try {
      const queryString = buildQueryParams();

      const response = await apiCall({
        method: "GET",
        url: `/stores/posts/?${queryString}`,
      });

      let postsData = [];

      if (
        response?.data?.results &&
        Array.isArray(response.data.results)
      ) {
        postsData = response.data.results;
        if (postsData.length > 0 && currentPage === 1) {
          setPageSize(postsData.length);
        }

        if (response.data.count) {
          const total = Math.ceil(response.data.count / pageSize);
          setTotalPages(total);
        }
      }

      setPosts(postsData);
    } catch {
      setError("게시글을 불러오는데 실패했습니다.");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handlePriceBlurMin = (key, inputValue) => {
    const raw = Number(inputValue);
    if (isNaN(raw)) return;

    const rounded = Math.floor(raw / 500) * 500;
    setFilters((prev) => ({ ...prev, [key]: rounded }));
  };

  const handlePriceBlurMax = (key, inputValue) => {
    const raw = Number(inputValue);
    if (isNaN(raw)) return;

    const rounded = Math.ceil(raw / 500) * 500;
    setFilters((prev) => ({ ...prev, [key]: rounded }));
  };


  const handleMonthlyBlurMin = (key, inputValue) => {
    const raw = Number(inputValue);
    if (isNaN(raw)) return;

    const rounded = Math.floor(raw / 10) * 10;
    setFilters((prev) => ({ ...prev, [key]: rounded }));
  };

  const handleMonthlyBlurMax = (key, inputValue) => {
    const raw = Number(inputValue);
    if (isNaN(raw)) return;

    const rounded = Math.ceil(raw / 10) * 10;
    setFilters((prev) => ({ ...prev, [key]: rounded }));
  };

  const applyFilters = () => {
    setCurrentPage(1);
    fetchPosts();
  };

  const resetFilters = () => {
    setFilters({
      category: "",
      description: "",
      expected_value_min: "",
      expected_value_max: "",
      duration: "",
      monthly_limit_min: "",
      monthly_limit_max: "",
      updated_at_after: "",
      updated_at_before: "",
      is_partnered: "",
    });
    setCurrentPage(1);
    fetchPosts();
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

  const formatPrice = (price) => {
    if (price == null) return "-";
    try {
      return Number(price).toLocaleString("ko-KR");
    } catch {
      return String(price);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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

  const getStatusMeta = (isPartnered) => {
    if (isPartnered) {
      return {
        label: "제휴 완료",
        bg: "rgba(59,130,246,0.10)",
        color: "#1e3a8a",
        dot: "#3b82f6",
      };
    } else {
      return {
        label: "제휴 모집중",
        bg: "rgba(16,185,129,0.10)",
        color: "#065f46",
        dot: "#10b981",
      };
    }
  };

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // 현재 페이지가 앞쪽 (1~3)
    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    // 현재 페이지가 뒤쪽 (마지막 - 2)
    if (currentPage >= totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    // 중간에 있을 때
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };


  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const hasNoResults = !loading && !error && posts.length === 0;

  return (
    <MobileShell>
      <PageContainer>
        <Hero />
        <SoftSectionCard> 
          <Row gap="sm" justify="space-between"> 
            <TabButton 
              $active={true} 
              onClick={() => navigate("/owner/posts")} 
            > 
              게시글 
            </TabButton> 
            <TabButton onClick={() => navigate("/owner/proposals")}> 
              제휴관리 
            </TabButton> 
            <TabButton onClick={() => navigate("/owner/profile")}> 
              마이페이지 
            </TabButton> 
          </Row> 
        </SoftSectionCard>
        <SectionCard>
          {/* 상단 헤더 */}
          <FilterHeader>
            <FilterTitle>검색 필터</FilterTitle>

            <FilterToggle onClick={() => setIsFilterOpen((prev) => !prev)}>
              {isFilterOpen ? "필터 닫기 ▲" : "필터 열기 ▼"}
            </FilterToggle>
          </FilterHeader>

          {/* 1줄 — 항상 보임 */}
          <Row gap="md">
            <Col gap="sm">
              <Select label="카테고리"
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
              >
                <option value="">전체</option>
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
            </Col>

            <Col gap="sm">
              <Select label="유효기간"
                value={filters.duration}
                onChange={(e) => handleFilterChange("duration", e.target.value)}
              >
                <option value="">전체</option>
                <option value="1_month">1개월</option>
                <option value="2_months">2개월</option>
                <option value="3_months">3개월</option>
                <option value="6_months">6개월</option>
                <option value="1_year">1년</option>
              </Select>
            </Col>

            <Col gap="sm">
              <Select label="제휴 여부"
                value={filters.is_partnered}
                onChange={(e) => handleFilterChange("is_partnered", e.target.value)}
              >
                <option value="">전체</option>
                <option value="true">제휴 완료</option>
                <option value="false">제휴 모집중</option>
              </Select>
            </Col>
          </Row>


          {/* 접힘 상태: 상세 필터 숨김 */}
          {isFilterOpen && (
            <>
              {/* 2줄 */}
              <Row gap="md">
                {/* 최소 가격 */}
                <Col gap="sm">
                  <Input
                    label="최소 가격"
                    type="number"
                    step="500"
                    value={filters.expected_value_min}
                    placeholder="500"
                    onChange={(e) =>
                      handleFilterChange("expected_value_min", e.target.value)
                    }
                    onBlur={(e) =>
                      handlePriceBlurMin("expected_value_min", e.target.value)
                    }
                  />
                </Col>

                {/* 최대 가격 */}
                <Col gap="sm">
                  <Input
                    label="최대 가격"
                    type="number"
                    step="500"
                    value={filters.expected_value_max}
                    placeholder="5000"
                    onChange={(e) =>
                      handleFilterChange("expected_value_max", e.target.value)
                    }
                    onBlur={(e) =>
                      handlePriceBlurMax("expected_value_max", e.target.value)
                    }
                  />
                </Col>

                {/* 최소 월한도 */}
                <Col gap="sm">
                  <Input
                    label="최소 월한도"
                    type="number"
                    step="10"
                    value={filters.monthly_limit_min}
                    placeholder="10"
                    onChange={(e) =>
                      handleFilterChange("monthly_limit_min", e.target.value)
                    }
                    onBlur={(e) =>
                      handleMonthlyBlurMin("monthly_limit_min", e.target.value)
                    }
                  />
                </Col>

                {/* 최대 월한도 */}
                <Col gap="sm">
                  <Input
                    label="최대 월한도"
                    type="number"
                    step="10"
                    value={filters.monthly_limit_max}
                    placeholder="500"
                    onChange={(e) =>
                      handleFilterChange("monthly_limit_max", e.target.value)
                    }
                    onBlur={(e) =>
                      handleMonthlyBlurMax("monthly_limit_max", e.target.value)
                    }
                  />
                </Col>

              </Row>


              {/* 3줄 */}
              <Row gap="md">
                <Col gap="sm">
                  <Input
                    label="시작 날짜"
                    type="date"
                    value={filters.updated_at_after}
                    onChange={(e) =>
                      handleFilterChange("updated_at_after", e.target.value)
                    }
                  />
                </Col>

                <Col gap="sm">
                  <Input
                    label="종료 날짜"
                    type="date"
                    value={filters.updated_at_before}
                    onChange={(e) =>
                      handleFilterChange("updated_at_before", e.target.value)
                    }
                  />
                </Col>
              </Row>

              {/* 4줄 */}
              <Input
                label="쿠폰 설명 검색"
                value={filters.description}
                onChange={(e) => handleFilterChange("description", e.target.value)}
              />

              <Spacer size="sm" />
            </>
          )}

          {/* 🔥 초기화 / 검색 적용 — 항상 보임 */}
          <Row gap="sm">
            <SubtleButton onClick={resetFilters}>필터 초기화</SubtleButton>
            <PrimaryButton onClick={applyFilters}>검색 적용</PrimaryButton>
          </Row>

        </SectionCard>



        {/* 목록 */}
        <SectionCard title="제휴 게시글 목록">
          {loading && posts.length === 0 && !error && (
            <LoadingState>
              <Spinner />
              <LoadingText>게시글을 불러오는 중입니다...</LoadingText>
            </LoadingState>
          )}

          {!loading && error && (
            <>
              <ErrorText>{error}</ErrorText>
              <Spacer size="sm" />
              <PrimaryButton onClick={fetchPosts}>다시 시도</PrimaryButton>
            </>
          )}

          {hasNoResults && (
            <EmptyState>
              <EmptyTitle>검색 결과가 없습니다</EmptyTitle>
              <EmptyDescription>
                필터 조건을 변경해서 다시 검색해보세요.
              </EmptyDescription>
            </EmptyState>
          )}

          {!loading && !error && posts.length > 0 && (
            <PostsListWrapper>
              {posts.map((post) => {
                const meta = getStatusMeta(post.is_partnered);

                return (
                  <PostCard
                    key={post.id}
                    $disabled={post.is_partnered}
                    onClick={() =>
                      !post.is_partnered &&
                      navigate(`/owner/post/${post.id}`)
                    }
                  >
                    <RowHeader>
                      <StoreInfo>
                        <StoreName>{post.store_name}</StoreName>
                        <StoreMeta>
                          {getCategoryName(post.category)} • {post.owner_name} •{" "}
                          {formatDate(post.updated_at)}
                        </StoreMeta>
                      </StoreInfo>

                      <StatusBadge
                        label={meta.label}
                        bg={meta.bg}
                        color={meta.color}
                        dot={meta.dot}
                      />

                    </RowHeader>

                    <Divider />

                    <PostGrid>
                      <InfoBox>
                        <InfoLabel>쿠폰 설명</InfoLabel>
                        <InfoValue>{post.description}</InfoValue>
                      </InfoBox>

                      {/* 2) 예상 가치 */}
                      <InfoBox>
                        <InfoLabel>예상 가치</InfoLabel>
                        <InfoValue>{formatPrice(post.expected_value)}원</InfoValue>
                      </InfoBox>

                      {/* 3) 예상 기간 */}
                      <InfoBox>
                        <InfoLabel>예상 기간</InfoLabel>
                        <InfoValue>{formatDuration(post.expected_duration)}</InfoValue>
                      </InfoBox>

                      {/* 4) 월 한도 */}
                      <InfoBox>
                        <InfoLabel>월 한도</InfoLabel>
                        <InfoValue>{post.monthly_limit}매</InfoValue>
                      </InfoBox>
                    </PostGrid>
                  </PostCard>
                );
              })}
            </PostsListWrapper>
          )}
        </SectionCard>
        {!loading && (
          <PaginationWrapper>
            <PageButton
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
            >
              이전
            </PageButton>

            <PageNumbers>
              {getPageNumbers().map((item, idx) =>
                item === "..." ? (
                  <Ellipsis key={idx}>...</Ellipsis>
                ) : (
                  <PageNumber
                    key={item}
                    $active={item === currentPage}
                    onClick={() => goToPage(item)}
                  >
                    {item}
                  </PageNumber>
                )
              )}
            </PageNumbers>

            <PageButton
              disabled={currentPage === totalPages}
              onClick={() => goToPage(currentPage + 1)}
            >
              다음
            </PageButton>
          </PaginationWrapper>
        )}
        <FooterText>네이비즈 소상공인 제휴 플랫폼</FooterText>
      </PageContainer>
    </MobileShell>
  );
};

export default PostsListPage;

/* ------------------------
   Styled Components
------------------------- */
const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.sm}px;
`;

const FilterTitle = styled.div`
  font-size: ${typography.subtitle.size};
  font-weight: ${typography.subtitle.weight};
  color: ${colors.textPrimary};
`;

const FilterToggle = styled.div`
  font-size: ${typography.small.size};
  color: ${colors.primaryDark};
  cursor: pointer;
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

const EmptyState = styled.div`
  padding: ${spacing.lg}px 0;
  text-align: center;
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

const PostsListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md}px;
  margin-top: ${spacing.sm}px;
`;

const PostCard = styled(ClickableCard)`
  background: ${colors.white};
  border-radius: ${radius.lg}px;
  opacity: ${(p) => (p.$disabled ? 0.6 : 1)};
  cursor: ${(p) => (p.$disabled ? "default" : "pointer")};
`;

const RowHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StoreInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StoreName = styled.div`
  font-size: ${typography.subtitle.size};
  font-weight: ${typography.subtitle.weight};
  color: ${colors.textPrimary};
`;

const StoreMeta = styled.div`
  font-size: ${typography.small.size};
  color: ${colors.textSecondary};
`;

const PostGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${spacing.sm}px;
  margin-top: ${spacing.md}px;
`;

const InfoBox = styled.div`
  flex: 1;
  padding: ${spacing.sm}px;
  border-radius: ${radius.md}px;
  background: ${colors.bgBase};
`;

const InfoLabel = styled.div`
  font-size: ${typography.small.size};
  color: ${colors.textSecondary};
`;

const InfoValue = styled.div`
  font-size: ${typography.bodyBold.size};
`;


const FooterText = styled.div`
  text-align: center;
  font-size: ${typography.small.size};
  color: ${colors.textMuted};
`;


const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${spacing.sm}px;
  margin-top: ${spacing.lg}px;
`;

const PageButton = styled.button`
  padding: 6px 12px;
  font-size: ${typography.body.size};
  border-radius: ${radius.md}px;
  background: ${(p) => (p.disabled ? colors.bgSoft : colors.bgPaper)};
  color: ${(p) => (p.disabled ? colors.textMuted : colors.textPrimary)};
  cursor: ${(p) => (p.disabled ? "default" : "pointer")};
  border: none;
`;

const PageNumbers = styled.div`
  display: flex;
  gap: ${spacing.xs}px;
`;

const PageNumber = styled.div`
  padding: 6px 10px;
  border-radius: ${radius.md}px;
  cursor: pointer;
  background: ${(p) => (p.$active ? colors.primary : colors.white)};
  color: ${(p) => (p.$active ? colors.textOnPrimary : colors.textPrimary)};
  border: 1px solid ${colors.bgPaper};
`;

const Ellipsis = styled.div`
  padding: 6px 10px;
  color: ${colors.textSecondary};
`;

