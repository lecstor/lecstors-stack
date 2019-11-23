import React, { FC } from "react";
import { Redirect } from "react-router-dom";
import useForm from "react-hook-form";
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
  error: { message?: string; type: string };
  ref?: React.Ref<HTMLInputElement>;
} & React.InputHTMLAttributes<HTMLInputElement>;

const TextField: FC<Props> = React.forwardRef<HTMLInputElement, Props>(
  ({ label, error, ...props }: Props, ref) => {
    return (
      <FieldLayout>
        <Label>
          <Body>{label}</Body>
          <Input
            {...props}
            ref={ref}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={`error-${props.name}-required error-${props.name}-min error-${props.name}-max error-${props.name}-email`}
          />
          {error && (
            <div
              className="error"
              id={`error-${props.name}-${error.type}`}
              data-testid={`${props["data-testid"]}-error`}
            >
              {error.message}
            </div>
          )}
        </Label>
      </FieldLayout>
    );
  }
);

TextField.displayName = "TextField";

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
            <TextField
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
            <TextField
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
            <TextField
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
