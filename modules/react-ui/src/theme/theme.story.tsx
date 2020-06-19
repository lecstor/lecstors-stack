import * as React from "react";
import styled from "styled-components";
import { readableColor } from "polished";
import { Color } from "./theme-types";

import Layout from "../layout";

import colors from "./settings/colors";
import { Caption } from "../typography";

const Swatch = styled.div<{ color: string; variant: keyof Color }>`
  width: 6rem;
  height: 6rem;
  ${({ theme, color, variant }) =>
    `background: ${theme.colors[color][variant]}; color: ${readableColor(
      theme.colors[color][variant] || "#000"
    )};`};
  display: inline-block;
`;

export default {
  title: "Theme/Colours",
};

export const base = () => {
  return (
    <Layout pad="1">
      {Object.keys(colors).map((color) => (
        <Caption key={color}>
          <Swatch key={`${color}`} color="white" variant="primary">
            {color}
          </Swatch>
          {Object.keys(colors[color]).map((variant) => (
            <Swatch
              key={`${color}-${variant}`}
              color={color}
              variant={variant as keyof Color}
            >
              {variant}
            </Swatch>
          ))}
        </Caption>
      ))}
    </Layout>
  );
};
