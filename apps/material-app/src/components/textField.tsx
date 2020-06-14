import React from "react";

import MuiTextField, { TextFieldProps } from "@material-ui/core/TextField";

const TextField = (props: Omit<TextFieldProps, "ref">) => (
  <MuiTextField variant="outlined" margin="normal" fullWidth {...props} />
);

TextField.displayName = "TextField";

export default TextField;
