class CartPage {

  verifyProduct(productName) {
    cy.contains(productName).should('be.visible');
  }

  removeBackpack() {
    cy.get('[data-test="remove-sauce-labs-backpack"]').click();
  }

  verifyBackpackRemoved() {
    cy.contains('Sauce Labs Backpack').should('not.exist');
  }

  verifyCartItems(count) {
    cy.get('.cart_item').should('have.length', count);
  }

  checkout() {
    cy.get('[data-test="checkout"]').click();
  }
}

export default CartPage;