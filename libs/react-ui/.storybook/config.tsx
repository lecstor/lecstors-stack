import React from "react";
import { configure, addDecorator, addParameters } from "@storybook/react";
import { DocsPage, DocsContainer } from "@storybook/addon-docs/blocks";
import { ThemeProvider, GlobalStyle } from "../src";

addDecorator(story => (
  <>
    <GlobalStyle />
    <ThemeProvider>{story()}</ThemeProvider>
  </>
));

addParameters({
  docs: {
    container: DocsContainer,
    page: DocsPage
  }
});

configure(require.context("../src", true, /\.story\.(tsx?|mdx)$/), module);
