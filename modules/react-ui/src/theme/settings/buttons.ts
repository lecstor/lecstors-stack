import colors from "./colors";

const { black, blue, green, orange, red, white } = colors;

type ButtonMode = {
  label: string;
  bottom: string;
  top: string;
  hTop: string;
  hBottom: string;
};

export type ButtonModes = {
  primary: ButtonMode;
  secondary: ButtonMode;
  danger: ButtonMode;
  caution: ButtonMode;
  success: ButtonMode;
};

const buttons: ButtonModes = {
  primary: {
    label: white.dark1,
    bottom: blue.dark1,
    top: blue.primary,
    hTop: blue.primary,
    hBottom: blue.dark2
  },
  danger: {
    label: white.dark1,
    bottom: red.dark1,
    top: red.primary,
    hTop: red.primary,
    hBottom: red.dark2
  },
  caution: {
    label: white.dark1,
    bottom: orange.dark1,
    top: orange.primary,
    hTop: orange.primary,
    hBottom: orange.dark2
  },
  success: {
    label: white.dark1,
    bottom: green.dark1,
    top: green.primary,
    hTop: green.primary,
    hBottom: green.dark2
  },
  secondary: {
    label: black.light1,
    bottom: white.dark1,
    top: white.primary,
    hTop: white.primary,
    hBottom: white.dark2
  }
};

export default buttons;
