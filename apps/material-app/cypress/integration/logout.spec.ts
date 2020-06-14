/// <reference types="Cypress" />

describe("Logout", () => {
  const email = "e2e-logout@example.com";

  beforeEach(() => {
    cy.deleteUser(email);
  });

  it("logs out", () => {
    cy.registerUser({ email });
    cy.get("button[aria-label='account menu']").click();
    cy.contains("Log Out").click();
    cy.get("h1").should("contain", "Login");
    cy.contains("Log In");
  });
});
