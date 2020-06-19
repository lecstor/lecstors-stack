import React, { useState } from "react";
import { useForm, OnSubmit } from "react-hook-form";
import * as Yup from "yup";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

import { Credentials } from "../../types";

import TextField from "../../components/textField";

import { useSetCredentials } from "../../auth/hooks";
import usePageTitle from "../../hooks/usePageTitle";

const validationSchema = Yup.object().shape({
  username: Yup.string()
    // .email("Invalid email address")
    .required("Required"),
  password: Yup.string()
    .min(2, "Must be longer than 2 characters")
    .max(100, "Sorry, but can you provide a shorter version of your password"),
});

type FormData = {
  username: string;
  password: string;
};

const Form = ({ onSubmit }: { onSubmit: OnSubmit<FormData> }) => {
  const { register, handleSubmit, errors } = useForm<FormData>({
    mode: "onBlur",
    validationSchema,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <TextField
          name="username"
          type="text"
          label="Username"
          data-testid="set-creds-input-username"
          inputRef={register}
          error={Boolean(errors.username)}
        />
      </div>
      <div>
        <TextField
          name="password"
          type="text"
          label="Password"
          data-testid="set-creds-input-password"
          inputRef={register}
          error={Boolean(errors.password)}
        />
      </div>
      <Box display="flex" justifyContent="flex-end" p={2}>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          data-testid="set-credentials-button"
        >
          Set Credentials
        </Button>
      </Box>
    </form>
  );
};

const SetCredentials = () => {
  usePageTitle("Set Credentials");

  const [res, setRes] = useState<{ error?: { message: string }; ok?: boolean }>(
    {}
  );
  const apiSetCreds = useSetCredentials();

  const onSubmit = (values: Credentials) => apiSetCreds(values).then(setRes);

  return (
    <Box padding={2}>
      <Box padding={2}>{res.error && res.error.message}</Box>

      {res.ok ? <div>Credentials Updated</div> : <Form onSubmit={onSubmit} />}
    </Box>
  );
};

export default SetCredentials;
