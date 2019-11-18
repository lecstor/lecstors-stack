import * as React from "react";
import Input from "./input";
import Label from "./label";
import FieldLayout from "./field-layout";

import { Div } from "../typography/text";

import Hamburger from "../layout/hamburger";

export default {
  title: "Form/Input",
  component: Input
};

export const alone = () => <Input type="text" />;

export const withLabel = () => (
  <>
    <Label>
      <Div>Email</Div>
      <Input type="text" />
    </Label>
    <Label>
      <Div>Password</Div>
      <Input type="text" />
    </Label>
  </>
);

export const withFieldLayout = () => (
  <>
    <FieldLayout>
      <Label>
        <Div>Email</Div>
        <Input type="text" />
      </Label>
    </FieldLayout>
    <FieldLayout>
      <Label>
        <Div>Password</Div>
        <Input type="password" />
      </Label>
    </FieldLayout>
  </>
);
