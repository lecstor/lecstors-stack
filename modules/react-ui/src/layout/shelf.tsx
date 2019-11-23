import styled from "styled-components";

type Props = {
  pad?: string;
  height?: string;
  width?: string;
};

const Shelf = styled.div<Props>`
  ${p => (p.pad ? `padding: ${p.pad.replace(/([\d.]+)/g, "$1rem")}` : "")}
  ${p => p.height && `height: ${p.height};`}
  ${p => p.width && `width: ${p.width};`}
   display: flex;
   flex-direction: row;
   justify-content: space-around;
   align-items: center;
`;

export default Shelf;
