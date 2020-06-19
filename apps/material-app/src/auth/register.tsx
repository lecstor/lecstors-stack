import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import { useRegister } from "./hooks";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import ExitToApp from "@material-ui/icons/ExitToApp";

import TextField from "../components/textField";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Required"),
  firstname: Yup.string()
    .min(2, "Must be longer than 2 characters")
    .max(
      100,
      "Sorry, but can you provide a shorter version of your first name?"
    ),
  surname: Yup.string()
    .min(2, "Must be longer than 2 characters")
    .max(100, "Sorry, but can you provide a shorter version or your surname?")
    .required("Required"),
});

type FormData = {
  firstname: string;
  surname: string;
  email: string;
};

const Register = () => {
  const apiRegister = useRegister();
  const [res, setRes] = useState<{ error?: { message: string } }>();
  const { register, handleSubmit, errors } = useForm<FormData>({
    mode: "onBlur",
    validationSchema,
  });

  const onSubmit = (values: FormData) => {
    apiRegister(values).then((err) => {
      if (err) {
        setRes(err);
      }
    });
  };

  return (
    <Box padding="2">
      <Typography variant="h3" component="h1" gutterBottom>
        Register
      </Typography>
      <Box padding="2">{res?.error && res.error.message}</Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <TextField
            name="firstname"
            type="text"
            label="First name"
            data-testid="register-input-firstname"
            inputRef={register}
            error={Boolean(errors.firstname)}
            helperText={errors.firstname?.message}
          />
        </div>
        <div>
          <TextField
            name="surname"
            type="text"
            label="Surname"
            data-testid="register-input-surname"
            inputRef={register}
            error={Boolean(errors.surname)}
            helperText={errors.surname?.message}
          />
        </div>
        <div>
          <TextField
            name="email"
            type="text"
            label="Email"
            data-testid="register-input-email"
            inputRef={register}
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
          />
        </div>
        <Button
          variant="contained"
          color="secondary"
          type="submit"
          size="medium"
          data-testid="register-button"
          endIcon={<ExitToApp />}
        >
          Register
        </Button>
      </form>
    </Box>
  );
};

export default Register;
