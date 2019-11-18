import "styled-components";
import * as Theme from "./theme-types";

// and extend them!
declare module "styled-components" {
  export interface DefaultTheme {
    typography: {
      small: Theme.ScreenTypography;
      medium: Theme.ScreenTypography;
      large: Theme.ScreenTypography;
      responsive?: Theme.ScreenTypography;
    };
    buttons: {
      [name: string]: Theme.Button;
    };
    colors: {
      [name: string]: Theme.Color;
    };
    responsive: {
      screenSize: Theme.ScreenSize;
      screen: {
        small: number;
        isSmall?: boolean;
      };
    };
  }
}
