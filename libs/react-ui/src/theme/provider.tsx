import React from "react";
import deepmerge from "deepmerge";
import { ThemeProvider as Provider, DefaultTheme } from "styled-components";

import largeScreenTypographyTheme from "./typography/large-screen";
import mediumScreenTypographyTheme from "./typography/medium-screen";
import smallScreenTypographyTheme from "./typography/small-screen";
import buttons from "./buttons";
import colors from "./colors";
import responsive from "./responsive";
import { ScreenSize } from "./theme-types";

export interface ThemeProviderProps<T extends object, U extends object = T> {
  children?: React.ReactChild; // only one child is allowed, goes through React.Children.only
  theme?: T | ((theme: U) => T);
}

const typography = {
  small: smallScreenTypographyTheme,
  medium: mediumScreenTypographyTheme,
  large: largeScreenTypographyTheme
};

export const ThemeProvider = ({
  children,
  theme: themeOverrides = {}
}: ThemeProviderProps<any, any>) => {
  const smallScreenMaxSize =
    themeOverrides?.responsive?.screen?.medium || responsive.screen.medium;
  const mediumScreenMaxSize =
    themeOverrides?.responsive?.screen?.large || responsive.screen.large;

  let screenSize: ScreenSize = "large";
  if (typeof window !== "undefined") {
    if (window.innerWidth <= mediumScreenMaxSize) {
      screenSize = "medium";
    } else if (window.innerWidth <= smallScreenMaxSize) {
      screenSize = "small";
    }
  }

  const defaultTheme: DefaultTheme = {
    typography: {
      ...typography,
      responsive: typography[screenSize]
    },
    buttons,
    colors,
    responsive: {
      screenSize,
      ...responsive
    }
  };

  const theme = deepmerge(defaultTheme, themeOverrides);

  return <Provider theme={theme}>{children}</Provider>;
};
