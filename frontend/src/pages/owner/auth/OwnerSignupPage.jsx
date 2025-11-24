// src/pages/owner/auth/OwnerSignupPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// API
import api from "../../../utils/api";

// Layout + UI Kit
import MobileShell from "../../../design/layout/MobileShell";
import PageContainer from "../../../design/layout/PageContainer";
import {
  Input,
  PrimaryButton,
  GhostButton,
  SubtleButton,
  Divider,
  Spacer,
  SectionCard,
  Hero,
  ErrorBox,
  SuccessBox,
  Select,
} from "../../../design/components";

import styled from "styled-components";
import { colors } from "../../../design/tokens/colors";
import { spacing } from "../../../design/tokens/spacing";
import { typography } from "../../../design/tokens/typography";

/* ---------------------------------------------------------
   Sub Component: ImageUpload (미리보기 + S3 업로드 트리거)
   - ProfileEditPage 스타일과 통일
--------------------------------------------------------- */
function ImageUpload({
  label,
  imageKey,
  uploading,
  onFileSelect,
  helperText,
  disabled,
}) {
  const [previewUrl, setPreviewUrl] = useState("");

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    if (onFileSelect) onFileSelect(file);
  };

  const isDisabled = disabled || uploading;

  return (
    <UploadArea>
      <UploadLabel>{label}</UploadLabel>

      {previewUrl && (
        <ImagePreviewWrapper>
          <ImagePreview src={previewUrl} alt="이미지 미리보기" />
        </ImagePreviewWrapper>
      )}

      <FileLabel>
        <HiddenFileInput
          type="file"
          accept="image/*"
          onChange={handleChange}
          disabled={isDisabled}
        />
        <FileButton disabled={isDisabled}>
          <span>📷</span>
          <span>
            {uploading
              ? "업로드 중..."
              : imageKey
              ? "이미지 다시 선택하기"
              : "이미지 선택하기"}
          </span>
        </FileButton>
      </FileLabel>

      {imageKey && !uploading && (
        <HelpText>✓ 업로드가 완료되었습니다.</HelpText>
      )}
      {helperText && <HelpText>{helperText}</HelpText>}
    </UploadArea>
  );
}

/* ---------------------------------------------------------
   Sub Component: BusinessHoursCard
   - ProfileEditPage와 동일한 스타일 기반
--------------------------------------------------------- */
function BusinessHoursCard({ businessHours, onChange, disabled }) {
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

  return (
    <HoursWrapper>
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
    </HoursWrapper>
  );
}

/* ---------------------------------------------------------
   메인 페이지: OwnerSignupPage
--------------------------------------------------------- */
export default function OwnerSignupPage() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [storeImageUploading, setStoreImageUploading] = useState(false);
  const [licenseUploading, setLicenseUploading] = useState(false);

  const [error, setError] = useState("");

  // username 중복확인
  const [usernameValid, setUsernameValid] = useState(null);
  const [usernameError, setUsernameError] = useState("");

  // 전화번호 인증
  const [timer, setTimer] = useState(0);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  // 전체 form 데이터
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    passwordConfirm: "",
    name: "",
    phone_number: "",
    verification_code: "",
    business_license_image: "",
    store: {
      name: "",
      phone: "",
      address: "",
      category: "",
      description: "",
      image_url: "",
      business_hours: {
        mon: { open: "10:00", close: "20:00", closed: false },
        tue: { open: "10:00", close: "20:00", closed: false },
        wed: { open: "10:00", close: "20:00", closed: false },
        thu: { open: "10:00", close: "20:00", closed: false },
        fri: { open: "10:00", close: "20:00", closed: false },
        sat: { open: "10:00", close: "20:00", closed: false },
        sun: { open: "10:00", close: "20:00", closed: false },
      },
    },
  });

  /* ---------------------------------------------------------
     Timer
  --------------------------------------------------------- */
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const formatPhone = (v) => v.replace(/\D/g, "");

  /* ---------------------------------------------------------
     Handle Change
  --------------------------------------------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setError("");

    if (name === "username") {
      setUsernameValid(null);
      setUsernameError("");
    }

    if (name.startsWith("store.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        store: { ...prev.store, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBusinessHoursChange = (day, field, value) => {
    setFormData((prev) => ({
      ...prev,
      store: {
        ...prev.store,
        business_hours: {
          ...prev.store.business_hours,
          [day]: { ...prev.store.business_hours[day], [field]: value },
        },
      },
    }));
  };

  /* ---------------------------------------------------------
     Username Check
  --------------------------------------------------------- */
  const handleCheckUsername = async () => {
    const username = formData.username.trim();

    if (!username) {
      setUsernameError("아이디를 입력해주세요.");
      return;
    }

    try {
      const res = await api.post("/accounts/check-username/", {
        username,
      });

      if (res.data.data.available) {
        setUsernameValid(true);
        setUsernameError("");
      } else {
        const serverMsg =
          res.data.data?.username?.[0] || res.data.data.global;
        setUsernameValid(false);
        setUsernameError(serverMsg);
      }
    } catch (err) {
      const serverMsg =
        err.response?.data?.data?.username?.[0] ||
        err.response?.data?.message ||
        "아이디 확인 중 오류가 발생했습니다.";
      setUsernameValid(false);
      setUsernameError(serverMsg);
    }
  };

  /* ---------------------------------------------------------
     Phone Verification
  --------------------------------------------------------- */
  const handleSendCode = async () => {
    const phone = formatPhone(formData.phone_number);
    if (phone.length !== 11) {
      setError("올바른 전화번호 11자리를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await api.post("/accounts/phone-verify-request/", {
        phone_number: phone,
      });

      if (!res.data.success) {
        setError(res.data.message);
        return;
      }

      setTimer(180);
      setIsVerificationSent(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "인증번호 요청 중 오류가 발생했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setIsLoading(true);
    setError("");

    try {
      const res = await api.post("/accounts/phone-verify/", {
        phone_number: formatPhone(formData.phone_number),
        code: formData.verification_code,
      });

      if (!res.data.success) {
        setError(res.data.message);
        return;
      }

      setIsPhoneVerified(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "인증번호 확인 중 오류가 발생했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------------------------------------------------
     Image Upload (S3)
  --------------------------------------------------------- */
  const handleImageUpload = async (file, type) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 업로드해주세요.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("이미지는 5MB 이하로만 업로드 가능합니다.");
      return;
    }

    const setUploading =
      type === "store_image"
        ? setStoreImageUploading
        : setLicenseUploading;

    setUploading(true);

    try {
      const res = await api.post("/upload/image/", {
        filename: file.name,
        content_type: file.type,
        image_type: type,
      });

      const { upload_url, key } = res.data.data;

      const put = await fetch(upload_url, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!put.ok) throw new Error("업로드 실패");

      if (type === "store_image") {
        setFormData((prev) => ({
          ...prev,
          store: { ...prev.store, image_url: key },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          business_license_image: key,
        }));
      }
    } catch (err) {
      setError("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  /* ---------------------------------------------------------
     Step Validation
  --------------------------------------------------------- */
  const getStepError = (step) => {
    if (step === 1) {
      if (!formData.username.trim()) return "아이디를 입력해주세요.";
      if (usernameValid !== true) return "아이디 중복확인을 완료해주세요.";
      if (!formData.password.trim()) return "비밀번호를 입력해주세요.";
      if (!formData.passwordConfirm.trim())
        return "비밀번호 확인을 입력해주세요.";
      if (formData.password !== formData.passwordConfirm)
        return "비밀번호가 일치하지 않습니다.";
      if (!formData.name.trim()) return "사장님 성함을 입력해주세요.";
      if (!isPhoneVerified) return "전화번호 인증을 완료해주세요.";
    }

    if (step === 2) {
      if (!formData.store.name.trim()) return "가게명을 입력해주세요.";
      if (!formData.store.phone.trim())
        return "가게 전화번호를 입력해주세요.";
      if (!formData.store.address.trim())
        return "주소를 입력해주세요.";
      if (!formData.store.category.trim())
        return "카테고리를 선택해주세요.";
    }

    if (step === 3) {
      if (!formData.store.description.trim())
        return "가게 설명을 입력해주세요.";
      if (!formData.store.image_url.trim())
        return "가게 이미지를 업로드해주세요.";
    }

    if (step === 4) {
      if (!formData.business_license_image.trim())
        return "사업자등록증 이미지를 업로드해주세요.";
    }

    return null;
  };

  const nextStep = () => {
    const err = getStepError(currentStep);
    if (err) return setError(err);

    setError("");
    setCurrentStep((s) => s + 1);
  };

  const prevStep = () => {
    setError("");
    setCurrentStep((s) => s - 1);
  };

  /* ---------------------------------------------------------
     Submit
  --------------------------------------------------------- */
  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");

    try {
      const hours = {};
      Object.entries(formData.store.business_hours).forEach(([day, h]) => {
        if (h.closed) hours[day] = { closed: true };
        else hours[day] = { open: h.open, close: h.close };
      });

      const payload = {
        username: formData.username,
        password: formData.password,
        name: formData.name,
        phone_number: formatPhone(formData.phone_number),
        business_license_image: formData.business_license_image,
        store: {
          ...formData.store,
          business_hours: hours,
        },
      };

      const res = await api.post("/accounts/owner-signup/", payload);

      if (!res.data.success) {
        return setError(res.data.message);
      }

      alert("회원가입이 완료되었습니다!");
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "회원가입 중 오류가 발생했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------------------------------------------------
     Steps UI
  --------------------------------------------------------- */
  const Step1 = (
    <SectionCard title="계정 정보">
      <Input
        label="아이디"
        name="username"
        value={formData.username}
        onChange={handleChange}
      />

      <PrimaryButton type="button" onClick={handleCheckUsername}>
        중복확인
      </PrimaryButton>

      {usernameError && <ErrorBox>{usernameError}</ErrorBox>}
      {usernameValid === true && (
        <SuccessBox>✓ 사용 가능한 아이디입니다.</SuccessBox>
      )}

      <Input
        label="비밀번호"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
      />

      <Input
        label="비밀번호 확인"
        name="passwordConfirm"
        type="password"
        value={formData.passwordConfirm}
        onChange={handleChange}
        error={
          formData.passwordConfirm &&
          formData.passwordConfirm !== formData.password
            ? "비밀번호가 일치하지 않습니다."
            : ""
        }
      />

      <Input
        label="사장님 성함"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />

      <Input
        label="전화번호"
        name="phone_number"
        value={formData.phone_number}
        onChange={handleChange}
        disabled={isPhoneVerified}
      />

      {!isPhoneVerified && (
        <PrimaryButton type="button" onClick={handleSendCode}>
          인증번호 받기
        </PrimaryButton>
      )}

      {isVerificationSent && !isPhoneVerified && (
        <>
          <Input
            label={`인증번호 (${timer > 0 ? formatTime(timer) : "만료"})`}
            name="verification_code"
            maxLength={6}
            value={formData.verification_code}
            onChange={handleChange}
          />

          <PrimaryButton
            type="button"
            onClick={handleVerifyCode}
            disabled={timer === 0 || formData.verification_code.length !== 6}
          >
            인증 확인
          </PrimaryButton>
        </>
      )}

      {isPhoneVerified && <SuccessBox>✓ 번호 인증 완료</SuccessBox>}
    </SectionCard>
  );

  const Step2 = (
    <SectionCard title="가게 기본 정보">
      <Input
        label="가게명"
        name="store.name"
        value={formData.store.name}
        onChange={handleChange}
      />

      <Input
        label="가게 전화번호"
        name="store.phone"
        value={formData.store.phone}
        onChange={handleChange}
      />

      <Input
        label="주소"
        name="store.address"
        value={formData.store.address}
        onChange={handleChange}
      />

      <Select
        label="카테고리"
        name="store.category"
        value={formData.store.category}
        onChange={handleChange}
      >
        <option value="">카테고리를 선택하세요</option>
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
    </SectionCard>
  );

  const Step3 = (
    <SectionCard title="상세 정보">
      <Input
        label="가게 설명"
        name="store.description"
        value={formData.store.description}
        onChange={handleChange}
      />

      <ImageUpload
        label="가게 이미지 업로드"
        imageKey={formData.store.image_url}
        uploading={storeImageUploading}
        onFileSelect={(file) => handleImageUpload(file, "store_image")}
        helperText="이미지는 5MB 이하의 파일만 업로드 가능합니다."
      />

      <Divider />

      <BusinessHoursCard
        businessHours={formData.store.business_hours}
        onChange={handleBusinessHoursChange}
        disabled={isLoading}
      />
    </SectionCard>
  );

  const Step4 = (
    <SectionCard title="사업자 등록증">
      <ImageUpload
        label="사업자등록증 업로드"
        uploading={licenseUploading}
        imageKey={formData.business_license_image}
        onFileSelect={(file) => handleImageUpload(file, "business_license")}
        helperText="사업자등록증 이미지는 명확하게 보이도록 업로드해주세요."
      />
    </SectionCard>
  );

  const Steps = { 1: Step1, 2: Step2, 3: Step3, 4: Step4 };

  /* ---------------------------------------------------------
     렌더링
  --------------------------------------------------------- */
  return (
    <MobileShell>
      <PageContainer>
        <Hero title="사장님 회원가입" />

        <ProgressBox>
          {Array.from({ length: 4 }).map((_, i) => (
            <ProgressDot key={i} active={i < currentStep} />
          ))}
        </ProgressBox>

        {Steps[currentStep]}

        {error && <ErrorBox>{error}</ErrorBox>}

        <Spacer size="md" />

        <ButtonRow>
          {currentStep > 1 && (
            <GhostButton onClick={prevStep}>이전</GhostButton>
          )}

          {currentStep < 4 ? (
            <PrimaryButton onClick={nextStep}>다음</PrimaryButton>
          ) : (
            <PrimaryButton onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "가입 중..." : "회원가입 완료"}
            </PrimaryButton>
          )}
        </ButtonRow>

        <Spacer size="lg" />

        <CenterRow>
          <SubtleButton onClick={() => navigate("/login")}>
            이미 계정이 있으신가요? 로그인하기
          </SubtleButton>
        </CenterRow>
      </PageContainer>
    </MobileShell>
  );
}

/* ----------------------------- Styles ----------------------------- */

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
`;

const ProgressBox = styled.div`
  display: flex;
  gap: 8px;
  padding: ${spacing.md}px 0;
`;

const ProgressDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ active }) => (active ? colors.primary : colors.textMuted)};
  opacity: ${({ active }) => (active ? 1 : 0.4)};
`;

const CenterRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

/* ---- Upload Styles ---- */
const UploadArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm}px;
`;

const UploadLabel = styled.div`
  font-size: ${typography.bodyBold.size};
  font-weight: ${typography.bodyBold.weight};
  color: ${colors.textPrimary};
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

/* ---- Common ---- */
const HelpText = styled.div`
  margin-top: 4px;
  font-size: ${typography.small.size};
  color: ${colors.textSecondary};
`;

/* ---- Business Hours Styles ---- */
const HoursWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: ${spacing.sm}px;
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
