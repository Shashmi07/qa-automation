class CheckoutPage {

  enterDetails(firstName, lastName, postalCode) {
    cy.get('[data-test="firstName"]').type(firstName);
    cy.get('[data-test="lastName"]').type(lastName);
    cy.get('[data-test="postalCode"]').type(postalCode);
  }

  continue() {
    cy.get('[data-test="continue"]').click();
  }

  finish() {
    cy.get('[data-test="finish"]').click();
  }

  verifyOrderComplete() {
    cy.get('[data-test="complete-header"]')
      .should('have.text', 'Thank you for your order!');
  }
}

export default CheckoutPage;