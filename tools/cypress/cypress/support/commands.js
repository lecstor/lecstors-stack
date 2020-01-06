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
