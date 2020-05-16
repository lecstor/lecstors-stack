import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import * as Yup from "yup";

import {
  Button,
  ButtonLayout,
  FormLayout,
  Heading,
  Layout
} from "@lecstor/react-ui";

import FormText from "../../components/form-text";

import useSetCreds from "../../auth/hooks/use-set-credentials";

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

const Form = ({ onSubmit }) => {
  const { register, handleSubmit, errors } = useForm<FormData>({
    mode: "onBlur",
    validationSchema
  });

  return (
    <FormLayout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <FormText
            name="username"
            type="text"
            label="Username"
            data-testid="set-creds-input-username"
            ref={register}
            error={errors.username}
          />
        </div>
        <div>
          <FormText
            name="password"
            type="text"
            label="Password"
            data-testid="set-creds-input-password"
            ref={register}
            error={errors.password}
          />
        </div>
        <ButtonLayout>
          <Button
            type="submit"
            size="medium"
            data-testid="set-credentials-button"
          >
            Set Credentials
          </Button>
        </ButtonLayout>
      </form>
    </FormLayout>
  );
};

const SetCredentials = () => {
  const [res, setRes] = useState<{ error?: { message: string }; ok?: boolean }>(
    {}
  );
  const apiSetCreds = useSetCreds();

  const onSubmit = values => apiSetCreds(values).then(setRes);

  return (
    <Layout pad="1">
      <Heading>Set Credentials</Heading>
      <Link data-testid="link-home" to="/">
        Home
      </Link>

      <Layout pad="1">{res.error && res.error.message}</Layout>

      {res.ok ? <div>Credentials Updated</div> : <Form onSubmit={onSubmit} />}
    </Layout>
  );
};
export default SetCredentials;
