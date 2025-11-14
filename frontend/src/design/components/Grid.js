import styled from "styled-components";
import { spacing } from "../tokens/spacing";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${spacing.md}px;
  width: 100%;
`;

export default Grid;
