import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import ExitToApp from "@material-ui/icons/ExitToApp";

import TextField from "../components/textField";

import { useLogIn } from "./hooks";

const validationSchema = Yup.object().shape({
  username: Yup.string()
    // .email("Invalid email address")
    .required("Required"),
  password: Yup.string()
    .min(2, "Must be longer than 2 characters")
    .max(100, "Sorry, but can you provide a shorter version of your password")
});

type FormData = {
  username: string;
  password: string;
};

const Login = () => {
  const [res, setRes] = useState<{ error?: { message: string } }>({});
  const apiLogIn = useLogIn();
  const { register, handleSubmit, errors } = useForm<FormData>({
    mode: "onBlur",
    validationSchema
  });

  // const onSubmit = values =>
  //   apiLogIn(values).then(err => {
  //     if (err) {
  //       setRes(err);
  //     }
  //   });

  const onSubmit = (values: FormData) => {
    console.log({ values });
    apiLogIn(values).then(err => {
      if (err) {
        setRes(err);
      }
    });
  };

  return (
    <Box p="2">
      <Typography variant="h3" component="h1" gutterBottom>
        Login
      </Typography>
      <Box p="0 1rem 1rem">
        or{" "}
        <Link data-testid="link-register" to="/a/register">
          Register a new account
        </Link>
      </Box>
      <Box display="flex" justifyContent="center">
        <Box padding="2">{res.error && res.error.message}</Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            name="username"
            type="text"
            label="Username"
            data-testid="login-input-username"
            inputRef={register}
            error={Boolean(errors.username)}
            helperText={errors.username?.message}
          />
          <TextField
            name="password"
            type="password"
            label="Password"
            data-testid="login-input-password"
            inputRef={register}
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
          />
          <Box pt={2} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              size="medium"
              data-testid="login-button"
              endIcon={<ExitToApp />}
            >
              Log In
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};
export default Login;
