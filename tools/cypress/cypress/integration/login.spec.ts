/// <reference types="Cypress" />

describe("Login", () => {
  const { baseUrl } = Cypress.config();
  const email = "e2e-login@example.com";
  const username = "username";
  const password = "password";

  beforeEach(() => {
    cy.deleteUser(email);
  });

  it("fails to log in with invalid username", () => {
    cy.visit("/");

    cy.get('input[name="username"]')
      .type("wrong")
      .should("have.value", "wrong");

    cy.get('input[name="password"]')
      .type("fooBar")
      .should("have.value", "fooBar");

    cy.contains("Log In").click();
    cy.url().should("eq", `${baseUrl}/a/login`);
    cy.get("#root").should("contain", "User not found");
  });

  it("fails to log in with incorrect password", () => {
    cy.registerUser({ email });
    cy.setCredentials({ username, password });
    cy.logoutUser();

    cy.get('input[name="username"]')
      .type(username)
      .should("have.value", username);

    cy.get('input[name="password"]')
      .type("fooBar")
      .should("have.value", "fooBar");

    cy.contains("Log In").click();

    cy.get("#root").should("contain", "Password is incorrect");
  });

  it("logs in", () => {
    cy.registerUser({ email });
    cy.setCredentials({ username, password });
    cy.logoutUser();

    cy.get('input[name="username"]')
      .type(username)
      .should("have.value", username);

    cy.get('input[name="password"]')
      .type(password)
      .should("have.value", password);

    cy.contains("Log In").click();

    cy.url().should("eq", `${baseUrl}/`);
    cy.get("h1").should("contain", "Home");
    cy.get("#root").should("contain", "Fred");
  });
});
