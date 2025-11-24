// src/pages/owner/coupons/CouponSetupPage.jsx
import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
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
  PrimaryButton,
  ErrorBox,
  SuccessBox,
  Spacer,
  Row,
  Col
} from "../../../design/components";
import Textarea from "../../../design/components/Textarea";

// Tokens
import { colors } from "../../../design/tokens/colors";
import { spacing } from "../../../design/tokens/spacing";
import { radius } from "../../../design/tokens/radius";
import { typography } from "../../../design/tokens/typography";

export default function CouponSetupPage() {
  const navigate = useNavigate();
  const { apiCall } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    description: "",
    expected_value: "",
    expected_duration: "3_months",
    monthly_limit: "",
  });

  const durationOptions = [
    { value: "1_month", label: "1개월" },
    { value: "2_months", label: "2개월" },
    { value: "3_months", label: "3개월" },
    { value: "6_months", label: "6개월" },
    { value: "1_year", label: "1년" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError("");
    setSuccess("");
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatPrice = (v) => {
    if (!v) return "";
    return Number(v).toLocaleString("ko-KR");
  };

  const isFormValid = () =>
    formData.description.trim() &&
    Number(formData.expected_value) > 0 &&
    Number(formData.monthly_limit) > 0;

  const handleSubmit = async () => {
    if (isLoading) return;
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const data = {
        description: formData.description.trim(),
        expected_value: parseInt(formData.expected_value),
        expected_duration: formData.expected_duration,
        monthly_limit: parseInt(formData.monthly_limit),
      };

      const res = await apiCall({
        method: "POST",
        url: "/coupons/policy/",
        data,
      });

      if (res?.success) {
        setSuccess("쿠폰 정책이 성공적으로 등록되었습니다!");
        setTimeout(() => navigate("/owner/profile"), 0);
      } else {
        setError(res?.message || "쿠폰 정책 등록에 실패했습니다.");
      }
    } catch (err){
      const serverMessage = err?.response?.data?.message;
      if (serverMessage) {
        setError(serverMessage);
      } else {
        setError("쿠폰 정책 등록 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MobileShell>
      <PageContainer>
        <Spacer size="xs" />

        <ScreenHeader
          title="쿠폰 정책 설정"
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
                step="500"
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
                label="제휴 기간"
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
            <li>등록 후 제휴 게시글이 자동으로 생성됩니다.</li>
            <li>제휴 성사 시 QR 코드가 자동 발급됩니다.</li>
            <li>월 한도는 NeighBiz가 자동으로 관리해드립니다.</li>
            <li>제휴 성사 전까지 자유롭게 수정 가능합니다.</li>
          </InfoList>
        </SoftSectionCard>

        {error && <ErrorBox>{error}</ErrorBox>}
        {success && <SuccessBox>{success}</SuccessBox>}

        <PrimaryButton
          onClick={handleSubmit}
          disabled={isLoading || !isFormValid()}
        >
          {isLoading ? "등록 중..." : "쿠폰 정책 등록하기"}
        </PrimaryButton>
      </PageContainer>
    </MobileShell>
  );
}

/* -----------------------------
   Styled Components
----------------------------- */

const HelpText = styled.div`
  margin-top: 4px;
  font-size: ${typography.small.size};
  color: ${colors.textSecondary};
`;

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
