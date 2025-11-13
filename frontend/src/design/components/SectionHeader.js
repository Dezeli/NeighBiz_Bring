import styled from "styled-components";
import { spacing } from "../tokens/spacing";
import { typography } from "../tokens/typography";
import { colors } from "../tokens/colors";


const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs}px;
`;

const Title = styled.div`
  font-size: ${typography.title2.size};
  font-weight: ${typography.title2.weight};
  color: ${colors.textPrimary};
`;

const Sub = styled.div`
  font-size: ${typography.small.size};
  color: ${colors.textSecondary};
`;

export default function SectionHeader({ title, sub }) {
  return (
    <Wrapper>
      <Title>{title}</Title>
      {sub && <Sub>{sub}</Sub>}
    </Wrapper>
  );
}
