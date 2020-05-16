// import styledNormalize from "styled-normalize";
import modernNormalize from "styled-modern-normalize";
import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  ${modernNormalize}

  html, body {
    font-family: Roboto, sans-serif;
    font-size: 10px;
    line-height: 1.5;
  }

  * {
    box-sizing: border-box;
  }
`;
