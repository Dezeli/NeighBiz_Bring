import styled from "styled-components";
import { spacing } from "../tokens/spacing";


/*
<Row gap="md">
  <Input label="시작일" />
  <Input label="종료일" />
</Row>
*/


export const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${(props) => spacing[props.gap] || 0}px;
  align-items: ${(props) => props.align || "center"};
  justify-content: ${(props) => props.justify || "flex-start"};
`;

export const Col = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => spacing[props.gap] || 0}px;
  align-items: ${(props) => props.align || "stretch"};
  justify-content: ${(props) => props.justify || "flex-start"};
`;
