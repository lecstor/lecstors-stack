import React, { FC } from "react";

import { Body, FieldLayout, Input, Label } from "@lecstor/react-ui";

type Props = {
  label: string;
  error?: { message?: string; type: string };
  ref?: React.Ref<HTMLInputElement>;
} & React.InputHTMLAttributes<HTMLInputElement>;

const FormText: FC<Props> = React.forwardRef<HTMLInputElement, Props>(
  ({ label, error, ...props }: Props, ref) => {
    return (
      <FieldLayout>
        <Label>
          <Body>{label}</Body>
          <Input
            {...props}
            id={props.name}
            ref={ref}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={`error-${props.name}-required error-${props.name}-min error-${props.name}-max error-${props.name}-email`}
          />
        </Label>
        {error && (
          <div className="error" id={`error-${props.name}-${error.type}`}>
            {error.message}
          </div>
        )}
      </FieldLayout>
    );
  }
);

FormText.displayName = "FormText";

export default FormText;
