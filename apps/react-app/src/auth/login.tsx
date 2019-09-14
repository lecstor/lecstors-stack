import React from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { useMutation } from "urql";

import Button from "@lecstor/react-kit/ui/form/button";
import Input from "@lecstor/react-kit/ui/form/input";
import Label from "@lecstor/react-kit/ui/form/label";

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
  const [field, meta] = formik.getFieldProps(props);
  return (
    <>
      <Label>
        {label}
        <Input {...field} {...props} />
      </Label>
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
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
    <>
      <h1>Login</h1>
      <Link to="/a">App</Link>
      {res.error && res.error.message}

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
        <Button mode="primary" type="submit">
          Submit
        </Button>
      </form>
    </>
  );
};
export default Login;
