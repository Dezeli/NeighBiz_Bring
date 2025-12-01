// src/pages/owner/coupons/CouponEditPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../../context/AuthContext";

// Layout
import MobileShell from "../../../design/layout/MobileShell";
import PageContainer from "../../../design/layout/PageContainer";
import ScreenHeader from "../../../design/layout/ScreenHeader";

// UI Kit
import {
  SectionCard,
  SoftSectionCard,
  Input,
  Select,
  Textarea,
  PrimaryButton,
  ErrorBox,
  SuccessBox,
  Spacer,
  Row,
  Col,
} from "../../../design/components";

// Tokens
import { colors } from "../../../design/tokens/colors";
import { spacing } from "../../../design/tokens/spacing";
import { typography } from "../../../design/tokens/typography";

export default function CouponEditPage() {
  const navigate = useNavigate();
  const { apiCall } = useAuth();

  const [formData, setFormData] = useState({
    description: "",
    expected_value: "",
    expected_duration: "3_months",
    monthly_limit: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const durationOptions = [
    { value: "1_month", label: "1개월" },
    { value: "2_months", label: "2개월" },
    { value: "3_months", label: "3개월" },
    { value: "6_months", label: "6개월" },
    { value: "1_year", label: "1년" },
  ];

  // fetch existing policy
  useEffect(() => {
    fetchPolicy();
  }, []);

  const fetchPolicy = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await apiCall({
        method: "GET",
        url: "/coupons/policy/",
      });

      if (res?.data) {
        setFormData({
          description: res.data.description || "",
          expected_value: res.data.expected_value || "",
          expected_duration: res.data.expected_duration || "3_months",
          monthly_limit: res.data.monthly_limit || "",
        });
      }
    } catch (err) {
      setError("쿠폰 정책 정보를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError("");
    setSuccess("");
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = () =>
    formData.description.trim() &&
    Number(formData.expected_value) > 0 &&
    Number(formData.monthly_limit) > 0;

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const res = await apiCall({
        method: "PATCH",
        url: "/coupons/policy/",
        data: {
          description: formData.description.trim(),
          expected_value: Number(formData.expected_value),
          expected_duration: formData.expected_duration,
          monthly_limit: Number(formData.monthly_limit),
        },
      });

      if (res?.success) {
        setSuccess("쿠폰 정책이 성공적으로 수정되었습니다!");
        setTimeout(() => navigate("/owner/profile"), 0);
      } else {
        setError(res?.message || "쿠폰 정책 수정에 실패했습니다.");
      }
    } catch (err) {
      const serverMessage = err?.response?.data?.message;
      setError(serverMessage || "쿠폰 정책 수정 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <MobileShell>
        <PageContainer>
          <Spacer size="xl" />
          <div style={{ color: colors.textSecondary }}>불러오는 중...</div>
        </PageContainer>
      </MobileShell>
    );

  return (
    <MobileShell>
      <PageContainer>
        <Spacer size="xs" />

        <ScreenHeader
          title="쿠폰 정책 수정"
          showBack
          onBack={() => navigate("/owner/profile")}
        />

        <SectionCard title="쿠폰 기본 정보">
          <Textarea
            label="쿠폰 설명"
            name="description"
            placeholder="고객에게 제공될 쿠폰 내용을 적어주세요."
            value={formData.description}
            onChange={handleChange}
          />

          <Row gap="sm">
            <Col>
              <Input
                label="예상 가치 (원)"
                name="expected_value"
                type="number"
                placeholder="500"
                step="100"
                unit="원"
                value={formData.expected_value}
                onChange={handleChange}
                onBlur={(e) => {
                  const raw = Number(e.target.value);
                  if (isNaN(raw)) return;

                  const rounded = Math.floor(raw / 500) * 500;
                  setFormData((prev) => ({ ...prev, expected_value: rounded }));
                }}
              />
            </Col>

            <Col>
              <Input
                label="월 한도 (매)"
                name="monthly_limit"
                type="number"
                placeholder="100"
                step="10"
                unit="매"
                value={formData.monthly_limit}
                onChange={handleChange}
                onBlur={(e) => {
                  const raw = Number(e.target.value);
                  if (isNaN(raw)) return;

                  const rounded = Math.floor(raw / 10) * 10;
                  setFormData((prev) => ({ ...prev, monthly_limit: rounded }));
                }}
              />
            </Col>

            <Col>
              <Select
                label="유효 기간"
                name="expected_duration"
                value={formData.expected_duration}
                onChange={handleChange}
              >
                {durationOptions.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </Select>
            </Col>
          </Row>
        </SectionCard>

        <SoftSectionCard>
          <InfoTitle>💡 쿠폰 정책 안내</InfoTitle>
          <InfoList>
            <li>수정 후 제휴 게시글이 자동으로 갱신됩니다.</li>
            <li>제휴 성사 시 QR 코드가 자동 발급됩니다.</li>
            <li>월 한도는 NeighBiz가 자동으로 관리해드립니다.</li>
            <li>제휴 성사 전까지 자유롭게 수정 가능합니다.</li>
          </InfoList>
        </SoftSectionCard>

        {error && <ErrorBox>{error}</ErrorBox>}
        {success && <SuccessBox>{success}</SuccessBox>}

        <PrimaryButton
          onClick={handleSubmit}
          disabled={submitting || !isFormValid()}
        >
          {submitting ? "수정 중..." : "수정 완료"}
        </PrimaryButton>

        <Spacer size="xl" />
      </PageContainer>
    </MobileShell>
  );
}

/* Styled UI */
const InfoTitle = styled.div`
  font-size: ${typography.bodyBold.size};
  color: ${colors.textPrimary};
  margin-bottom: ${spacing.xs}px;
`;

const InfoList = styled.ul`
  font-size: ${typography.small.size};
  color: ${colors.textSecondary};
  line-height: 1.4;
  margin: 0;
  padding-left: 1rem;

  li {
    margin-bottom: 4px;
  }
`;
