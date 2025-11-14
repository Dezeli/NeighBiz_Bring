// src/pages/owner/auth/OwnerVerifyPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { useAuth } from "../../../context/AuthContext";
import api from "../../../utils/api";

// Layout + UI Kit
import MobileShell from "../../../design/layout/MobileShell";
import PageContainer from "../../../design/layout/PageContainer";
import {
  Input,
  PrimaryButton,
  SubtleButton,
  SectionCard,
  Hero,
  Spacer,
} from "../../../design/components";

import { colors } from "../../../design/tokens/colors";
import { spacing } from "../../../design/tokens/spacing";

export default function OwnerVerifyPage() {
  const navigate = useNavigate();
  const { apiCall, fetchUser } = useAuth();

  const [adminPassword, setAdminPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState("");

  // ------------------------------------------------------------
  // 즉시 관리자 승인 처리
  const handleVerify = async (e) => {
    e.preventDefault();

    if (!adminPassword.trim()) {
      setError("관리자 비밀번호를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await apiCall({
        method: "POST",
        url: "/accounts/verify-owner/",
        data: { admin_password: adminPassword },
      });

      if (res?.success) {
        await fetchUser();
        navigate("/owner/profile", { replace: true });
      } else {
        setError(res?.message || "관리자 비밀번호가 올바르지 않습니다.");
      }
    } catch (err) {
      setError("인증 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------------------
  // 파일 선택
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("이미지 파일만 업로드 가능합니다.");
        return;
      }
      setSelectedFile(file);
      setError("");
      setUploadSuccess("");
    }
  };

  // ------------------------------------------------------------
  // 사업자등록증 업로드 → 재심사 요청
  const handleUpload = async () => {
    if (!selectedFile) {
      setError("파일을 선택해주세요.");
      return;
    }

    setUploadLoading(true);
    setError("");

    try {
      // S3 presigned URL 요청
      const presign = await apiCall({
        method: "POST",
        url: "/upload/image/",
        data: {
          filename: selectedFile.name,
          content_type: selectedFile.type,
          image_type: "business_license",
        },
      });

      const uploadUrl = presign.data?.upload_url;
      const imageKey = presign.data?.key;

      if (!uploadUrl || !imageKey) {
        throw new Error("업로드 URL을 받지 못했습니다.");
      }

      // S3 업로드
      await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });

      // 서버에 키 저장 (재심사 요청)
      const patch = await apiCall({
        method: "PATCH",
        url: "/accounts/owner-license/",
        data: { business_license_image: imageKey },
      });

      if (patch?.success) {
        setUploadSuccess("사업자등록증이 업로드되었습니다. 재심사를 기다려주세요.");
        setSelectedFile(null);
      } else {
        setError(patch?.message || "업로드에 실패했습니다.");
      }
    } catch (err) {
      setError("사업자등록증 업로드 중 오류가 발생했습니다.");
    } finally {
      setUploadLoading(false);
    }
  };

  // ------------------------------------------------------------
  return (
    <MobileShell>
      <PageContainer>

        <Hero title="승인 대기중" />

        <StatusEmoji>⏱️</StatusEmoji>
        <StatusText>
          회원가입이 완료되었습니다.
          <br />
          관리자 승인 후 서비스를 이용하실 수 있습니다.
        </StatusText>

        <Spacer size="lg" />

        {/* 즉시 인증 Section */}
        <SectionCard title="빠른 승인 (운영팀 전용)">
          <Input
            label="관리자 비밀번호"
            type="password"
            placeholder="관리자 비밀번호 입력"
            value={adminPassword}
            onChange={(e) => {
              setAdminPassword(e.target.value);
              setError("");
            }}
          />

          {error && <ErrorBox>⚠ {error}</ErrorBox>}

          <PrimaryButton onClick={handleVerify} disabled={loading}>
            {loading ? "처리 중..." : "즉시 인증하기"}
          </PrimaryButton>

          <InfoText>
            • 일반 승인: 1~2 영업일 소요  
            <br />
            • 빠른 승인 기능은 운영팀이 직접 처리합니다
          </InfoText>
        </SectionCard>

        <Spacer size="lg" />

        {/* 사업자등록증 업로드 Section */}
        <SectionCard title="사업자등록증 재업로드">
          <FileLabel htmlFor="license-upload">
            📷 {selectedFile ? selectedFile.name : "이미지 선택하기"}
          </FileLabel>

          <input
            id="license-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          <PrimaryButton
            onClick={handleUpload}
            disabled={!selectedFile || uploadLoading}
          >
            {uploadLoading ? "업로드 중..." : "사업자등록증 제출"}
          </PrimaryButton>

          {uploadSuccess && <SuccessBox>{uploadSuccess}</SuccessBox>}
        </SectionCard>

        <Spacer size="xl" />

        <SubtleButton onClick={() => navigate("/login")}>
          ← 로그인 페이지로 돌아가기
        </SubtleButton>

      </PageContainer>
    </MobileShell>
  );
}

/* ------------------------------------------------------------------
   Styled Components
------------------------------------------------------------------ */

const StatusEmoji = styled.div`
  font-size: 3.2rem;
  text-align: center;
`;

const StatusText = styled.div`
  text-align: center;
  font-size: 1rem;
  color: ${colors.textSecondary};
  line-height: 1.5;
`;

const ErrorBox = styled.div`
  width: 100%;
  background: ${colors.errorLight};
  color: ${colors.error};
  padding: ${spacing.md}px;
  border-radius: 8px;
  margin-top: ${spacing.sm}px;
`;

const SuccessBox = styled.div`
  width: 100%;
  background: ${colors.successLight};
  color: ${colors.success};
  padding: ${spacing.md}px;
  border-radius: 8px;
  margin-top: ${spacing.sm}px;
  font-size: 14px;
`;

const InfoText = styled.div`
  font-size: 13px;
  color: ${colors.textMuted};
  margin-top: ${spacing.sm}px;
  line-height: 1.5;
`;

const FileLabel = styled.label`
  width: 100%;
  padding: ${spacing.md}px;
  border: 1.5px dashed ${colors.primary};
  text-align: center;
  border-radius: 12px;
  cursor: pointer;
  background: ${colors.white};
  color: ${colors.primary};
  transition: 0.2s ease;

  &:hover {
    background: ${colors.primaryLight}22;
  }
`;
