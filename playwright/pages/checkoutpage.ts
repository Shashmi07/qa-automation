import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
    readonly page: Page;
    readonly firstName: Locator;
    readonly lastName: Locator;
    readonly postalCode: Locator;
    readonly continueButton: Locator;
    readonly finishButton: Locator;
    readonly successMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstName = page.locator('#first-name');
        this.lastName = page.locator('#last-name');
        this.postalCode = page.locator('#postal-code');
        this.continueButton = page.locator('#continue');
        this.finishButton = page.locator('#finish');
        this.successMessage = page.locator('.complete-header');
    }

    async enterCheckoutDetails(
        first: string,
        last: string,
        postal: string
    ) {
        await this.firstName.fill(first);
        await this.lastName.fill(last);
        await this.postalCode.fill(postal);
        await this.continueButton.click();
    }

    async finishCheckout() {
        await this.finishButton.click();
    }

    async verifyOrderSuccess() {
        await expect(this.successMessage).toHaveText('Thank you for your order!');
    }
}