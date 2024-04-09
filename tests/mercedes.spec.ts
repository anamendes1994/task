import { test, expect, type Page } from '@playwright/test';
import {hasSubscribers} from "diagnostics_channel";
import { readFileSync, writeFileSync } from 'fs';
import * as fs from "fs";
import { BasePage } from "./pages/mercedes-page";


const page1 = "https://shop.mercedes-benz.com/en-au/shop/vehicle/srp/demo";
const page2 = "https://shop.mercedes-benz.com/en-au/shop/vehicle/srp/demo?error=login_required#.";
const page3 = "https://shop.mercedes-benz.com/en-au/shop/vehicle/srp/demo?error=login_required";
const page4 = "https://shop.mercedes-benz.com/en-au/shop/vehicle/srp/demo?error=login_required&sort=relevance-demo&assortment=vehicle";

const state = 'New South Wales';
const colour = 'Emerald Green Metallic';
const firstName = 'Ana';
const lastName = 'Mendes';
const email = 'anamendesgmail.com'
const phone = '0441234567'
const postalCode = '2007'

test('Mercedes use Case',
    async ({page}) => {
        test.setTimeout(120000);

        await test.step('Access Mercedes Benz website', async () => {
            await page.goto(page1);
            await page.goto(page2);
            await page.goto(page3);
            await page.goto(page4);
            await page.getByRole('button', {name: 'Agree to all'}).click();
            await expect(page.getByLabel('* Your state')).toBeVisible();
        });

        await test.step('Select location', async () => {
            await page.getByLabel('* Your state').selectOption(state);
            await page.getByText('* Postal Code').click({force: true});
            await page.getByText('* Postal Code').fill('2007');
            await page.getByRole('radio', {name: 'Private'}).click({force: true});
            await page.getByRole('button', {name: 'Continue'}).click();
        });

        await test.step('Define Filter', async () => {
            await page.locator('[class=show]:left-of([id=srp-result])').click();
            await page.getByRole('button').getByText('Pre-Owned').click();
            await page.locator('p').filter({ hasText: /^Colour$/ }).click();
            await page.getByText('Colour 0').click();
            await page.getByText(colour).click();
            await page.locator('.close-button').click();
            await expect(page.locator('[data-test-id="dcp-selected-filters-widget-tag"]').getByText(colour)).toBeVisible();
            await expect(page.locator('data-test-id=dcp-selected-filters-widget-reset')).toBeVisible();
        });

        await test.step('Choose more expensive car', async () => {
            await page.getByLabel('Sorting').selectOption('Price (descending)');
            await page.locator('.dcp-cars-product-tile>a').first().click();
        });

        await test.step('Navigate to details and save VIN number and Model Year', async () => {
            const VIN = await page.locator('[data-test-id="dcp-vehicle-details-list-item-11"]').textContent();
            const modelYear = await page.locator('[data-test-id="dcp-vehicle-details-list-item-1"]').textContent();
            const timestamp = Date.now();
            const filename = `details_${timestamp}.txt`;
            fs.writeFileSync(filename, VIN + ' ' + modelYear);
        });

        await test.step('Select speak to an expert button and fill the form with invalid email format',async () =>{
            await page.locator('[data-test-id="dcp-buy-box__contact-seller"]').click();
            await page.getByLabel('First Name').fill(firstName);
            await page.getByLabel('Last Name').fill(lastName);
            await page.getByLabel('E-Mail').fill(email);
            await page.locator('[data-test-id="rfq-contact__phone"]').getByLabel('Phone').fill(phone);
            await page.getByLabel('Postal Code').fill(postalCode);
            await page.locator('[data-test-id="dcp-rfq-contact-button-container__button-next"]').filter({hasText:'Proceed'}).click();
            const error = await page.locator('.dcp-error-message').textContent();
            await expect(page.locator('.dcp-error-message')).toHaveText('An error has occurred.Please check the following sections: Please check the data you entered.');
        });

    });