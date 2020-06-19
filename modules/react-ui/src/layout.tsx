import styled from "styled-components";

type Mode = "hamburger" | "shelf";

type Props = {
  pad?: string;
  mode?: Mode;
  height?: string;
  width?: string;
};

const Layout = styled.div<Props>`
  ${(p) => (p.pad ? `padding: ${p.pad.replace(/([\d.]+)/g, "$1rem")}` : "")}
  ${(p) => p.height && `height: ${p.height};`}
  ${(p) => p.width && `width: ${p.width};`}

  ${({ mode }) =>
    mode === "hamburger" &&
    `
   display: flex;
   flex-direction: column;
   justify-content: space-around;
   align-items: center;
  `}
  
  ${({ mode }) =>
    mode === "shelf" &&
    `
   display: flex;
   flex-direction: row;
   justify-content: space-around;
   align-items: center;
  `}
`;

export default Layout;
