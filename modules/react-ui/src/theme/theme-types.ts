export type Font = {
  fontSize: number;
  lineHeight: number;
  fontWeight?: number;
};

export type Button = {
  label: string;
  top: string;
  bottom: string;
  hTop: string;
  hBottom: string;
};

export type Color = {
  light2: string;
  light1: string;
  primary: string;
  dark1: string;
  dark2: string;
  shadow?: string;
};

export type ScreenSize = "small" | "medium" | "large" | "responsive";

export type ScreenSizes = {
  small: number;
  medium: number;
  large: number;
  responsive?: number;
};

export type ScreenTypographySizes = {
  xsmall: Font;
  small: Font;
  regular: Font;
  medium: Font;
  large: Font;
  xlarge: Font;
};

export type ScreenTypography = {
  heading1: Font;
  heading2: Font;
  heading3: Font;
  heading4: Font;
  heading5: Font;
  body: Font;
  bodySmall: Font;
  caption: Font;
} & ScreenTypographySizes;
