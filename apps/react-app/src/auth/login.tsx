import React from "react";
import { useFormik } from "formik";
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
  formik: {
    getFieldProps: ReturnType<typeof useFormik>["getFieldProps"];
  };
};

const TextField = ({ label, formik, ...props }: Props) => {
  const field = formik.getFieldProps(props);
  return (
    <FieldLayout>
      <Label>
        <Body>{label}</Body>
        <Input {...field} {...props} />
      </Label>
      {/* {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null} */}
    </FieldLayout>
  );
};

const Login = () => {
  const [res, executeMutation] = useMutation(loginUser);

  const formik = useFormik({
    initialValues: { username: "", password: "" },
    onSubmit: (values, actions) => {
      executeMutation(values);
      actions.setSubmitting(false);
    }
  });

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
        <form onSubmit={formik.handleSubmit}>
          <div>
            <TextField
              formik={formik}
              name="username"
              type="text"
              label="Username"
            />
          </div>
          <div>
            <TextField
              formik={formik}
              name="password"
              type="password"
              label="Password"
            />
          </div>
          <ButtonLayout>
            <Button type="submit" size="medium">
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
