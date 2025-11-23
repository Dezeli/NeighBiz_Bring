import styled from "styled-components";
import { spacing } from "../../tokens/spacing";
import { radius } from "../../tokens/radius";
import { typography } from "../../tokens/typography";
import { colors } from "../../tokens/colors";

const BaseButton = styled.button`
  width: 100%;
  padding: ${spacing.md}px;
  border-radius: ${radius.md}px;
  border: none;

  font-size: ${typography.button.size};
  font-weight: ${typography.button.weight};
  font-family: ${typography.fontFamily};

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  transition: all 0.15s ease;

  /* ⚡ 3D 입체감 만들기 */
  background: linear-gradient(
    to bottom,
    ${colors.primaryLight},
    ${colors.primary}
  );
  color: ${colors.textOnPrimary};

  /* 눌러보이는 선 */
  border-bottom: 3px solid ${colors.primaryDark};

  &:hover:not(:disabled) {
    opacity: 0.7;
  }

  &:active:not(:disabled) {
    /* 눌릴 때 아래 보더 줄이기 → 진짜 눌리는 느낌 */
    border-bottom: 1px solid ${colors.primaryDark};
    transform: translateY(2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    border-bottom: 3px solid ${colors.primary};
  }
`;

export default BaseButton;
