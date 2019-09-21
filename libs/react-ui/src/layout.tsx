import styled from "styled-components";

type Props = {
  pad: string;
};

const Layout = styled.div<Props>`
  ${p => (p.pad ? `padding: ${p.pad.replace(/([\d.]+)/g, "$1rem")}` : "")}
`;

export default Layout;
