import colors from "./colors";

const { black, blue, white } = colors;

const buttons = {
  primary: {
    label: white.dark1,
    bottom: blue.dark1,
    top: blue.primary,
    hTop: blue.primary,
    hBottom: blue.dark2
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
