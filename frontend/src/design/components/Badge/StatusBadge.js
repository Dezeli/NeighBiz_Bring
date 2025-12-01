import styled from "styled-components";
import { colors } from "../../tokens/colors";
import { radius } from "../../tokens/radius";
import { typography } from "../../tokens/typography";

const Wrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;

  padding: 5px 10px;
  border-radius: ${radius.md}px;

  background: ${(p) => p.bg || colors.bgSoft};
  color: ${(p) => p.color || colors.textPrimary};

  font-size: ${typography.small.size};
  font-weight: 600;
`;

const Dot = styled.span`
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: ${(p) => p.dot || colors.primary};
`;

export default function StatusBadge({ label, bg, color, dot }) {
  return (
    <Wrapper bg={bg} color={color}>
      <Dot dot={dot} />
      {label}
    </Wrapper>
  );
}
