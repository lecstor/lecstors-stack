import React, { FC, ReactNode } from "react";
import styled, { css } from "styled-components";

import { DropShadowSvgFilter } from "../svg-filters";
import { ButtonModes } from "../theme/settings/buttons";
import {
  Button as ButtonType,
  ScreenSize,
  ScreenTypography
} from "../theme/theme-types";
import { textCss } from "../typography/text";

type Mode = keyof ButtonModes;

type ButtonProps = {
  mode?: Mode;
  size?: keyof ScreenTypography;
  screenSize?: ScreenSize;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const hasManyChildren = (children: ReactNode) =>
  React.Children.count(children) > 1;

const Label = styled.div`
  padding: 1px 0;
`;

const buttonColors = (color: ButtonType) => `
  color: ${color.label};
  background-color: ${color.bottom};
  background-image: linear-gradient(
    -180deg,
    ${color.top},
    ${color.bottom} 95%
  );
  &:hover {
    background-color: ${color.hBottom};
    background-image: linear-gradient(-180deg, ${color.hTop}, ${color.hBottom} 95%);
  }
  &:active {
    background-color: ${color.hBottom};
    background-image: linear-gradient(-180deg, ${color.hBottom}, ${color.hTop} 95%);
  }
`;

const createMode = (
  mode: string,
  { shadow = true }: { shadow?: boolean } = {}
) => css`
  ${shadow &&
    css`
      transition-duration: 0.2s;
      transition-timing-function: ease-out;
      text-shadow: 1px 1px 0px ${({ theme }) => theme.colors.black.shadow};
      .icon {
        filter: url(#drop-shadow);
      }
    `}

  &:active {
    ${Label} {
      padding-top: 2px;
      padding-bottom: 0;
    }
  }

  ${({ theme }) => {
    return `
    ${buttonColors(theme.buttons[mode])}
  `;
  }}
`;

const modes = {
  primary: createMode("primary"),
  danger: createMode("danger"),
  caution: createMode("caution"),
  success: createMode("success"),
  secondary: createMode("secondary", { shadow: false })
};

const modeCss = ({ mode = "primary" }: { mode?: Mode }) => modes[mode];

const Component: FC<ButtonProps> = ({
  children,
  mode = "primary",
  size,
  ...props
}) => (
  <>
    {mode !== "secondary" && <DropShadowSvgFilter />}
    <button {...props}>
      <Label>
        {React.Children.map(children, child => {
          if (typeof child === "string") {
            return <span>{child}</span>;
          }
          return child;
        })}
      </Label>
    </button>
  </>
);

const Button = styled(Component)<ButtonProps>`
  ${({ theme, size, screenSize }) => textCss({ theme, font: size, screenSize })}
  padding: 0.5em;
  ${({ children }) =>
    hasManyChildren(children) &&
    `
    .icon { margin-left: 0.5em; margin-right: 0.5em; }
    .icon:first-child { margin-left: 0; }
    .icon:last-child { margin-right: 0; }
  `}
  position: relative;
  display: inline-block;
  white-space: nowrap;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-repeat: repeat-x;
  background-position: -1px -1px;
  background-size: 110% 110%;
  border: 1px solid rgba(27, 31, 35, 0.2);
  border-radius: 0.25em;
  -webkit-appearance: none;

  ${p => modeCss(p)}
`;

export default Button;
