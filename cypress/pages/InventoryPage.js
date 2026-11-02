class InventoryPage {

  addBackpack() {
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  }

  addBikeLight() {
    cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  }

  verifyCartCount(count) {
    cy.get('.shopping_cart_badge').should('have.text', String(count));
  }

  openCart() {
    cy.get('.shopping_cart_link').click();
  }
}

export default InventoryPage;