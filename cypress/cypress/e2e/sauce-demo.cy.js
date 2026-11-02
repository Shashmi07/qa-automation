
import LoginPage from '../../pages/LoginPage';
import InventoryPage from '../../pages/InventoryPage';
import CartPage from '../../pages/CartPage';
import CheckoutPage from '../../pages/CheckoutPage';

describe('Sauce Demo - Page Object Model', () => {

  const loginPage = new LoginPage();
  const inventoryPage = new InventoryPage();
  const cartPage = new CartPage();
  const checkoutPage = new CheckoutPage();

  let users;

  // Runs once before all tests
  before(() => {
    cy.fixture('users').then((data) => {
      users = data;
    });
  });

  // Runs before every test
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  // Test 1: Valid Login
  it('should login successfully', () => {

    cy.login(
      users.standardUser.username,
      users.standardUser.password
    );

    cy.url().should('include', '/inventory.html');
  });

  // Test 2: Locked Out User
  it('should reject locked out user', () => {

    cy.login(
      users.lockedUser.username,
      users.lockedUser.password
    );

    loginPage.verifyError();
  });

  // Test 3: Wrong Password
  it('should reject incorrect password', () => {

    cy.login(
      users.invalidUser.username,
      users.invalidUser.password
    );

    loginPage.verifyError();
  });

  // Test 4: Add Two Products
  it('should add two products to cart', () => {

    cy.login(
      users.standardUser.username,
      users.standardUser.password
    );

    inventoryPage.addBackpack();
    inventoryPage.addBikeLight();

    inventoryPage.verifyCartCount(2);
    inventoryPage.openCart();

    cartPage.verifyProduct('Sauce Labs Backpack');
    cartPage.verifyProduct('Sauce Labs Bike Light');
  });

  // Test 5: Remove Product
  it('should remove a product from cart', () => {

    cy.login(
      users.standardUser.username,
      users.standardUser.password
    );

    inventoryPage.addBackpack();
    inventoryPage.addBikeLight();
    inventoryPage.openCart();

    cartPage.removeBackpack();

    cartPage.verifyBackpackRemoved();
    cartPage.verifyProduct('Sauce Labs Bike Light');
    cartPage.verifyCartItems(1);
  });

  // Test 6: Complete Checkout
  it('should complete checkout successfully', () => {

    cy.login(
      users.standardUser.username,
      users.standardUser.password
    );

    inventoryPage.addBackpack();
    inventoryPage.openCart();

    cartPage.checkout();

    checkoutPage.enterDetails(
      'Test',
      'User',
      '10000'
    );

    checkoutPage.continue();
    checkoutPage.finish();

    checkoutPage.verifyOrderComplete();
  });

});
