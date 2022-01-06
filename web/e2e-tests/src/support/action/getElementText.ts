import type { Selector } from 'webdriverio';
// @ts-ignore
import webElements = require('../sema_web_elements.json');
import checkIfElementExists from '../lib/checkIfElementExists';

/**
 * Get the value of the current selector value
 * @param  {String}   method  The method to use (add or set)
 * @param  {String}   selector Element selector
 */



export default async (method: string, selector: Selector) => {
    /**
     * Parsing string common name to  actual Selector
     * @param selector to be translated
     */
    const parsedSelector = webElements[selector];

    await checkIfElementExists(parsedSelector);

    // @ts-ignore
    globalCollectionName = $(parsedSelector).getText();
    console.log(globalCollectionName);
};
