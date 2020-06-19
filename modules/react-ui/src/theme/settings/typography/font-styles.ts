import { ScreenTypographySizes } from "../../theme-types";

export type FontStyles = {
  [name: string]: {
    size: keyof ScreenTypographySizes;
    fontWeight: 400 | 500;
  };
};

const fontStyles: FontStyles = {
  heading1: {
    size: "xlarge",
    fontWeight: 500,
  },
  heading2: {
    size: "large",
    fontWeight: 500,
  },
  heading3: {
    size: "medium",
    fontWeight: 500,
  },
  heading4: {
    size: "regular",
    fontWeight: 500,
  },
  heading5: {
    size: "small",
    fontWeight: 500,
  },
  body: {
    size: "regular",
    fontWeight: 400,
  },
  bodySmall: {
    size: "small",
    fontWeight: 400,
  },
  caption: {
    size: "xsmall",
    fontWeight: 400,
  },
};

export default fontStyles;
