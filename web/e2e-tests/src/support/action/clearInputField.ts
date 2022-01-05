import { Selector } from 'webdriverio';

import webElements = require('../sema_web_elements.json');

/**
 * Clear a given input field (placeholder for WDIO's clearElement)
 * @param  {String}   selector Element selector
 */
export default async (selector: Selector) => {
    /**
     * Parsing string common name to  actual Selector
     * @param selector to be translated
     */
    const parsedSelector = webElements[selector];

    await $(parsedSelector).clearValue();
};
