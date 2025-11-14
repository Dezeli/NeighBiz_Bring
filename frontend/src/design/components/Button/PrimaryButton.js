import styled from "styled-components";
import BaseButton from "./BaseButton";
import { colors } from "../../tokens/colors";

const PrimaryButton = styled(BaseButton)`
  background: ${colors.primary};
  color: ${colors.textOnPrimary};

  box-shadow: 0 2px 4px rgba(0,0,0,0.05);

  &:active {
    background: ${colors.primaryDark};
    transform: scale(0.98);
  }
`;


export default PrimaryButton;
