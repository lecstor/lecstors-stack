/// <reference types="Cypress" />

describe("Register", () => {
  const { baseUrl } = Cypress.config();
  const email = "e2e-register@example.com";

  beforeEach(() => {
    cy.deleteUser(email);
  });

  it("Registers a new account", () => {
    cy.visit("/");
    cy.get("[data-testid=link-register]").click();
    cy.url().should("eq", `${baseUrl}/a/register`);

    cy.get('input[name="firstname"]')
      .type("F")
      .should("have.value", "F")
      .blur();

    cy.get(
      "[data-testid=register-input-firstname] p.MuiFormHelperText-root"
    ).should("contain", "Must be longer than 2 characters");

    cy.get('input[name="firstname"]')
      .type("red")
      .should("have.value", "Fred");

    cy.get(
      "[data-testid=register-input-firstname] p.MuiFormHelperText-root"
    ).should("not.exist");

    cy.get('input[name="surname"]')
      .type("F")
      .should("have.value", "F")
      .blur();

    cy.get(
      "[data-testid=register-input-surname] p.MuiFormHelperText-root"
    ).should("contain", "Must be longer than 2 characters");

    cy.get('input[name="surname"]')
      .type("lintstone")
      .should("have.value", "Flintstone");

    cy.get(
      "[data-testid=register-input-surname] p.MuiFormHelperText-root"
    ).should("not.exist");

    cy.get('input[name="email"]')
      .type("f")
      .should("have.value", "f")
      .blur();

    const error = cy.get(
      "[data-testid=register-input-email] p.MuiFormHelperText-root"
    );
    error.should("contain", "Invalid email address");

    cy.get('input[name="email"]')
      .clear()
      .type(email)
      .should("have.value", email);

    cy.get(
      "[data-testid=register-input-email] p.MuiFormHelperText-root"
    ).should("not.exist");

    cy.get("[data-testid=register-button]").click();
    cy.url().should("eq", `${baseUrl}/`);
    cy.get("h1").should("contain", "Home");
    cy.get("#root").should("contain", "Fred");
  });
});
