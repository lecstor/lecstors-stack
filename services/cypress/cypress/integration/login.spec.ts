/// <reference types="Cypress" />

describe("Login", () => {
  const { baseUrl } = Cypress.config();

  it("Visits the React App", () => {
    cy.visit("/");
    cy.contains("Submit").click();
    cy.url().should("eq", `${baseUrl}/p/login`);
    cy.get("#root").should("contain", "User not found");

    cy.get('input[name="username"]')
      .type("lecstor")
      .should("have.value", "lecstor");

    cy.get('input[name="password"]')
      .type("fooBar")
      .should("have.value", "fooBar");

    cy.contains("Submit").click();
    cy.url().should("eq", `${baseUrl}/`);
    cy.get("h1").should("contain", "Home");
    cy.get("#root").should("contain", "Jason");
  });
});
