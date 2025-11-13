import styled from "styled-components";
import { spacing } from "../tokens/spacing";
import { typography } from "../tokens/typography";
import { colors } from "../tokens/colors";


const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm}px;
`;

const Title = styled.h1`
  font-size: ${typography.title2.size};
  font-weight: ${typography.title2.weight};
  color: ${colors.textPrimary};
  margin: 0;
`;

export default function ScreenHeader({ title }) {
  return (
    <Header>
      <Title>{title}</Title>
    </Header>
  );
}
