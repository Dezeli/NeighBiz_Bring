// src/pages/owner/auth/OwnerFindIdPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// API
import api from "../../../utils/api";

// Layout + UI
import MobileShell from "../../../design/layout/MobileShell";
import PageContainer from "../../../design/layout/PageContainer";
import {
  Input,
  PrimaryButton,
  GhostButton,
  SubtleButton,
  SectionCard,
  Hero,
  Spacer,
  Divider
} from "../../../design/components";

import styled from "styled-components";
import { colors } from "../../../design/tokens/colors";
import { spacing } from "../../../design/tokens/spacing";

export default function OwnerFindIdPage() {
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [name, setName] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [timer, setTimer] = useState(0);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  const [foundUsername, setFoundUsername] = useState("");
  const [showResult, setShowResult] = useState(false);

  // ------------------------------------------------------------
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

  const formatPhone = (v) => v.replace(/\D/g, "");

  // ------------------------------------------------------------
  // Handlers
  const handleSendCode = async () => {
    setError("");
    const phone = formatPhone(phoneNumber);

    if (phone.length !== 11) {
      setError("올바른 전화번호를 입력해주세요.");
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

      setVerificationCode("");
      setTimer(180);
      setIsVerificationSent(true);

    } catch {
      setError("인증번호 발송 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setIsLoading(true);
    try {
      const res = await api.post("/accounts/phone-verify/", {
        phone_number: formatPhone(phoneNumber),
        code: verificationCode,
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

  const handleFindUsername = async () => {
    setError("");
    setIsLoading(true);

    try {
      const res = await api.post("/accounts/find-username/", {
        phone_number: formatPhone(phoneNumber),
        name: name.trim(),
      });

      if (!res.data.success) {
        setError(res.data.message);
        return;
      }

      setFoundUsername(res.data.data.username);
      setShowResult(true);

    } catch {
      setError("아이디 찾기 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const canFind = isPhoneVerified && name.trim();

  // ------------------------------------------------------------
  // Result Screen
  if (showResult) {
    return (
      <MobileShell>
        <PageContainer>
          <Hero />

          <SectionCard title="아이디 찾기 결과">
            <ResultEmoji>🎉</ResultEmoji>
            <FoundIdBox>{foundUsername}</FoundIdBox>

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

  // ------------------------------------------------------------
  // Main Screen
  return (
    <MobileShell>
      <PageContainer>

        <Hero title="아이디 찾기" />

        <SectionCard title="본인 확인">
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
              disabled={isLoading || formatPhone(phoneNumber).length !== 11}
            >
              {isLoading ? "요청 중..." : "인증번호 받기"}
            </PrimaryButton>
          )}

          {/* Verification */}
          {isVerificationSent && !isPhoneVerified && (
            <>
              <Input
                label={`인증번호 (${timer > 0 ? formatTime(timer) : "만료"})`}
                placeholder="6자리 입력"
                value={verificationCode}
                maxLength={6}
                onChange={(e) => setVerificationCode(e.target.value)}
              />

              <PrimaryButton
                onClick={handleVerifyCode}
                disabled={isLoading || verificationCode.length !== 6}
              >
                인증 확인
              </PrimaryButton>
            </>
          )}

          {isPhoneVerified && (
            <VerifiedText>✓ 번호 인증 완료</VerifiedText>
          )}

          <Divider />

          {/* Name */}
          {isPhoneVerified && (
            <Input
              label="이름"
              placeholder="가입 시 등록한 이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          {error && <ErrorBox>⚠️ {error}</ErrorBox>}

          {isPhoneVerified && (
            <PrimaryButton
              onClick={handleFindUsername}
              disabled={!canFind || isLoading}
            >
              {isLoading ? "검색 중..." : "아이디 찾기"}
            </PrimaryButton>
          )}
        </SectionCard>

        <Spacer size="lg" />

        <SubtleButton onClick={() => navigate("/login")}>
          ← 로그인으로 돌아가기
        </SubtleButton>

      </PageContainer>
    </MobileShell>
  );
}

/* ----------------------------- Styles ----------------------------- */

const VerifiedText = styled.div`
  color: ${colors.success};
  margin-top: ${spacing.xs}px;
  font-size: 14px;
`;

const ErrorBox = styled.div`
  width: 100%;
  background: ${colors.errorLight};
  color: ${colors.error};
  padding: ${spacing.md}px;
  border-radius: 8px;
  font-size: 14px;
`;

const ResultEmoji = styled.div`
  font-size: 3rem;
  text-align: center;
`;

const FoundIdBox = styled.div`
  background: ${colors.bgPaper};
  padding: ${spacing.lg}px;
  text-align: center;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 600;
  border: 1px solid rgba(0,0,0,0.05);
`;

