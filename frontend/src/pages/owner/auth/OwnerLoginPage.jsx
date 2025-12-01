import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../../utils/api";
import { useAuth } from "../../../context/AuthContext";
import MobileShell from "../../../design/layout/MobileShell";
import PageContainer from "../../../design/layout/PageContainer";
import {
  Input,
  PrimaryButton,
  GhostButton,
  SubtleButton,
  Divider,
  Row,
  Spacer,
  Hero,
  ErrorBox,
} from "../../../design/components";

export default function OwnerLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // ----------------------------------------------------------------
  // Device Info
  // ----------------------------------------------------------------
  const getDeviceInfo = () => {
    const userAgent = navigator.userAgent;
    let browser = "Unknown";
    let os = "Unknown";

    if (userAgent.includes("Chrome")) browser = "Chrome";
    else if (userAgent.includes("Firefox")) browser = "Firefox";
    else if (userAgent.includes("Safari")) browser = "Safari";
    else if (userAgent.includes("Edge")) browser = "Edge";

    if (userAgent.includes("Windows")) os = "Windows";
    else if (userAgent.includes("Mac")) os = "macOS";
    else if (userAgent.includes("Linux")) os = "Linux";
    else if (userAgent.includes("Android")) os = "Android";
    else if (userAgent.includes("iOS")) os = "iOS";

    return `${browser} on ${os}`;
  };

  // ----------------------------------------------------------------
  // Login Handler
  // ----------------------------------------------------------------
  const handleLogin = async (e) => {
    if (e) e.preventDefault();

    setError("");

    // Client-side Validation
    if (!username.trim()) {
      setError("아이디를 입력하세요.");
      return;
    }

    if (!password.trim()) {
      setError("비밀번호를 입력하세요.");
      return;
    }

    // API Call
    setIsLoading(true);

    try {
      const res = await api.post("/accounts/owner-login/", {
        username,
        password,
        device_info: getDeviceInfo(),
      });

      if (!res.data.success) {
        setError(res.data.message || "로그인에 실패했습니다.");
        return;
      }

      const { access, refresh } = res.data.data;
      await login(access, refresh);
      navigate("/owner/profile");

    } catch (err) {
      if (err.response?.data) {
        setError(err.response.data.message || "로그인에 실패했습니다.");
      } else {
        setError("로그인에 실패했습니다. 네트워크를 확인해주세요.");
      }

    } finally {
      setIsLoading(false);
    }
  };


  return (
    <MobileShell>
      <PageContainer>

        <Hero />

        <form onSubmit={handleLogin} style={{ width: "100%" }}>
          
          <Spacer size="md" />
          <Input
            label="아이디"
            placeholder="아이디를 입력하세요"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          
          <Spacer size="md" />
          <Input
            label="비밀번호"
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Spacer size="md" />

          {error && <ErrorBox>{error}</ErrorBox>}

          <Spacer size="xl" />

          <PrimaryButton disabled={isLoading}>
            {isLoading ? "로그인 중..." : "로그인"}
          </PrimaryButton>

          <Spacer size="sm" />

          <GhostButton type="button" onClick={() => navigate("/signup")}>
            회원가입
          </GhostButton>

          <Spacer size="lg" />

          <Divider />

          <Spacer size="md" />

          <Row justify="space-between">
            <SubtleButton type="button" onClick={() => navigate("/find-id")}>
              아이디 찾기
            </SubtleButton>

            <SubtleButton type="button" onClick={() => navigate("/reset-password")}>
              비밀번호 재설정
            </SubtleButton>
          </Row>
        </form>

      </PageContainer>
    </MobileShell>
  );
}
