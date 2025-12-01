import styled from "styled-components";
import BaseButton from "./BaseButton";
import { colors } from "../../tokens/colors";
import { radius } from "../../tokens/radius";
import { spacing } from "../../tokens/spacing";

const DangerButton = styled(BaseButton)`
  background: ${colors.errorLight};
  color: ${colors.error};
  border: 1.5px solid ${colors.error};
  border-radius: ${radius.md}px;

  justify-content: flex-start;
  text-align: left;
  gap: 10px;
  padding-left: ${spacing.lg}px;

  &:hover:not(:disabled) {
    background: ${colors.error};
    color: white;
  }

  &:active:not(:disabled) {
    background: ${colors.errorDark || colors.error};
    color: white;
    transform: translateY(1px);
  }
`;

export default DangerButton;
