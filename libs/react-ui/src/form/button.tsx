import React, { FC, ReactNode } from "react";
import styled, { css } from "styled-components";

import robotoCrop from "../typography/roboto-crop";
import { DropShadowSvgFilter } from "../svg-filters";
import { Button as ButtonType } from "../theme/theme-types";
import { ScreenSize, ScreenTypography } from "../theme/theme-types";

import { textCss } from "../typography/text";

type Mode = "primary" | "secondary";

type ButtonProps = {
  mode?: Mode;
  size?: keyof ScreenTypography;
  screenSize?: ScreenSize;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const hasManyChildren = (children: ReactNode) =>
  React.Children.count(children) > 1;

const buttonColors = (color: ButtonType) => `
  color: ${color.label};
  background-color: ${color.bottom};
  background-image: linear-gradient(
    -180deg,
    ${color.top},
    ${color.bottom} 90%
  );
  &:hover {
    background-color: ${color.hBottom};
    background-image: linear-gradient(-180deg, ${color.hTop}, ${color.hBottom} 90%);
  }
`;

const modes = {
  primary: css`
    transition-duration: 0.2s;
    transition-timing-function: ease-out;
    text-shadow: 1px 1px 0px ${({ theme }) => theme.colors.black.shadow};
    .icon {
      filter: url(#drop-shadow);
    }

    ${({ theme }) => {
      const { primary } = theme.buttons;
      return `
        ${buttonColors(primary)}
      `;
    }}
  `,
  secondary: css`
    ${({ theme }) => {
      const { secondary } = theme.buttons;
      return `
        color: ${theme.colors.black.primary};
        ${buttonColors(secondary)}
      `;
    }}
  `
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
      {React.Children.map(children, child => {
        if (typeof child === "string") {
          return <span>{child}</span>;
        }
        return child;
      })}
    </button>
  </>
);

const Button = styled(Component)<ButtonProps>`
  ${({ theme, size, screenSize }) => textCss({ theme, font: size, screenSize })}
  ${robotoCrop()}
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
