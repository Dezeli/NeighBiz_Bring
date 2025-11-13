import styled from "styled-components";
import { spacing } from "../tokens/spacing";


/*
<Spacer size="xl" />
*/

const Spacer = styled.div`
  height: ${(props) => spacing[props.size] || 0}px;
`;

export default Spacer;
