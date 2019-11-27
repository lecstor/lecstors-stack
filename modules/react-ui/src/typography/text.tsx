import React, { FC } from "react";
import styled, { css, DefaultTheme } from "styled-components";

import robotoCrop from "./roboto-crop";

import { ScreenSize, ScreenTypography } from "../theme/theme-types";

type GetCssOptions = {
  theme: DefaultTheme;
  font?: keyof ScreenTypography;
  color?: string;
  screenSize?: ScreenSize;
};

export const textCss = ({
  theme,
  font = "body",
  screenSize = "responsive"
}: GetCssOptions) => {
  let screenTheme = theme.typography[screenSize];
  if (!screenTheme) {
    console.log(
      `screen font theme not configured for screen size "${screenSize}"`
    );
    screenTheme = theme.typography["large"];
  }
  let screenFont = screenTheme[font];
  if (!screenFont) {
    console.log(`theme not configured for font "${font}"`);
    screenFont = screenTheme.body;
  }
  const { fontSize, fontWeight, lineHeight } = screenFont;
  return css`
    font-size: ${fontSize}rem;
    font-weight: ${fontWeight};
    ${robotoCrop({ lineHeight })}
  `;
};

type DivProps = {
  font?: keyof ScreenTypography;
  screenSize?: ScreenSize;
};

export const Div = styled.div<DivProps>`
  ${({ theme, font = "body", screenSize }) =>
    textCss({ theme, font, screenSize })}
  color: ${({ theme, color = theme.colors.black.dark1 }) => color};
`;

export const P: FC<DivProps> = props => <Div as="p" {...props} />;

const Hn = styled(Div)`
  margin-block-start: 0;
  margin-block-end: 0;
`;

export const H1: FC<DivProps> = ({ font = "heading1", ...props }) => (
  <Hn as="h1" font={font} {...props} />
);
export const H2: FC<DivProps> = ({ font = "heading2", ...props }) => (
  <Hn as="h2" font={font} {...props} />
);
export const H3: FC<DivProps> = ({ font = "heading3", ...props }) => (
  <Hn as="h3" font={font} {...props} />
);
export const H4: FC<DivProps> = ({ font = "heading4", ...props }) => (
  <Hn as="h4" font={font} {...props} />
);
export const H5: FC<DivProps> = ({ font = "heading5", ...props }) => (
  <Hn as="h5" font={font} {...props} />
);

export const Heading = H1;
export const SubHeading = H2;

export const Body: FC<{ screenSize?: ScreenSize }> = props => (
  <Div {...props} font="body" />
);

export const BodySmall: FC<{ screenSize?: ScreenSize }> = props => (
  <Div {...props} font="bodySmall" />
);

export const Caption: FC<{ screenSize?: ScreenSize }> = props => (
  <Div {...props} font="caption" />
);
