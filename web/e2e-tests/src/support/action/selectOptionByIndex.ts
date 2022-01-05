import { Selector } from 'webdriverio';

import webElements = require('../sema_web_elements.json');

/**
 * Select a option from a select element by it's index
 * @param  {String}   index      The index of the option
 * @param  {String}   obsolete   The ordinal indicator of the index (unused)
 * @param  {String}   selector Element selector
 *
 * @todo  merge with selectOption
 */
export default async (
    index: string,
    obsolete: never,
    selector: Selector
) => {
    /**
     * Parsing string common name to  actual Selector
     * @param selector to be translated
     */
     const parsedSelector = webElements[selector];

    /**
     * The index of the option to select
     * @type {Int}
     */
    const optionIndex = parseInt(index, 10);

    await $(parsedSelector).selectByIndex(optionIndex);
};
