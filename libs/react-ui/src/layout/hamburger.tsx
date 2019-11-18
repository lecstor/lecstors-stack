import styled from "styled-components";

type Align = "start" | "end" | "center" | "stretch" | "baseline";

type Props = {
  align?: Align;
};

const Hamburger = styled.div<Props>`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: ${({ align = "stretch" }) => align};
  height: 100%;
  width: 100%;
`;

export default Hamburger;
