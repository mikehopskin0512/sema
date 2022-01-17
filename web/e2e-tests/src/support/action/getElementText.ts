import type { Selector } from 'webdriverio';
// @ts-ignore
import webElements = require('../sema_web_elements.json');
import checkIfElementExists from "../lib/checkIfElementExists";
// @ts-ignore
import {GlobalVars} from "../GlobalVars";

/**
 * Get the value of the current selector value
 * @param  {String}   selector Element selector
 */

export default async (selector: Selector) => {
    /**
     * Parsing string common name to  actual Selector
     * @param selector to be translated
     */

    const parsedSelector = webElements[selector];
    await checkIfElementExists(parsedSelector, false, 1);

    GlobalVars.globalCollectionName = await $(parsedSelector).getText();
};
