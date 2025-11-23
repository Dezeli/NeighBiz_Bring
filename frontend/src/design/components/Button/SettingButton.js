import styled from "styled-components";
import BaseButton from "./BaseButton";
import { colors } from "../../tokens/colors";
import { radius } from "../../tokens/radius";
import { spacing } from "../../tokens/spacing";

const SettingButton = styled(BaseButton)`
  background: ${colors.bgBase};
  color: ${colors.textPrimary};
  border: 1.5px solid ${colors.bgPaper};
  border-radius: ${radius.md}px;

  justify-content: flex-start;
  text-align: left;
  gap: 10px;
  padding-left: ${spacing.lg}px;

  &:hover:not(:disabled) {
    background: ${colors.bgSoft};
  }

  &:active:not(:disabled) {
    background: ${colors.bgPaper};
    transform: translateY(1px);
  }
`;

export default SettingButton;
