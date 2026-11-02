describe('Sauce Demo - Cypress Tests', () => {

  let users;

  // Runs once before all tests
  before(() => {
    cy.fixture('users').then((data) => {
      users = data;
    });
  });

  // Runs before every test
  beforeEach(() => {
    cy.visit('/');
  });

  // Test 1: Valid Login
  it('should login successfully with valid credentials', () => {

    cy.get('[data-test="username"]')
      .type(users.standardUser.username);

    cy.get('[data-test="password"]')
      .type(users.standardUser.password);

    cy.get('[data-test="login-button"]').click();

    cy.url().should('include', '/inventory.html');

    cy.get('.inventory_list')
      .should('be.visible');

    cy.get('.inventory_item').then(($items) => {
      expect($items).to.have.length(6);
    });

  });


  // Test 2: Locked Out User
  it('should show an error for locked out user', () => {

    cy.get('[data-test="username"]')
      .type(users.lockedUser.username);

    cy.get('[data-test="password"]')
      .type(users.lockedUser.password);

    cy.get('[data-test="login-button"]').click();

    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain.text', 'locked out');

  });


  // Test 3: Wrong Password
  it('should show an error for incorrect password', () => {

    cy.get('[data-test="username"]')
      .type(users.invalidUser.username);

    cy.get('[data-test="password"]')
      .type(users.invalidUser.password);

    cy.get('[data-test="login-button"]').click();

    cy.get('[data-test="error"]')
      .should('be.visible');

    cy.get('[data-test="error"]').then(($error) => {
      expect($error.text()).to.contain('Username and password');
    });

  });


  // Test 4: Add Two Products
  it('should add two products to the cart', () => {

    cy.get('[data-test="username"]')
      .type(users.standardUser.username);

    cy.get('[data-test="password"]')
      .type(users.standardUser.password);

    cy.get('[data-test="login-button"]').click();

    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]')
      .click();

    cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]')
      .click();

    cy.get('.shopping_cart_badge')
      .should('have.text', '2');

    cy.get('.shopping_cart_link').click();

    cy.contains('Sauce Labs Backpack')
      .should('be.visible');

    cy.contains('Sauce Labs Bike Light')
      .should('be.visible');

  });


  // Test 5: Remove a Product
  it('should remove a product from the cart', () => {

    cy.get('[data-test="username"]')
      .type(users.standardUser.username);

    cy.get('[data-test="password"]')
      .type(users.standardUser.password);

    cy.get('[data-test="login-button"]').click();

    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]')
      .click();

    cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]')
      .click();

    cy.get('.shopping_cart_link').click();

    cy.get('[data-test="remove-sauce-labs-backpack"]')
      .click();

    cy.contains('Sauce Labs Backpack')
      .should('not.exist');

    cy.contains('Sauce Labs Bike Light')
      .should('be.visible');

    cy.get('.cart_item').should('have.length', 1);

  });


  // Test 6: Complete Checkout
  it('should complete the checkout process', () => {

    cy.get('[data-test="username"]')
      .type(users.standardUser.username);

    cy.get('[data-test="password"]')
      .type(users.standardUser.password);

    cy.get('[data-test="login-button"]').click();

    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]')
      .click();

    cy.get('.shopping_cart_link').click();

    cy.get('[data-test="checkout"]').click();

    cy.get('[data-test="firstName"]')
      .type('Test');

    cy.get('[data-test="lastName"]')
      .type('User');

    cy.get('[data-test="postalCode"]')
      .type('10000');

    cy.get('[data-test="continue"]').click();

    cy.get('[data-test="finish"]').click();

    cy.get('[data-test="complete-header"]')
      .should('be.visible')
      .and('have.text', 'Thank you for your order!');

    cy.get('[data-test="complete-header"]').then(($header) => {
      expect($header.text()).to.equal('Thank you for your order!');
    });

  });

});