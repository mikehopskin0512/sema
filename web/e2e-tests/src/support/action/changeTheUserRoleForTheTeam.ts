import type { Selector } from 'webdriverio';

// @ts-ignore
import {GlobalVars} from "../GlobalVars";
// @ts-ignore
import webElements = require('../sema_web_elements.json');

/**
 * Set the value of the given input field to a new value or add a value to the
 * current selector value
 * @param  {String}   userName   The value to set the selector to
 * @param  {String}   userRole   Element selector
 */
export default async (userName: string, userRole: string) => {

    const parsedSelectorRole = `//p[normalize-space()='${userName}']/../../..//div[contains(@class,'TeamManagement_status__2JVEe ')]`;
    let isDisplayed = await $(parsedSelectorRole).isDisplayed();

    if (isDisplayed) {
        /**
         * Parsing string common name to  actual Selector
         * @param selector to be translated
         */
        await browser.pause(2000);
        await $(parsedSelectorRole)['click']();
    }

    const parsedSelectorRoleInput = `//p[normalize-space()='${userName}']/../../..//div[contains(@class,'TeamManagement_status__2JVEe ')]//input`;
    isDisplayed = await $(parsedSelectorRole).isDisplayed();
    if (isDisplayed) {
        /**
         * Parsing string common name to  actual Selector
         * @param selector to be translated
         */
        await browser.pause(2000);
        await $(parsedSelectorRole)['click']();
    }
    await $(parsedSelectorRoleInput)['setValue'](userRole);

    await browser.keys('Enter');

};
