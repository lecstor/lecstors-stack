import React from "react";
import { useField, Formik, FormikProps, FormikValues } from "formik";
import { useMutation } from "urql";
import { Link } from "react-router-dom";

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

import { loginUser } from "./queries";

type Props = {
  label: string;
  name: string;
  type: string;
};

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

const Login = () => {
  const [res, executeMutation] = useMutation(loginUser);

  const formikProps = {
    initialValues: { username: "", password: "" },
    onSubmit: (values, actions) => {
      executeMutation(values);
      actions.setSubmitting(false);
    }
  };

  return (
    <Layout pad="1">
      <Heading>Login</Heading>
      <Layout pad="2 1 1">
        <Body>
          or{" "}
          <Link data-testid="link-register" to="/p/register">
            Register a new account
          </Link>
        </Body>
      </Layout>
      {res.error && res.error.message}

      <FormLayout>
        <Formik {...formikProps}>
          {(props: FormikProps<FormikValues>) => (
            <form onSubmit={props.handleSubmit}>
              <div>
                <TextField name="username" type="text" label="Username" />
              </div>
              <div>
                <TextField name="password" type="password" label="Password" />
              </div>
              <ButtonLayout>
                <Button type="submit" size="medium">
                  Log In
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
export default Login;
