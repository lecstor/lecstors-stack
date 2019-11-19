import { Color } from "../theme-types";
import { darken, lighten } from "polished";

const blue = "#1976d2";
const grey = "#bdbdbd";
const white = "#fff";
const black = "#000";
const red = "#e53935";
const orange = "#ff9800";
const green = "#4caf50";

const standardRange = (color: string) => ({
  light2: lighten(0.2, color),
  light1: lighten(0.1, color),
  primary: color,
  dark1: darken(0.1, color),
  dark2: darken(0.2, color)
});

const colors: { [color: string]: Color } = {
  blue: standardRange(blue),
  red: standardRange(red),
  orange: standardRange(orange),
  green: standardRange(green),
  grey: standardRange(grey),
  white: standardRange(white),
  black: {
    ...standardRange(black),
    shadow: "rgba(0, 0, 0, 0.3)"
  }
};

export default colors;
