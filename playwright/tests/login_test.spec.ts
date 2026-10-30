import {test} from '@playwright/test';
import {LoginPage} from '../pages/LoginPage';
import {InventoryPage} from '../pages/inventorypage';
import {CartPage} from '../pages/cartpage';
import {CheckoutPage} from '../pages/checkoutpage';
import testData from '../test-data/testData.json';

test('Complete Sauce Demo purchase', async ({ page }) => {

    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    //Login

    await loginPage.gotoLoginPage();
    await loginPage.login(
        testData.users.standard.username,
        testData.users.standard.password
    );
    await loginPage.verifyLoginSuccess();

    //Add product to cart
    await inventoryPage.addProductToCart();
    await inventoryPage.openCart();

    //Verify product in cart
    await cartPage.verifyProductInCart();
    await cartPage.proceedToCheckout();         

    //Fill checkout information
    await checkoutPage.enterCheckoutDetails(
        'Shashmi',
        'Amadi',
        '20000'
    );
    
    //Verify checkout complete
    await checkoutPage.finishCheckout();
    await checkoutPage.verifyOrderSuccess();

});