import { css } from "styled-components";

export type FontSize = "small" | "regular" | "medium" | "large" | "xlarge";

export const fontSizes = {
  small: 1.2,
  regular: 1.6,
  medium: 2.4,
  large: 3.2,
  xlarge: 6.4
};

export const fontSize = css<{ size?: FontSize }>`
  font-size: ${p =>
    p.size ? fontSizes[p.size] || fontSizes.regular : fontSizes.regular}rem;
`;
