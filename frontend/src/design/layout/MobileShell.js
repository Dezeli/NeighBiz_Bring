import styled from "styled-components";
import { colors } from "../tokens/colors";


const Shell = styled.div`
  width: 100%;
  min-height: 100vh;

  display: flex;
  justify-content: center;

  background: linear-gradient(
    145deg,
    ${colors.bgBase},
    ${colors.bgSoft}
  );
`;


const Content = styled.div`
  width: 100%;
  max-width: 430px;
  min-height: 100vh;
  background: ${colors.white};

  overflow: hidden;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
`;

export default function Layout({ children }) {
  return (
    <Shell>
      <Content>{children}</Content>
    </Shell>
  );
}
