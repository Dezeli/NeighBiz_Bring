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

export default function SectionCard({ title, children }) {
  return (
    <Card>
      {title && <Header>{title}</Header>}
      {children}
    </Card>
  );
}
