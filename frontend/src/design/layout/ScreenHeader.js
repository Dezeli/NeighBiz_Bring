// src/design/layout/ScreenHeader.js
import styled from "styled-components";
import { spacing } from "../tokens/spacing";
import { typography } from "../tokens/typography";
import { colors } from "../tokens/colors";
import { radius } from "../tokens/radius";
import { ChevronLeft } from "lucide-react";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md}px;
  padding: ${spacing.md}px 0;
`;

const BackButton = styled.button`
  display: ${({ show }) => (show ? "inline-flex" : "none")};
  align-items: center;
  justify-content: center;

  width: 32px;
  height: 32px;
  border-radius: ${radius.lg}px;

  border: none;
  background: ${colors.bgBase};
  color: ${colors.textPrimary};

  cursor: pointer;
  padding: 0;
  outline: none;

  transition: background 0.15s ease-out, transform 0.1s ease-out;

  &:active {
    transform: scale(0.96);
    background: ${colors.bgPaper};
  }
`;

const Title = styled.h1`
  font-size: ${typography.title2.size};
  font-weight: ${typography.title2.weight};
  color: ${colors.textPrimary};
  margin: 0;
`;

export default function ScreenHeader({ title, onBack, showBack }) {
  return (
    <Wrapper>
      <BackButton
        type="button"
        show={showBack}
        onClick={onBack}
        aria-label="뒤로가기"
      >
        <ChevronLeft size={18} />
      </BackButton>
      <Title>{title}</Title>
    </Wrapper>
  );
}
