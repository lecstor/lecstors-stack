import * as React from "react";
import styled from "styled-components";

import { ButtonModes } from "../theme/settings/buttons";
import { ScreenTypographySizes } from "../theme/theme-types";

import Button from "./button";
import ButtonLayout from "./button-layout";

import { SignInIcon } from "../icons";

export default {
  title: "Form/Button",
  component: Button
};

const Table = styled.table`
  td {
    padding: 1rem;
  }
`;

const sizes: Array<keyof ScreenTypographySizes> = [
  "small",
  "regular",
  "medium",
  "large"
];

const Buttons = ({ mode }: { mode: keyof ButtonModes }) => (
  <Table>
    <tbody>
      {sizes.map(size => (
        <tr key={size}>
          <td>
            <Button size={size} mode={mode}>
              <SignInIcon />
              Sign In
            </Button>
          </td>
          <td>
            <Button size={size} mode={mode}>
              Sign In
            </Button>
          </td>
          <td>
            <Button size={size} mode={mode}>
              <SignInIcon />
            </Button>
          </td>
          <td>
            <Button size={size} mode={mode}>
              Sign In
              <SignInIcon />
            </Button>
          </td>
          <td>
            <ButtonLayout>
              <Button size={size} mode={mode}>
                Sign In
                <SignInIcon />
              </Button>
            </ButtonLayout>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);

export const primary = () => (
  <>
    <Buttons mode="primary" />
  </>
);

export const secondary = () => (
  <>
    <Buttons mode="secondary" />
  </>
);

export const caution = () => (
  <>
    <Buttons mode="caution" />
  </>
);

export const danger = () => (
  <>
    <Buttons mode="danger" />
  </>
);

export const success = () => (
  <>
    <Buttons mode="success" />
  </>
);
