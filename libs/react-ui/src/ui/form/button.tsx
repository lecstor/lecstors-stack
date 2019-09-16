import styled from "styled-components";

type CustomProps = {
  mode?: string;
};

const Button = styled.button.attrs<CustomProps>(({ mode }) => ({
  mode: mode || "primary"
}))<CustomProps>`
  position: relative;
  display: inline-block;
  padding: 0.6rem 1.2rem;
  font-size: 1.6rem;
  font-weight: 600;
  line-height: 2rem;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-repeat: repeat-x;
  background-position: -1px -1px;
  background-size: 110% 110%;
  border: 1px solid rgba(27, 31, 35, 0.2);
  border-radius: 0.25em;
  -webkit-appearance: none;

  /* small */
  /* padding: 3px 10px;
  font-size: 12px;
  line-height: 20px; */

  /* primary */
  ${p =>
    p.mode === "primary" &&
    `
    color: #fff;
    background-color: #0366d6;
    background-image: linear-gradient(-180deg, #2196f3, #0366d6 90%);
  `}

  ${p =>
    p.mode === "secondary" &&
    `
    color: inherit;
    background-color: none;
    background-image: none;
  `}
`;

export default Button;
