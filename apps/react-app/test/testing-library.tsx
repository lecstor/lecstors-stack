import React, { FC } from "react";

import { render } from "@testing-library/react";
import { ThemeProvider, GlobalStyle } from "@lecstor/react-ui";

const Providers: FC = ({ children }) => {
  return (
    <ThemeProvider>
      <>
        <GlobalStyle />
        {children}
      </>
    </ThemeProvider>
  );
};

const customRender = (ui, options = {}) =>
  render(ui, { wrapper: Providers, ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
