import React from "react";
import styled from "styled-components";
// import { withStyles } from "@material-ui/core/styles";

import MuiButton from "@material-ui/core/Button";

const Button = styled(({ color, ...props }) => <MuiButton {...props} />)`
  ${({ theme, color }) => `
    color: ${theme.palette[color].contrastText};
    background-color: ${theme.palette[color].main};
    &:hover {
      background-color: ${theme.palette[color].dark};
      @media (hover: none) {
        background-color: ${theme.palette[color].main};
      }
    }
  `}
`;

export default Button;

// const WarningButton = withStyles(theme => {
//   const { warning } = theme.palette;
//   return {
//     root: {
//       // boxShadow: `0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)`,
//       color: warning.contrastText,
//       backgroundColor: warning.main,
//       "&:hover": {
//         backgroundColor: warning.dark,
//         "@media (hover: none)": {
//           backgroundColor: warning.main
//         }
//       }
//     }
//   };
// })(MuiButton);
