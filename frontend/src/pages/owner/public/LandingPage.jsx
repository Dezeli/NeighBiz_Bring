import { useNavigate } from "react-router-dom";

import { 
  SectionCard, 
  PrimaryButton, 
  GhostButton, 
  Spacer,
  Grid,
  Hero
} from "../../../design/components";

import { 
  MobileShell, 
  PageContainer 
} from "../../../design/layout";



export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <MobileShell>
      <PageContainer>
        

        <Hero 
          title="NeighBiz"
          subtitle="동네 사장님들의 제휴 & 쿠폰 플랫폼"
        />
        

        {/* Introduction Section */}
        <Grid>
          <SectionCard title="제휴 매장">
            <p>동네 사장님들과 연결되고 함께 성장하세요</p>
          </SectionCard>

          <SectionCard title="쿠폰 발급">
            <p>QR로 빠르게 발급/사용 기능 제공</p>
          </SectionCard>

          <SectionCard title="사용 통계">
            <p>최근 7일 발급/사용 지표 제공</p>
          </SectionCard>

          <SectionCard title="가게 관리">
            <p>매장 정보와 쿠폰 정책을 손쉽게 관리</p>
          </SectionCard>
        </Grid>

        <Spacer size="xs" />

        {/* Actions */}
        <PrimaryButton onClick={() => navigate("/login")}>
          로그인
        </PrimaryButton>

        <GhostButton onClick={() => navigate("/signup")}>
          회원가입
        </GhostButton>

      </PageContainer>
    </MobileShell>
  );
}
