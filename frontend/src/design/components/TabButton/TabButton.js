// src/design/components/TabButton/TabButton.js
import styled from "styled-components";
import { spacing } from "../../tokens/spacing";
import { radius } from "../../tokens/radius";
import { typography } from "../../tokens/typography";
import { colors } from "../../tokens/colors";

const TabButton = styled.button`
  width: 100%;
  padding: ${spacing.md}px;
  border-radius: ${radius.md}px;

  font-size: ${typography.body.size};
  font-weight: ${typography.button.weight};
  font-family: ${typography.fontFamily};

  cursor: pointer;
  transition: all 0.18s ease;

  /* ACTIVE 상태 */
  background: ${(p) => (p.$active ? colors.primary : colors.bgBase)};
  color: ${(p) => (p.$active ? colors.textOnPrimary : colors.primary)};
  border: ${(p) =>
    p.$active ? "none" : `1.5px solid ${colors.primary}`};

  /* Hover 효과 — INACTIVE일 때만 */
  &:hover {
    background: ${(p) =>
      p.$active ? colors.primary : colors.bgPaper};
  }

  /* 눌림 효과 */
  &:active {
    transform: scale(0.97);
    background: ${(p) =>
      p.$active ? colors.primaryDark : colors.bgAccent};
  }
`;

export default TabButton;
