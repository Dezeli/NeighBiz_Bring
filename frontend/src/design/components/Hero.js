import styled from "styled-components";
import { spacing } from "../tokens/spacing";
import { colors } from "../tokens/colors";
import { typography } from "../tokens/typography";

const Wrapper = styled.div`
  width: 100%;
  padding: ${spacing.xl}px ${spacing.lg}px ${spacing.lg}px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  gap: ${spacing.md}px;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm}px;
`;

const LogoImg = styled.img`
  width: 52px;
  height: 52px;
  object-fit: contain;
`;

const Title = styled.h1`
  font-size: 1.7rem;
  font-weight: ${typography.title1.weight};
  color: ${colors.textPrimary};
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: ${colors.textSecondary};
  margin: 0;
  max-width: 280px;
  line-height: 1.4;
`;

export default function Hero() {
  return (
    <Wrapper>
      <TopRow>
        <LogoImg src="/images/logo.png" alt="logo" />
        <Title>NeighBiz</Title>
      </TopRow>

      <Subtitle>동네 사장님들의 제휴 & 쿠폰 플랫폼</Subtitle>
    </Wrapper>
  );
}