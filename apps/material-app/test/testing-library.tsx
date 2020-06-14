import React, { FC } from "react";

import { render, RenderOptions } from "@testing-library/react";
import CssBaseline from "@material-ui/core/CssBaseline";
import {
  ThemeProvider as MuiThemeProvider,
  StylesProvider
} from "@material-ui/core/styles";
import { ThemeProvider } from "styled-components";

import { theme } from "../src/theme";

const Providers: FC = ({ children }) => {
  return (
    <>
      <CssBaseline />
      <StylesProvider injectFirst>
        <MuiThemeProvider theme={theme}>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </MuiThemeProvider>
      </StylesProvider>
    </>
  );
};

function customRender(
  ui: React.ReactElement,
  options: Omit<RenderOptions, "queries"> = {}
) {
  return render(ui, { wrapper: Providers, ...options });
}

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
