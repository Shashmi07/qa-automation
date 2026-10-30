import {test} from '@playwright/test';
import {LoginPage} from '../pages/loginpage';
import {InventoryPage} from '../pages/inventorypage';
import {CartPage} from '../pages/cartpage';
import {CheckoutPage} from '../pages/checkoutpage';

test('Complete Sauce Demo purchase', async ({ page }) => {

    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    //Login

    await loginPage.gotoLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
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