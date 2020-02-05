// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// capture coverage which would be lost by cy.visit() call.
// https://github.com/cypress-io/cypress/issues/346#issuecomment-365220178
Cypress.Commands.overwrite("visit", (originalFn, url, options) => {
  cy.window().then(win => {
    // if application code has been instrumented, the app iframe "window" has an object
    const applicationSourceCoverage = win.__coverage__;

    if (applicationSourceCoverage) {
      cy.task("combineCoverage", JSON.stringify(applicationSourceCoverage));
    }
    originalFn(url, options);
  });
});

Cypress.Commands.add("unregisterUser", () => {
  cy.request({
    url: "/api/auth/unregister",
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  });
  cy.visit("/");
});

Cypress.Commands.add(
  "registerUser",
  ({ email, firstname = "Fred", surname = "Flintstone" }) => {
    cy.request({
      url: "/api/auth/register",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: { email, firstname, surname }
    });
    cy.visit("/");
  }
);

Cypress.Commands.add("loginUser", ({ username, password }) => {
  cy.request({
    url: "/api/auth/login",
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: { username, password }
  });
  cy.visit("/");
});

Cypress.Commands.add("setCredentials", ({ username, password }) => {
  cy.request({
    url: "/api/auth/set-credentials",
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: { username, password }
  });
  cy.visit("/");
});

Cypress.Commands.add("logoutUser", () => {
  cy.request({
    url: "/api/auth/logout",
    method: "POST"
  });
  cy.visit("/");
});

Cypress.Commands.add("deleteUser", email => {
  cy.request({
    url: "/api/auth/delete-user",
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: { email }
  });
  cy.visit("/");
});

Cypress.Commands.add(
  "registerUserUi",
  ({ email, firstname = "Fred", surname = "Flintstone" }) => {
    cy.get('input[name="firstname"]').type(firstname);
    cy.get('input[name="surname"]').type(surname);
    cy.get('input[name="email"]').type(email);
    cy.get("[data-testid=register-button]").click();
    cy.get("h1").should("contain", "Home");
  }
);

Cypress.Commands.add("verifyEmail", ({ email }) => {
  cy.request("/api/auth/email-verify-tokens", {
    email
  })
    .should(response => {
      expect(response.body.tokens).to.exist;
      expect(response.body.tokens.length).to.eql(1);
    })
    .then(response => {
      cy.visit(`/verify-email/${response.body.tokens[0].id}`);
    });
});
