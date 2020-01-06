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

    cy.get("#error-firstname-min").should(
      "contain",
      "Must be longer than 2 characters"
    );

    cy.get('input[name="firstname"]')
      .type("red")
      .should("have.value", "Fred");

    cy.get("#error-firstname-min").should("not.exist");

    cy.get('input[name="surname"]')
      .type("F")
      .should("have.value", "F")
      .blur();

    cy.get("#error-surname-min").should(
      "contain",
      "Must be longer than 2 characters"
    );

    cy.get('input[name="surname"]')
      .type("lintstone")
      .should("have.value", "Flintstone");

    cy.get("#error-surname-min").should("not.exist");

    cy.get('input[name="email"]')
      .type("f")
      .should("have.value", "f")
      .blur();

    cy.get("#error-email-undefined").should("contain", "Invalid email address");

    cy.get('input[name="email"]')
      .type("red4@lecstor.com")
      .should("have.value", "fred4@lecstor.com");

    cy.get("#error-email-undefined").should("not.exist");

    cy.get("[data-testid=register-button]").click();
    cy.url().should("eq", `${baseUrl}/`);
    cy.get("h1").should("contain", "Home");
    cy.get("#root").should("contain", "Fred");

    cy.contains("Profile").click();
    cy.contains("Delete Profile").click();

    cy.url().should("eq", `${baseUrl}/p/login`);
  });
});
