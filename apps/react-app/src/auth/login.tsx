import React, { useState } from "react";
import { Link } from "react-router-dom";
import useForm from "react-hook-form";
import * as Yup from "yup";

import {
  Body,
  Button,
  ButtonLayout,
  FormLayout,
  Heading,
  Layout,
  SignInIcon
} from "@lecstor/react-ui";

import FormText from "../components/form-text";

import useLogIn from "./hooks/use-log-in";

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

  const onSubmit = values =>
    apiLogIn(values).then(err => {
      if (err) {
        setRes(err);
      }
    });

  return (
    <Layout pad="1">
      <Heading>Login</Heading>
      <Layout pad="2 1 1">
        <Body>
          or{" "}
          <Link data-testid="link-register" to="/a/register">
            Register a new account
          </Link>
        </Body>
      </Layout>
      <Layout pad="1">{res.error && res.error.message}</Layout>

      <FormLayout>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <FormText
              name="username"
              type="text"
              label="Username"
              data-testid="login-input-username"
              ref={register}
              error={errors.username}
            />
          </div>
          <div>
            <FormText
              name="password"
              type="text"
              label="Password"
              data-testid="login-input-password"
              ref={register}
              error={errors.password}
            />
          </div>
          <ButtonLayout>
            <Button type="submit" size="medium" data-testid="login-button">
              Log In
              <SignInIcon />
            </Button>
          </ButtonLayout>
        </form>
      </FormLayout>
    </Layout>
  );
};
export default Login;
