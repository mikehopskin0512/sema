import { Selector } from 'webdriverio';

// @ts-ignore
import webElements = require('../sema_web_elements.json');

/**
 * Scroll the page to the given element
 * @param  {String}   selector Element selector
 */
export default async (selector: Selector) => {
    /**
     * Parsing string common name to  actual Selector
     * @param selector to be translated
     */
    const parsedSelector = webElements[selector];

    await $(parsedSelector).scrollIntoView();
};
