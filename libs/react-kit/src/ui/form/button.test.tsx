import * as React from "react";
import * as ReactDOM from "react-dom";
import Button from "./button";

describe("Button", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Button>Hello</Button>, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
