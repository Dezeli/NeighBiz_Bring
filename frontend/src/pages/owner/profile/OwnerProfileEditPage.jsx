// src/pages/owner/profile/OwnerProfileEditPage.jsx
import { useEffect, useState } from "react";
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
  Input,
  Select,
  Textarea,
  PrimaryButton,
  GhostButton,
  ErrorBox,
  SuccessBox,
  Spacer,
} from "../../../design/components";

// Tokens
import { colors } from "../../../design/tokens/colors";
import { spacing } from "../../../design/tokens/spacing";
import { typography } from "../../../design/tokens/typography";

const defaultBusinessHours = {
  mon: { open: "", close: "", closed: false },
  tue: { open: "", close: "", closed: false },
  wed: { open: "", close: "", closed: false },
  thu: { open: "", close: "", closed: false },
  fri: { open: "", close: "", closed: false },
  sat: { open: "", close: "", closed: false },
  sun: { open: "", close: "", closed: false },
};

const daysKo = {
  mon: "월요일",
  tue: "화요일",
  wed: "수요일",
  thu: "목요일",
  fri: "금요일",
  sat: "토요일",
  sun: "일요일",
};

const timeOptions = Array.from({ length: 48 }).map((_, i) => {
  const h = Math.floor(i / 2)
    .toString()
    .padStart(2, "0");
  const m = i % 2 === 0 ? "00" : "30";
  return `${h}:${m}`;
});

export default function OwnerProfileEditPage() {
  const navigate = useNavigate();
  const { apiCall } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    category: "cafe",
    description: "",
    image_url: "",
    business_hours: defaultBusinessHours,
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const mergeBusinessHours = (bh) => {
    if (!bh) return defaultBusinessHours;
    const result = { ...defaultBusinessHours };
    Object.keys(result).forEach((day) => {
      result[day] = {
        ...result[day],
        ...(bh[day] || {}),
      };
    });
    return result;
  };

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await apiCall({
        method: "GET",
        url: "/accounts/owner-profile/",
      });

      if (response?.data?.store) {
        const store = response.data.store;
        setFormData({
          name: store.name || "",
          phone: store.phone || "",
          address: store.address || "",
          category: store.category || "cafe",
          description: store.description || "",
          image_url: store.image_url || "",
          business_hours: mergeBusinessHours(store.business_hours),
        });
        setPreviewUrl(store.image_url || "");
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setError("정보를 불러오는데 실패했습니다.");
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

  const handleBusinessHoursChange = (day, field, value) => {
    setError("");
    setSuccess("");
    setFormData((prev) => ({
      ...prev,
      business_hours: {
        ...prev.business_hours,
        [day]: {
          ...prev.business_hours[day],
          [field]: value,
        },
      },
    }));
  };

  const handleFileChange = (file) => {
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError("");
    setSuccess("");
  };

  const uploadImage = async (file) => {
    const uploadResponse = await apiCall({
      method: "POST",
      url: "/upload/image/",
      data: {
        filename: file.name,
        content_type: file.type,
        image_type: "store_image",
      },
    });

    if (!uploadResponse?.data?.upload_url || !uploadResponse?.data?.key) {
      throw new Error("업로드 URL을 받지 못했습니다.");
    }

    const uploadUrl = uploadResponse.data.upload_url;
    const imageKey = uploadResponse.data.key;

    const putResponse = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!putResponse.ok) {
      throw new Error("이미지 업로드에 실패했습니다.");
    }

    return imageKey;
  };

  const handleSubmit = async () => {
    if (submitting) return;

    if (!formData.name.trim()) {
      setError("가게명을 입력해주세요.");
      return;
    }
    if (!formData.phone.trim()) {
      setError("전화번호를 입력해주세요.");
      return;
    }
    if (!formData.address.trim()) {
      setError("주소를 입력해주세요.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      let imageUrl = formData.image_url;

      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      const response = await apiCall({
        method: "PATCH",
        url: "/stores/owner-store/",
        data: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          category: formData.category,
          description: formData.description.trim(),
          image_url: imageUrl,
          business_hours: formData.business_hours,
        },
      });

      if (response?.success) {
        setSuccess("가게 정보가 성공적으로 수정되었습니다!");
        setTimeout(() => navigate("/owner/profile"), 0);
      } else {
        const errorMsg =
          response?.data?.global ||
          response?.message ||
          "정보 수정에 실패했습니다.";
        setError(errorMsg);
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
      const errorMsg =
        err?.response?.data?.message || "정보 수정에 실패했습니다.";
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/owner/profile");
  };

  if (loading) {
    return (
      <MobileShell>
        <PageContainer>
          <Spacer size="xl" />
          <LoadingText>정보를 불러오는 중...</LoadingText>
        </PageContainer>
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      <PageContainer>
        <Spacer size="xs" />

        <ScreenHeader
          title="가게 정보 수정"
          showBack
          onBack={() => navigate("/owner/profile")}
        />

        <SectionCard title="기본 정보">
          <Input
            label="가게 이름"
            name="name"
            placeholder="가게 이름을 입력하세요"
            value={formData.name}
            onChange={handleChange}
          />
          <Input
            label="전화번호"
            name="phone"
            placeholder="01012345678"
            value={formData.phone}
            onChange={handleChange}
          />
          <Input
            label="주소"
            name="address"
            placeholder="주소를 입력하세요"
            value={formData.address}
            onChange={handleChange}
          />
          <Select
            label="카테고리"
            name="category"
            value={formData.category}
            onChange={handleChange}
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
          <Textarea
            label="가게 설명"
            name="description"
            placeholder="가게를 소개하는 설명을 입력하세요"
            value={formData.description}
            onChange={handleChange}
          />
        </SectionCard>

        <BusinessHoursCard
          businessHours={formData.business_hours}
          onChange={handleBusinessHoursChange}
          disabled={submitting}
        />

        <ImageUpload
          label="가게 이미지"
          previewUrl={previewUrl}
          selectedFile={selectedFile}
          onFileSelect={handleFileChange}
          disabled={submitting}
        />

        {error && <ErrorBox>{error}</ErrorBox>}
        {success && <SuccessBox>{success}</SuccessBox>}

        <ButtonRow>
          <PrimaryButton onClick={handleSubmit} disabled={submitting}>
            {submitting ? "수정 중..." : "수정 완료"}
          </PrimaryButton>
        </ButtonRow>

        <Spacer size="xl" />
      </PageContainer>
    </MobileShell>
  );
}

/* -----------------------------
   Sub Components & Styles
----------------------------- */

function BusinessHoursCard({ businessHours, onChange, disabled }) {
  return (
    <SectionCard title="영업시간">
      {Object.entries(businessHours).map(([day, h]) => (
        <DayRow key={day}>
          <DayLabel>{daysKo[day] || day.toUpperCase()}</DayLabel>

          <Checkbox
            type="checkbox"
            checked={!!h.closed}
            onChange={(e) => onChange(day, "closed", e.target.checked)}
            disabled={disabled}
          />
          <span>휴무</span>

          {!h.closed && (
            <>
              <TimeSelect
                value={h.open || ""}
                onChange={(e) => onChange(day, "open", e.target.value)}
                disabled={disabled}
              >
                <option value="">오픈 시간</option>
                {timeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </TimeSelect>
              <Tilde>~</Tilde>
              <TimeSelect
                value={h.close || ""}
                onChange={(e) => onChange(day, "close", e.target.value)}
                disabled={disabled}
              >
                <option value="">마감 시간</option>
                {timeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </TimeSelect>
            </>
          )}
        </DayRow>
      ))}
      <HelpText>각 요일별 오픈/마감 시간과 휴무 여부를 설정하세요.</HelpText>
    </SectionCard>
  );
}

function ImageUpload({
  label,
  previewUrl,
  selectedFile,
  onFileSelect,
  helperText,
  disabled,
}) {
  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onFileSelect) {
      onFileSelect(file);
    }
  };

  return (
    <SectionCard title={label}>
      <UploadArea>
        {previewUrl && (
          <ImagePreviewWrapper>
            <ImagePreview src={previewUrl} alt="가게 이미지 미리보기" />
          </ImagePreviewWrapper>
        )}

        <FileLabel>
          <HiddenFileInput
            type="file"
            accept="image/*"
            onChange={handleChange}
            disabled={disabled}
          />
          <FileButton disabled={disabled}>
            <span>📷</span>
            <span>
              {selectedFile ? selectedFile.name : "이미지 선택 또는 변경하기"}
            </span>
          </FileButton>
        </FileLabel>

        {helperText && <HelpText>{helperText}</HelpText>}
      </UploadArea>
    </SectionCard>
  );
}

const LoadingText = styled.div`
  color: ${colors.textSecondary};
  font-size: ${typography.body.size};
`;

const ButtonRow = styled.div`
  display: flex;
  gap: ${spacing.sm}px;
  margin-top: ${spacing.sm}px;
`;

const HelpText = styled.div`
  margin-top: 4px;
  font-size: ${typography.small.size};
  color: ${colors.textSecondary};
`;

const UploadArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm}px;
`;

const ImagePreviewWrapper = styled.div`
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${colors.gray200};
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
`;

const FileLabel = styled.label`
  width: 100%;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const FileButton = styled.div`
  width: 100%;
  height: 44px;
  border-radius: 999px;
  border: 1.5px dashed ${colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.xs}px;
  font-size: ${typography.small.size};
  color: ${colors.primary};
  cursor: pointer;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const DayRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xs}px;
  margin-bottom: 4px;
`;

const DayLabel = styled.div`
  width: 56px;
  font-size: ${typography.small.size};
  font-weight: 600;
`;

const Checkbox = styled.input`
  transform: scale(1.1);
`;

const TimeSelect = styled.select`
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid ${colors.gray300};
  font-size: ${typography.small.size};
`;

const Tilde = styled.span`
  font-size: ${typography.small.size};
  color: ${colors.textSecondary};
`;
