import { configure } from '@storybook/react';
import { addParameters } from '@storybook/react';
import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks';

addParameters({
  docs: {
    container: DocsContainer,
    page: DocsPage,
  },
});

configure(require.context('../src', true, /\.story\.(tsx?|mdx)$/), module);
