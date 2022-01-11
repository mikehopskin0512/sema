import type { Selector } from 'webdriverio';

import checkIfElementExists from '../lib/checkIfElementExists';
// @ts-ignore
import webElements = require('../sema_web_elements.json');

/**
 * Set the value of the given input field to a new value or add a value to the
 * current selector value
 * @param  {String}   method  The method to use (add or set)
 * @param  {String}   value   The value to set the selector to
 * @param  {String}   selector Element selector
 */
export default async (method: string, value: string, selector: Selector) => {
    /**
     * Parsing string common name to  actual Selector
     * @param selector to be translated
     */
     const parsedSelector = webElements[selector];

    /**
     * The command to perform on the browser object (addValue or setValue)
     * @type {String}
     */
    const command = (method === 'add') ? 'addValue' : 'setValue';

    let checkValue = value;

    await checkIfElementExists(parsedSelector, false, 1);

    if (!value) {
        checkValue = '';
    }

    await $(parsedSelector)[command](checkValue);
};
