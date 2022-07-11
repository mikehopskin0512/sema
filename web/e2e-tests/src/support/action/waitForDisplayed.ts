import type { Selector } from 'webdriverio';

// @ts-ignore
import webElements = require('../sema_web_elements.json');

/**
 * Wait for the given element to become visible
 * @param  {String}   selector      Element selector
 * @param  {String}   falseCase     Whether or not to expect a visible or hidden state
 *
 * @todo  merge with waitfor
 */
export default async (selector: Selector, falseCase: any) => {
    /**
     * Maximum number of milliseconds to wait for
     * @type {Int}
     */
    const ms = 60000;
    // todo  change back to 10000 (temporary)

    /**
     * Parsing string common name to  actual Selector
     * @param selector to be translated
     */
     const parsedSelector = webElements[selector];

    await $(parsedSelector).waitForDisplayed({
        timeout: ms,
        reverse: Boolean(falseCase),
    });
};
