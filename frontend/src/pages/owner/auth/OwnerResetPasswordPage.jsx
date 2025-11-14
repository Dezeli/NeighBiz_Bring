import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import api from "../../../utils/api";

// Layout + UI
import MobileShell from "../../../design/layout/MobileShell";
import PageContainer from "../../../design/layout/PageContainer";
import {
  Input,
  PrimaryButton,
  SubtleButton,
  SectionCard,
  Hero,
  Spacer,
  Divider,
  ErrorBox,
  SuccessBox,
} from "../../../design/components";

import { colors } from "../../../design/tokens/colors";
import { spacing } from "../../../design/tokens/spacing";

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  // Fields
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [name, setName] = useState("");

  // Status
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Verification
  const [timer, setTimer] = useState(0);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  // Result
  const [newPassword, setNewPassword] = useState("");
  const [showResult, setShowResult] = useState(false);

  // ---------------------------------------------------------
  // Timer
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const cleanPhone = (v) => v.replace(/\D/g, "");

  // ---------------------------------------------------------
  // Send Code
  const handleSendCode = async () => {
    setError("");
    const phone = cleanPhone(phoneNumber);

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
        setError(res.data.message || "인증번호 발송에 실패했습니다.");
        return;
      }

      setVerificationCode("");
      setTimer(180);
      setIsVerificationSent(true);
    } catch (err) {
      const serverMsg =
        err.response?.data?.message ||
        "인증번호 발송 중 오류가 발생했습니다.";
      setError(serverMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------------------------------------
  // Verify Code
  const handleVerifyCode = async () => {
    setIsLoading(true);
    setError("");

    try {
      const res = await api.post("/accounts/phone-verify/", {
        phone_number: cleanPhone(phoneNumber),
        code: verificationCode,
      });

      if (!res.data.success) {
        setError(res.data.message || "인증번호가 올바르지 않습니다.");
        return;
      }

      setIsPhoneVerified(true);
    } catch (err) {
      const serverMsg =
        err.response?.data?.message ||
        "인증번호 확인 중 오류가 발생했습니다.";
      setError(serverMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------------------------------------
  // Reset Password (Issue Temporary Password)
  const handleResetPassword = async () => {
    setError("");
    setIsLoading(true);

    try {
      const res = await api.post("/accounts/reset-password/", {
        username: username.trim(),
        phone_number: cleanPhone(phoneNumber),
        name: name.trim(),
      });

      if (!res.data.success) {
        setError(res.data.message || "비밀번호 재설정에 실패했습니다.");
        return;
      }

      const tempPw = res.data.data?.temporary_password;
      setNewPassword(tempPw || "임시 비밀번호가 발급되었습니다.");
      setShowResult(true);
    } catch (err) {
      const serverMsg =
        err.response?.data?.message ||
        "비밀번호 재설정 중 오류가 발생했습니다.";
      setError(serverMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const canReset = isPhoneVerified && username.trim() && name.trim();

  // ---------------------------------------------------------
  // Result View
  if (showResult) {
    return (
      <MobileShell>
        <PageContainer>
          <Hero title="비밀번호 재설정 완료" />

          <SectionCard>
            <ResultEmoji>🔑</ResultEmoji>
            <SuccessBox>임시 비밀번호가 발급되었습니다!</SuccessBox>

            <TemporaryPwBox>{newPassword}</TemporaryPwBox>

            <SmallHint>
              로그인 후 반드시 새 비밀번호로 변경해주세요.
            </SmallHint>

            <PrimaryButton onClick={() => navigate("/login")}>
              로그인하러 가기
            </PrimaryButton>
          </SectionCard>

          <Spacer size="lg" />
          <SubtleButton onClick={() => navigate("/login")}>
            ← 로그인으로 돌아가기
          </SubtleButton>
        </PageContainer>
      </MobileShell>
    );
  }

  // ---------------------------------------------------------
  // Main View
  return (
    <MobileShell>
      <PageContainer>
        <Hero title="비밀번호 재설정" />

        <SectionCard title="본인 확인">
          <Input
            label="아이디"
            placeholder="아이디를 입력하세요"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Divider />

          {/* Phone */}
          <Input
            label="전화번호"
            placeholder="01012345678"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={isPhoneVerified}
          />

          {!isPhoneVerified && (
            <PrimaryButton
              onClick={handleSendCode}
              disabled={isLoading || cleanPhone(phoneNumber).length !== 11}
            >
              {isLoading ? "요청 중..." : "인증번호 받기"}
            </PrimaryButton>
          )}

          {/* Verification Code */}
          {isVerificationSent && !isPhoneVerified && (
            <>
              <Input
                label={`인증번호 (${timer > 0 ? formatTime(timer) : "만료"})`}
                placeholder="6자리 입력"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />

              <PrimaryButton
                onClick={handleVerifyCode}
                disabled={verificationCode.length !== 6}
              >
                {isLoading ? "확인 중..." : "인증 확인"}
              </PrimaryButton>
            </>
          )}

          {isPhoneVerified && <SuccessBox>✓ 번호 인증 완료</SuccessBox>}

          {/* Name */}
          {isPhoneVerified && (
            <>
              <Divider />
              <Input
                label="이름"
                placeholder="가입 시 등록한 이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <PrimaryButton
                onClick={handleResetPassword}
                disabled={!canReset || isLoading}
              >
                {isLoading ? "처리 중..." : "비밀번호 재설정"}
              </PrimaryButton>
            </>
          )}

          {error && <ErrorBox>{error}</ErrorBox>}
        </SectionCard>

        <Spacer size="lg" />

        <SubtleButton onClick={() => navigate("/login")}>
          ← 로그인으로 돌아가기
        </SubtleButton>
      </PageContainer>
    </MobileShell>
  );
}

/* ---------------------------------------------------------
   Styles
--------------------------------------------------------- */

const ResultEmoji = styled.div`
  font-size: 3rem;
  text-align: center;
`;

const TemporaryPwBox = styled.div`
  background: ${colors.bgPaper};
  padding: ${spacing.lg}px;
  text-align: center;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  border: 1px solid rgba(0, 0, 0, 0.05);
  margin: 16px 0;
`;

const SmallHint = styled.div`
  font-size: 12px;
  color: ${colors.textMuted};
  text-align: center;
  margin-bottom: ${spacing.lg}px;
`;
