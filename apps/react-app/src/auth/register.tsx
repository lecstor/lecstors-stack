import React from "react";
import { Redirect } from "react-router-dom";
import { useFormik } from "formik";
import { useMutation } from "urql";
import * as Yup from "yup";

import {
  Button,
  ButtonLayout,
  FieldLayout,
  FormLayout,
  Input,
  Label,
  Layout
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
  formik: {
    getFieldProps: ReturnType<typeof useFormik>["getFieldProps"];
  };
} & React.InputHTMLAttributes<HTMLInputElement>;

const TextField = ({ label, formik, ...props }: Props) => {
  const [field, meta] = formik.getFieldProps(props);
  console.log({ field, meta });
  return (
    <FieldLayout>
      <Label>
        {label}
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

  const formik = useFormik({
    initialValues: { firstname: "", surname: "", email: "" },
    onSubmit: (values, actions) => {
      executeMutation(values);
      actions.setSubmitting(false);
    },
    validationSchema
  });

  if (res.data && res.data.createUser) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <h1>Register</h1>
      <Layout pad="1">{res.error && res.error.message}</Layout>
      <FormLayout>
        <form onSubmit={formik.handleSubmit}>
          <div>
            <TextField
              formik={formik}
              name="firstname"
              type="text"
              label="First name"
              maxLength={100}
              data-testid="register-input-firstname"
            />
          </div>
          <div>
            <TextField
              formik={formik}
              name="surname"
              type="text"
              label="Surname"
              maxLength={100}
              data-testid="register-input-surname"
            />
          </div>
          <div>
            <TextField
              formik={formik}
              name="email"
              type="text"
              label="Email"
              data-testid="register-input-email"
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
export default Register;
