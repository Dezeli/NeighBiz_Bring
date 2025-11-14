import styled, { css } from "styled-components";
import { spacing } from "../../tokens/spacing";
import { radius } from "../../tokens/radius";
import { typography } from "../../tokens/typography";

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

  transition: all 0.15s ease-out;
  cursor: pointer;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export default BaseButton;
