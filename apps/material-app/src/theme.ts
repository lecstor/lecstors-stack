import { createMuiTheme } from "@material-ui/core/styles";

import deepPurple from "@material-ui/core/colors/deepPurple";
import teal from "@material-ui/core/colors/teal";

// https://material-ui.com/customization/theming/
// https://material-ui.com/customization/default-theme/
// https://material.io/design/color/the-color-system.html#color-usage-and-palettes
// https://material.io/design/color/the-color-system.html#tools-for-picking-colors

// surprisingly button color can only be one of primary, secondary, or default..
// https://github.com/mui-org/material-ui/issues/13875

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: deepPurple[400],
    },
    secondary: {
      main: teal[400],
    },
  },
  props: {
    MuiButton: {
      variant: "contained",
    },
  },
});
