import * as React from "react";
import { render } from "testing-library";

import Button from "./button";

describe("Button", () => {
  it("renders without crashing", () => {
    const { getByText, getByRole } = render(<Button>Hello</Button>);
    expect(getByText("Hello")).toBeDefined();
    expect(getByRole("button")).toHaveStyleRule("background-color", "#145ca4");
  });
});
