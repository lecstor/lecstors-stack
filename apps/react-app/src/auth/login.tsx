import React from "react";
import { useFormik } from "formik";
import { useMutation } from "urql";

import {
  Button,
  ButtonLayout,
  FieldLayout,
  FormLayout,
  Input,
  Label
} from "@lecstor/react-kit/ui/form";

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
    <FieldLayout>
      <Label>
        {label}
        <Input {...field} {...props} />
      </Label>
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
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
    <>
      <h1>Login</h1>
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
            <Button mode="" type="submit">
              Submit
            </Button>
          </ButtonLayout>
        </form>
      </FormLayout>
    </>
  );
};
export default Login;
