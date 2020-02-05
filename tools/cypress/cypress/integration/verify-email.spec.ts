/// <reference types="Cypress" />

describe("Verify Email", () => {
  const email = "verify@example.com";

  beforeEach(() => {
    cy.deleteUser(email);
  });

  it("Verifies email while logged in", () => {
    cy.registerUser({ email });
    cy.verifyEmail({ email });
    cy.get("[data-testid=is-verified]").contains("verified: yes");
  });

  it("Verifies email while logged out", () => {
    cy.registerUser({ email });
    cy.logoutUser();
    cy.verifyEmail({ email });
    cy.get("[data-testid=is-verified]").contains("verified: yes");
  });
});
