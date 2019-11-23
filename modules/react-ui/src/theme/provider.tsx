import React from "react";
import deepmerge from "deepmerge";
import { ThemeProvider as Provider, DefaultTheme } from "styled-components";

import typography from "./settings/typography";

import buttons from "./settings/buttons";
import colors from "./settings/colors";
import screenSizes from "./settings/screen-sizes";
import { ScreenSize } from "./theme-types";

export interface ThemeProviderProps<T extends object, U extends object = T> {
  children?: React.ReactChild; // only one child is allowed, goes through React.Children.only
  theme?: T | ((theme: U) => T);
}

export const ThemeProvider = ({
  children,
  theme: themeOverrides = {}
}: ThemeProviderProps<any, any>) => {
  const smallScreenMaxSize =
    themeOverrides?.screenSizes?.medium || screenSizes.medium;
  const mediumScreenMaxSize =
    themeOverrides?.screenSizes?.large || screenSizes.large;

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
    screenSizes,
    screenSize
  };

  const theme = deepmerge(defaultTheme, themeOverrides);

  return <Provider theme={theme}>{children}</Provider>;
};
