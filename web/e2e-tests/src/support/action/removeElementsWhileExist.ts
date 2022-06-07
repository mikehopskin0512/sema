import { Selector } from 'webdriverio';

import checkIfElementExists from '../lib/checkIfElementExists';
// @ts-ignore
import webElements = require('../sema_web_elements.json');

/**
 * Perform an click action on the given element
 * @param  {String}   conditionElement      Element selector
 * @param  {String}   actionElement         Element selector
 * @param  {String}   subActionElement      Element selector
 * @param  {String}   confirmationElement   Element selector
 */
export default async (
    conditionElement: Selector,
    actionElement: Selector,
    subActionElement: Selector,
    confirmationElement: Selector
) => {

    /**
     * Parsing string common name to  actual Selector
     * @param selector to be translated
     */

    const parsedConditionSelector = webElements[conditionElement];
    const parsedMainActionSelector = webElements[actionElement];
    const parsedSubActionSelector = webElements[subActionElement];
    const parsedConfirmationSelector = webElements[confirmationElement];

    let webElementsConditionArr = await $$(parsedConditionSelector);
    while(webElementsConditionArr.length>1) {
        console.log("webElementsConditionArr   length -------------------------------    " + webElementsConditionArr.length);
        console.log("condition -------------------------------    "+$(parsedConditionSelector).isDisplayed());

        await browser.pause(2000);
        await $(parsedSubActionSelector)['click']();
        await browser.pause(1000);
        console.log("parsedMainActionSelector -------------------------------    "+$(parsedMainActionSelector).isDisplayed());

        if (await $(parsedMainActionSelector).isDisplayed()) {
            await $(parsedMainActionSelector)['click']();
            console.log("parsedConfirmationSelector -------------------------------    "+$(parsedMainActionSelector).isDisplayed());

            await $(parsedConfirmationSelector).waitForDisplayed({
                timeout: 5000,
            });
            await $(parsedConfirmationSelector)['click']();
            await browser.pause(1000);
            webElementsConditionArr = await $$(parsedConditionSelector);
        }
    }
};
