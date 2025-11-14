// src/design/components/Card/Card.js
import styled from "styled-components";
import { spacing } from "../../tokens/spacing";
import { radius } from "../../tokens/radius";
import { colors } from "../../tokens/colors";

const Card = styled.div`
  width: 100%;
  background: ${colors.bgPaper};
  padding: ${spacing.lg}px;
  border-radius: ${radius.lg}px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  gap: ${spacing.md}px;

  border: 1px solid rgba(0,0,0,0.04);
  box-shadow:
    0 1px 2px rgba(0,0,0,0.03),
    0 4px 8px rgba(0,0,0,0.04);

  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow:
      0 2px 4px rgba(0,0,0,0.05),
      0 6px 12px rgba(0,0,0,0.06);
  }
`;

export default Card;
