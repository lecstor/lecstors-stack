import * as React from "react";
import { render } from "testing-library";

import FormText from "./form-text";

describe("components", () => {
  describe("FormText", () => {
    it("renders empty field", () => {
      const { getByText, getByLabelText } = render(
        <FormText label="My Field" name="my-field" />
      );
      getByText("My Field");
      const input = getByLabelText("My Field");

      expect(input).toBeInstanceOf(HTMLInputElement);
      if (input instanceof HTMLInputElement) {
        expect(input.value).toBe("");
      }
    });

    it("renders filled field", () => {
      const { getByText, getByLabelText } = render(
        <FormText label="My Field" name="my-field" defaultValue="Hello World" />
      );
      getByText("My Field");
      const input = getByLabelText("My Field");
      if (input instanceof HTMLInputElement) {
        expect(input.value).toBe("Hello World");
      }
    });

    it("renders filled field with error", () => {
      const { getByText, getByLabelText } = render(
        <FormText
          label="My Field"
          name="my-field"
          defaultValue="Hello World"
          error={{ type: "min", message: "My field not long enough" }}
        />
      );
      getByText("My Field");
      const input = getByLabelText("My Field");
      if (input instanceof HTMLInputElement) {
        expect(input.value).toBe("Hello World");
      }

      const error = getByText("My field not long enough");
      expect(error).toHaveAttribute("id", "error-my-field-min");
    });
  });
});
