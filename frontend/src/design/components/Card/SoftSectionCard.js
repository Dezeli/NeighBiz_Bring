import styled from "styled-components";
import Card from "./Card";
import { typography } from "../../tokens/typography";
import { colors } from "../../tokens/colors";
import { spacing } from "../../tokens/spacing";

const Header = styled.div`
  font-size: ${typography.subtitle.size};
  font-weight: ${typography.subtitle.weight};
  color: ${colors.textPrimary};
  margin-bottom: ${spacing.sm}px;
`;

const SoftWrapper = styled(Card)`
  background: ${colors.bgSoft};
  border: 1px solid ${colors.bgPaper};

`;

export default function SoftSectionCard({ title, children }) {
  return (
    <SoftWrapper>
      {title && <Header>{title}</Header>}
      {children}
    </SoftWrapper>
  );
}
