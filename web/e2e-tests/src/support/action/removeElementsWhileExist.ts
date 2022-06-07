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
        console.log("There is " + webElementsConditionArr.length + " portfolios on the page.");

        await browser.pause(2000);
        await $(parsedSubActionSelector)['click']();
        await browser.pause(1000);
        await $(parsedMainActionSelector).waitForDisplayed({
            timeout: 5000,
        });
        await $(parsedMainActionSelector)['click']();

        await $(parsedConfirmationSelector).waitForDisplayed({
            timeout: 5000,
        });
            await $(parsedConfirmationSelector)['click']();
            await browser.pause(3000);

        webElementsConditionArr = await $$(parsedConditionSelector);
    }
};
