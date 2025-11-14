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
} from "../../../design/components";

import styled from "styled-components";
import { colors } from "../../../design/tokens/colors";
import { spacing } from "../../../design/tokens/spacing";

export default function OwnerSignupPage() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [licenseUploading, setLicenseUploading] = useState(false);
  const [error, setError] = useState("");

  // 전화번호 인증
  const [timer, setTimer] = useState(0);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  // 전체 form 데이터
  const [formData, setFormData] = useState({
    username: "",
    password: "",
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
        mon: { open: "10:00", close: "20:00", closed: false, hasBreak: false, breakStart: "14:00", breakEnd: "16:00" },
        tue: { open: "10:00", close: "20:00", closed: false, hasBreak: false, breakStart: "14:00", breakEnd: "16:00" },
        wed: { open: "10:00", close: "20:00", closed: false, hasBreak: false, breakStart: "14:00", breakEnd: "16:00" },
        thu: { open: "10:00", close: "20:00", closed: false, hasBreak: false, breakStart: "14:00", breakEnd: "16:00" },
        fri: { open: "10:00", close: "20:00", closed: false, hasBreak: false, breakStart: "14:00", breakEnd: "16:00" },
        sat: { open: "10:00", close: "20:00", closed: false, hasBreak: false, breakStart: "14:00", breakEnd: "16:00" },
        sun: { open: "10:00", close: "20:00", closed: false, hasBreak: false, breakStart: "14:00", breakEnd: "16:00" },
      },
    },
  });

  // ------------------------------------------------------------
  // 타이머
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const formatPhone = (v) => v.replace(/\D/g, "");
  const generateTimeOptions = () => {
    const arr = [];
    for (let h = 0; h < 24; h++) {
      const hh = h.toString().padStart(2, "0");
      arr.push(`${hh}:00`);
      arr.push(`${hh}:30`);
    }
    return arr;
  };

  // ------------------------------------------------------------
  // handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setError("");

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
          [day]: {
            ...prev.store.business_hours[day],
            [field]: value,
          },
        },
      },
    }));
  };

  const handleSendCode = async () => {
    setError("");
    const phone = formatPhone(formData.phone_number);

    if (phone.length !== 11) {
      setError("올바른 전화번호 11자리를 입력해주세요.");
      return;
    }

    setIsLoading(true);
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
    } catch {
      setError("인증번호 요청 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setIsLoading(true);
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
    } catch {
      setError("인증번호 확인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e, imageType) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 업로드해주세요.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("이미지는 5MB 이하로만 업로드 가능합니다.");
      return;
    }

    const setUploading = imageType === "store_image" ? setImageUploading : setLicenseUploading;
    setUploading(true);

    try {
      const presignRes = await api.post("/upload/image/", {
        filename: file.name,
        content_type: file.type,
        image_type: imageType,
      });

      const { upload_url, key } = presignRes.data.data;

      await fetch(upload_url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (imageType === "store_image") {
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
    } catch {
      setError("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  // ------------------------------------------------------------
  // Step 이동
  const validateStep = (s) => {
    switch (s) {
      case 1:
        return (
          formData.username.trim() &&
          formData.password.trim() &&
          formData.name.trim() &&
          isPhoneVerified
        );
      case 2:
        return (
          formData.store.name.trim() &&
          formData.store.phone.trim() &&
          formData.store.address.trim() &&
          formData.store.category.trim()
        );
      case 3:
        return (
          formData.store.description.trim() &&
          formData.store.image_url.trim()
        );
      case 4:
        return formData.business_license_image.trim();
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (!validateStep(currentStep)) {
      setError("필수 정보를 모두 입력해주세요.");
      return;
    }
    setError("");
    setCurrentStep((s) => s + 1);
  };

  const prevStep = () => {
    setCurrentStep((s) => s - 1);
    setError("");
  };

  // ------------------------------------------------------------
  // 최종 제출
  const handleSubmit = async () => {
    setError("");
    setIsLoading(true);

    try {
      const hours = {};
      Object.entries(formData.store.business_hours).forEach(([day, h]) => {
        if (h.closed) {
          hours[day] = { closed: true };
        } else {
          hours[day] = {
            open: h.open,
            close: h.close,
            ...(h.hasBreak ? { break: [h.breakStart, h.breakEnd] } : {}),
          };
        }
      });

      const res = await api.post("/accounts/owner-signup/", {
        username: formData.username,
        password: formData.password,
        name: formData.name,
        phone_number: formatPhone(formData.phone_number),
        business_license_image: formData.business_license_image,
        store: {
          ...formData.store,
          business_hours: hours,
        },
      });

      if (!res.data.success) {
        setError(res.data.message);
        return;
      }

      alert("회원가입이 완료되었습니다!");
      navigate("/login");
    } catch {
      setError("회원가입 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------------------------------------------------
  // UI: Step 내용
  const Step1 = (
    <SectionCard title="계정 정보">
      <Input label="아이디" name="username" value={formData.username} onChange={handleChange} />
      <Input label="비밀번호" name="password" type="password" value={formData.password} onChange={handleChange} />
      <Input label="사장님 성함" name="name" value={formData.name} onChange={handleChange} />

      {/* 전화번호 인증 */}
      <Input
        label="전화번호"
        name="phone_number"
        placeholder="01012345678"
        value={formData.phone_number}
        onChange={handleChange}
        disabled={isPhoneVerified}
      />

      {!isPhoneVerified && (
        <PrimaryButton type="button" onClick={handleSendCode} disabled={isLoading}>
          {isLoading ? "요청 중..." : "인증번호 받기"}
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
            disabled={formData.verification_code.length !== 6 || timer === 0}
          >
            인증 확인
          </PrimaryButton>
        </>
      )}

      {isPhoneVerified && <VerifiedText>✓ 번호 인증 완료</VerifiedText>}
    </SectionCard>
  );

  const Step2 = (
    <SectionCard title="가게 기본 정보">
      <Input label="가게명" name="store.name" value={formData.store.name} onChange={handleChange} />
      <Input label="가게 전화번호" name="store.phone" value={formData.store.phone} onChange={handleChange} />
      <Input label="주소" name="store.address" value={formData.store.address} onChange={handleChange} />

      <Select
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

      {/* 가게 이미지 업로드 */}
      <UploadArea>
        <label>가게 이미지 업로드</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, "store_image")}
          disabled={imageUploading}
        />
        {formData.store.image_url && <UploadStatus>✓ 업로드 완료</UploadStatus>}
      </UploadArea>

      {/* 영업시간 */}
      <Divider />
      <h4>영업시간</h4>

      {Object.entries(formData.store.business_hours).map(([day, h]) => (
        <DayRow key={day}>
          <DayLabel>{day.toUpperCase()}</DayLabel>

          <Checkbox
            type="checkbox"
            checked={h.closed}
            onChange={(e) => handleBusinessHoursChange(day, "closed", e.target.checked)}
          />
          <span>휴무</span>

          {!h.closed && (
            <>
              <Select
                value={h.open}
                onChange={(e) => handleBusinessHoursChange(day, "open", e.target.value)}
              >
                {generateTimeOptions().map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </Select>
              <span>~</span>
              <Select
                value={h.close}
                onChange={(e) => handleBusinessHoursChange(day, "close", e.target.value)}
              >
                {generateTimeOptions().map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </Select>
            </>
          )}
        </DayRow>
      ))}
    </SectionCard>
  );

  const Step4 = (
    <SectionCard title="사업자 등록증">
      <UploadArea>
        <label>사업자등록증 이미지 업로드</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, "business_license")}
          disabled={licenseUploading}
        />
        {formData.business_license_image && <UploadStatus>✓ 업로드 완료</UploadStatus>}
      </UploadArea>
    </SectionCard>
  );

  const Steps = { 1: Step1, 2: Step2, 3: Step3, 4: Step4 };

  return (
    <MobileShell>
      <PageContainer>

        <Hero title="사장님 회원가입" />

        {/* Progress */}
        <ProgressBox>
          {Array.from({ length: 4 }).map((_, i) => (
            <ProgressDot key={i} active={i < currentStep} />
          ))}
        </ProgressBox>

        {Steps[currentStep]}

        {error && (
          <ErrorMsg>⚠️ {error}</ErrorMsg>
        )}

        <Spacer size="md" />

        {/* Buttons */}
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

const ProgressBox = styled.div`
  display: flex;
  gap: 8px;
  padding: ${spacing.md}px 0;
`;

const ProgressDot = styled.div`
  width: 10px;
  height: 10px;
  background: ${({ active }) => (active ? colors.primary : colors.textMuted)};
  border-radius: 50%;
  opacity: ${({ active }) => (active ? 1 : 0.4)};
`;

const ErrorMsg = styled.div`
  width: 100%;
  background: ${colors.errorLight};
  color: ${colors.error};
  padding: ${spacing.md}px;
  border-radius: 8px;
  font-size: 14px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
`;

const UploadArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm}px;
`;

const UploadStatus = styled.div`
  color: ${colors.success};
  font-size: 14px;
`;

const VerifiedText = styled.div`
  color: ${colors.success};
  margin-top: ${spacing.xs}px;
  font-size: 14px;
`;

const DayRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 4px 0;
`;

const DayLabel = styled.div`
  width: 40px;
  font-weight: 600;
`;

const Checkbox = styled.input`
  transform: scale(1.2);
`;

const Select = styled.select`
  padding: 6px 8px;
  border: 1.2px solid ${colors.textMuted};
  border-radius: 6px;
  font-size: 14px;
`;

const CenterRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

