/// <reference types="Cypress" />

describe("Set Credentials", () => {
  const email = "e2e-set-creds@example.com";

  beforeEach(() => {
    cy.deleteUser(email);
  });

  it("Sets username and password", () => {
    const username = "lecstor6";

    cy.registerUser({ email });

    cy.contains("Set Credentials").click();

    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type("password");
    cy.get("[data-testid=set-credentials-button]").click();
    cy.contains("Credentials Updated");

    cy.logoutUser();
    cy.loginUser({ username, password: "password" });
    cy.get("h1").should("contain", "Home");
  });
});
