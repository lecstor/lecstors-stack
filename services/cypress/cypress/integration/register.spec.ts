/// <reference types="Cypress" />

describe("Register", () => {
  const { baseUrl } = Cypress.config();

  it("Visits the React App", () => {
    cy.visit("/");
    cy.get("[data-testid=link-register]").click();
    cy.url().should("eq", `${baseUrl}/p/register`);

    cy.get('input[name="firstname"]')
      .type("F")
      .should("have.value", "F")
      .blur();

    cy.get("[data-testid=register-input-firstname-error]").should(
      "contain",
      "Must be longer than 2 characters"
    );

    cy.get('input[name="firstname"]')
      .type("red")
      .should("have.value", "Fred");

    cy.get("[data-testid=register-input-firstname-error]").should("not.exist");

    cy.get('input[name="surname"]')
      .type("F")
      .should("have.value", "F")
      .blur();

    cy.get("[data-testid=register-input-surname-error]").should(
      "contain",
      "Must be longer than 2 characters"
    );

    cy.get('input[name="surname"]')
      .type("lintstone")
      .should("have.value", "Flintstone");

    cy.get("[data-testid=register-input-surname-error]").should("not.exist");

    cy.get('input[name="email"]')
      .type("f")
      .should("have.value", "f")
      .blur();

    cy.get("[data-testid=register-input-email-error]").should(
      "contain",
      "Invalid email address"
    );

    cy.get('input[name="email"]')
      .type("red2@lecstor.com")
      .should("have.value", "fred2@lecstor.com");

    cy.get("[data-testid=register-input-email-error]").should("not.exist");

    cy.contains("Submit").click();
    cy.url().should("eq", `${baseUrl}/`);
    cy.get("h1").should("contain", "Home");
    cy.get("#root").should("contain", "Fred");

    cy.visit("/profile");
    cy.contains("Delete Profile").click();

    cy.url().should("eq", `${baseUrl}/p/login`);
  });
});
