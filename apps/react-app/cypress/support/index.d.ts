/// <reference types="cypress" />

type Credentials = {
  username: string;
  password: string;
};

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataCy('greeting')
     */
    loginUser({ username, password }: Credentials): Chainable<Element>;
    logoutUser(): Chainable<Element>;
    registerUser({ email }: { email: string }): Chainable<Element>;
    registerUserUi({ email }: { email: string }): Chainable<Element>;
    setCredentials({ username, password }: Credentials): Chainable<Element>;
    unregisterUser(): Chainable<Element>;
    deleteUser(email: string): Chainable<Element>;
    verifyEmail({ email }: { email: string }): Chainable<Element>;
  }
}
