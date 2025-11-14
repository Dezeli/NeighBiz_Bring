import styled from "styled-components";
import Card from "./Card";
import { colors } from "../../tokens/colors";

const ClickableCard = styled(Card)`
  cursor: pointer;
  transition: background 0.1s ease-out;

  &:active {
    background: ${colors.bgSoft};
  }
`;

export default ClickableCard;
