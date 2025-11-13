import styled from "styled-components";
import BaseButton from "./BaseButton";
import { colors } from "../../tokens/colors";

const GhostButton = styled(BaseButton)`
  background: transparent;
  color: ${colors.primary};
  border: 1.5px solid ${colors.primary};

  &:active {
    background: ${colors.primaryLight}22; /* 아주 옅은 하이라이트 */
  }
`;

export default GhostButton;
