import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    readonly checkoutButton: Locator;
    readonly cartItem: Locator;

    constructor(page: Page) {
        this.page = page;
        this.checkoutButton = page.locator('#checkout');
        this.cartItem = page.locator('.cart_item');
    }

    async verifyProductInCart() {
        await expect(this.cartItem).toBeVisible();
    }

    async proceedToCheckout() {
        await this.checkoutButton.click();
    }
}