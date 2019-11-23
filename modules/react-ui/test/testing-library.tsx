import React, { FC } from "react";
import { render } from "@testing-library/react";
import { ThemeProvider } from "../src";

const Providers: FC = ({ children }) => {
  return (
    <ThemeProvider>
      <>{children}</>
    </ThemeProvider>
  );
};

const customRender = (ui, options = {}) =>
  render(ui, { wrapper: Providers, ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
