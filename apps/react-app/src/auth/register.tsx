import React from "react";
import { Redirect } from "react-router-dom";
import { useField, Formik, FormikProps, FormikValues } from "formik";
import { useMutation } from "urql";
import * as Yup from "yup";

import {
  Body,
  Button,
  ButtonLayout,
  FieldLayout,
  FormLayout,
  Heading,
  Input,
  Label,
  Layout,
  SignInIcon
} from "@lecstor/react-ui";

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

type Props = {
  label: string;
  name: string;
  type: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const TextField = ({ label, ...props }: Props) => {
  const [field, meta] = useField(props);
  return (
    <FieldLayout>
      <Label>
        <Body>{label}</Body>
        <Input {...field} {...props} />
      </Label>
      {meta.touched && meta.error ? (
        <div className="error" data-testid={`${props["data-testid"]}-error`}>
          {meta.error}
        </div>
      ) : null}
    </FieldLayout>
  );
};

const Register = () => {
  const [res, executeMutation] = useMutation(registerUser);

  console.log({ res });

  const formikProps = {
    initialValues: { firstname: "", surname: "", email: "" },
    onSubmit: (values, actions) => {
      executeMutation(values);
      actions.setSubmitting(false);
    },
    validationSchema
  };

  if (res.data && res.data.createUser) {
    return <Redirect to="/" />;
  }

  return (
    <Layout pad="1">
      <Heading>Register</Heading>
      <Layout pad="1">{res.error && res.error.message}</Layout>
      <FormLayout>
        <Formik {...formikProps}>
          {(props: FormikProps<FormikValues>) => (
            <form onSubmit={props.handleSubmit}>
              <div>
                <TextField
                  name="firstname"
                  type="text"
                  label="First name"
                  maxLength={100}
                  data-testid="register-input-firstname"
                />
              </div>
              <div>
                <TextField
                  name="surname"
                  type="text"
                  label="Surname"
                  maxLength={100}
                  data-testid="register-input-surname"
                />
              </div>
              <div>
                <TextField
                  name="email"
                  type="text"
                  label="Email"
                  data-testid="register-input-email"
                />
              </div>
              <ButtonLayout>
                <Button type="submit" size="medium">
                  Register
                  <SignInIcon />
                </Button>
              </ButtonLayout>
            </form>
          )}
        </Formik>
      </FormLayout>
    </Layout>
  );
};
export default Register;
