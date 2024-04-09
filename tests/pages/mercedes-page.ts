import { Page, BrowserContext } from "playwright";
import {  Locator } from "@playwright/test";


export class BasePage {
    readonly page: Page;
    readonly agreeAll: Locator;
    readonly stateText: Locator;
    readonly postalCode1: Locator;
    readonly radioPrivate: Locator;
    readonly continueButton: Locator;
    readonly filter: Locator;
    readonly preOwned: Locator;
    readonly colours: Locator;
    readonly coloursDrop: Locator;
    readonly closeFilter:Locator;
    readonly selectedFilter:Locator;
    readonly resetFilter:Locator;
    readonly sorting:Locator;
    readonly exploreButton:Locator;
    readonly speakExpertButton:Locator;
    readonly firstName:Locator;
    readonly lastName:Locator;
    readonly email:Locator;
    readonly phone:Locator;
    readonly postalCode2:Locator;
    readonly proceedButton:Locator;
    readonly error:Locator;

    context: BrowserContext;

    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
        this.agreeAll = page.getByRole('button', {name: 'Agree to all'});
        this.stateText = page.getByLabel('* Your state');
        this.postalCode1= page.getByText('* Postal Code');
        this.radioPrivate = page.getByRole('radio', {name: 'Private'});
        this.continueButton = page.getByRole('button', {name: 'Continue'});
        this.filter = page.locator('[class=show]:left-of([id=srp-result])');
        this.preOwned = page.getByRole('button').getByText('Pre-Owned');
        this.colours = page.locator('p').filter({ hasText: /^Colour$/ });
        this.coloursDrop = page.getByText('Colour 0');
        this.closeFilter = page.locator('.close-button');
        this.selectedFilter = page.locator('[data-test-id="dcp-selected-filters-widget-tag"]');
        this.resetFilter = page.locator('data-test-id=dcp-selected-filters-widget-reset');
        this.sorting = page.getByLabel('Sorting');
        this.exploreButton = page.locator('.dcp-cars-product-tile>a');
        this.speakExpertButton = page.locator('[data-test-id="dcp-buy-box__contact-seller"]');
        this.firstName = page.getByLabel('First Name');
        this.lastName = page.getByLabel('Last Name');
        this.email = page.getByLabel('E-Mail');
        this.phone = page.locator('[data-test-id="rfq-contact__phone"]').getByLabel('Phone');
        this.postalCode2 = page.getByLabel('Postal Code');
        this.proceedButton = page.locator('[data-test-id="dcp-rfq-contact-button-container__button-next"]').filter({hasText:'Proceed'});
        this.error = page.locator('.dcp-error-message');

    }

}

