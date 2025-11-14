import styled from "styled-components";
import { spacing } from "../tokens/spacing";


const PageContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  padding: ${spacing.lg}px;
  gap: ${spacing.lg}px;       // 카드/섹션 간격
  box-sizing: border-box;
`;

export default PageContainer;
