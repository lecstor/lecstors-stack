import * as React from "react";
import Button from "./button";

export default {
  title: "Button",
  component: Button
};

export const withText = () => (
  <>
    <div>
      <Button>Primary</Button>
    </div>
    <div>
      <Button mode="secondary">Secondary</Button>
    </div>
  </>
);
