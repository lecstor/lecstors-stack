describe("Login", function() {
  it("Visits the React App", function() {
    cy.visit("http://localhost:4321");
    cy.contains("Submit").click();
    cy.url().should("include", "/login");
    cy.get("#root").should("contain", "User not found");

    cy.get('input[name="username"]')
      .type("lecstor")
      .should("have.value", "lecstor");

    cy.get('input[name="password"]')
      .type("fooBar")
      .should("have.value", "fooBar");

    cy.contains("Submit").click();
    cy.get("h2").should("contain", "Hi Jason");
  });
});
