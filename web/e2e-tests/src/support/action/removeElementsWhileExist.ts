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
 * @param  {String}   counter               The number of elements to be left
 */
export default async (
    conditionElement: Selector,
    actionElement: Selector,
    subActionElement: Selector,
    confirmationElement: Selector,
    counter: string
) => {

    /**
     * Parsing string common name to  actual Selector
     * @param selector to be translated
     */
    const counterOfElements = parseInt(counter, 10);

    const parsedConditionSelector = webElements[conditionElement];
    const parsedMainActionSelector = webElements[actionElement];
    const parsedSubActionSelector = webElements[subActionElement];
    const parsedConfirmationSelector = webElements[confirmationElement];

    let webElementsConditionArr = await $$(parsedConditionSelector);
    while(webElementsConditionArr.length>counterOfElements) {
        console.log("There is " + webElementsConditionArr.length + " portfolios on the page.");
        await browser.pause(2000);
        await $(parsedSubActionSelector).waitForDisplayed({
            timeout: 10000,
        });
        while (!await $(parsedMainActionSelector).isDisplayed()){
            await $(parsedSubActionSelector)['click']();
            await browser.pause(1000);
        }
        console.log("The three dots menu is clicked: " + parsedSubActionSelector);
        await browser.pause(1000);
        await $(parsedMainActionSelector).waitForDisplayed({
            timeout: 10000,
        });
        while (!await $(parsedConfirmationSelector).isDisplayed()){
            await $(parsedMainActionSelector)['click']();
            await browser.pause(1000);
        }
        console.log("The delete button is clicked: " + parsedMainActionSelector);
        await browser.pause(1000);
        await $(parsedConfirmationSelector).waitForDisplayed({
            timeout: 10000,
        });
        await $(parsedConfirmationSelector)['click']();
        console.log("The confirmation delete button is clicked: " + parsedConfirmationSelector);

        await browser.pause(2000);
        webElementsConditionArr = await $$(parsedConditionSelector);
    }
};
