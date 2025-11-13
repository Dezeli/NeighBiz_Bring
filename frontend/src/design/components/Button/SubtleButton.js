import styled from "styled-components";
import BaseButton from "./BaseButton";
import { colors } from "../../tokens/colors";


const SubtleButton = styled(BaseButton)`
  background: ${colors.bgAccent};
  color: ${colors.textPrimary};

  &:active {
    background: ${colors.bgPaper};
  }
`;

export default SubtleButton;
