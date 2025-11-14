import styled from "styled-components";
import { spacing } from "../tokens/spacing";
import { typography } from "../tokens/typography";
import { colors } from "../tokens/colors";
import { radius } from "../tokens/radius";


const Wrapper = styled.div`
  width: 100%;
  padding: ${spacing.lg}px ${spacing.md}px;
  border-radius: ${radius.md}px;
  background: ${colors.white};
  box-sizing: border-box;

  display: flex;
  align-items: center;
  justify-content: space-between;

  cursor: ${(props) => (props.clickable ? "pointer" : "default")};
  
  &:active {
    background: ${(props) => props.clickable && colors.bgSoft};
  }
`;

const Left = styled.div`
  font-size: ${typography.body.size};
  font-weight: ${typography.body.weight};
  color: ${colors.textPrimary};
`;

const Right = styled.div`
  color: ${colors.textMuted};
`;

export default function ListItem({ left, right, clickable, ...props }) {
  return (
    <Wrapper clickable={clickable} {...props}>
      <Left>{left}</Left>
      {right && <Right>{right}</Right>}
    </Wrapper>
  );
}
