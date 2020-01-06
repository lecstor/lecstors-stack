import React from "react";
import { Redirect } from "react-router-dom";
import useForm from "react-hook-form";
import { useMutation } from "urql";
import * as Yup from "yup";

import {
  Button,
  ButtonLayout,
  FormLayout,
  Heading,
  Layout,
  SignInIcon
} from "@lecstor/react-ui";

import FormText from "../components/form-text";

import { registerUser } from "./queries";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Required"),
  firstname: Yup.string()
    .min(2, "Must be longer than 2 characters")
    .max(
      100,
      "Sorry, but can you provide a shorter version of your first name?"
    ),
  surname: Yup.string()
    .min(2, "Must be longer than 2 characters")
    .max(100, "Sorry, but can you provide a shorter version or your surname?")
    .required("Required")
});

type FormData = {
  firstname: string;
  lastname: string;
  email: string;
};

const Register = () => {
  const [res, executeMutation] = useMutation(registerUser);
  const { register, handleSubmit, watch, errors } = useForm<FormData>({
    mode: "onBlur",
    validationSchema
  });

  console.log({ res, errors });

  console.log(watch("firstname")); // watch input value by passing the name of it

  const onSubmit = values => {
    executeMutation(values);
  };

  if (res.data && res.data.createUser) {
    return <Redirect to="/" />;
  }

  return (
    <Layout pad="1">
      <Heading>Register</Heading>
      <Layout pad="1">{res.error && res.error.message}</Layout>
      <FormLayout>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <FormText
              name="firstname"
              type="text"
              label="First name"
              maxLength={100}
              data-testid="register-input-firstname"
              ref={register}
              error={errors.firstname}
            />
          </div>
          <div>
            <FormText
              name="surname"
              type="text"
              label="Surname"
              maxLength={100}
              data-testid="register-input-surname"
              ref={register}
              error={errors.surname}
            />
          </div>
          <div>
            <FormText
              name="email"
              type="text"
              label="Email"
              data-testid="register-input-email"
              ref={register}
              error={errors.email}
            />
          </div>
          <ButtonLayout>
            <Button type="submit" size="medium" data-testid="register-button">
              Register
              <SignInIcon />
            </Button>
          </ButtonLayout>
        </form>
      </FormLayout>
    </Layout>
  );
};

export default Register;
