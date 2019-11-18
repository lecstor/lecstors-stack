import * as React from "react";
import styled from "styled-components";

import Layout from "../layout";

import colors from "./colors";
import { Caption } from "../typography";

const Swatch = styled.div<{ color: string; variant: string }>`
  width: 6rem;
  height: 6rem;
  background: ${({ theme, color, variant }) => theme.colors[color][variant]};
  display: inline-block;
  /* padding: 0.5rem; */
`;

export default {
  title: "Theme/Colours"
};

export const base = () => {
  return (
    <Layout pad="1">
      {Object.keys(colors).map(color => (
        <Caption key={color}>
          {Object.keys(colors[color]).map(variant => (
            <Swatch key={`${color}-${variant}`} color={color} variant={variant}>
              {variant}
            </Swatch>
          ))}
        </Caption>
      ))}
    </Layout>
  );
};
