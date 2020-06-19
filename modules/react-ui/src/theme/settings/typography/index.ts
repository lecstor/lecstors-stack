import { ScreenTypography, ScreenTypographySizes } from "../../theme-types";

import largeScreenTypographyTheme from "./large-screen-font-sizes";
import mediumScreenTypographyTheme from "./medium-screen-font-sizes";
import smallScreenTypographyTheme from "./small-screen-font-sizes";

import variants from "./font-styles";

function addVariants(fontSizes: ScreenTypographySizes) {
  const withVariants = { ...fontSizes };
  Object.keys(variants).forEach((variant) => {
    const { size, fontWeight } = variants[variant];
    withVariants[variant as keyof ScreenTypographySizes] = {
      ...fontSizes[size],
      fontWeight,
    };
  });
  return withVariants as ScreenTypography;
}

const typography = {
  small: addVariants(smallScreenTypographyTheme),
  medium: addVariants(mediumScreenTypographyTheme),
  large: addVariants(largeScreenTypographyTheme),
};

export default typography;
