import type { Selector } from 'webdriverio';

import checkIfElementExists from '../lib/checkIfElementExists';

/**
 * Get the value of the current selector value
 * @param  {String}   method  The method to use (add or set)
 * @param  {String}   selector Element selector
 */
export default async (method: string, selector: Selector) => {
    /**
     * The command to perform on the browser object (getValue)
     * @type {String}
     */
    const command = (method === 'get') ? 'getValue' : 'getParam';

    let checkValue = value;

    await checkIfElementExists(selector, false, 1);

    if (!value) {
        checkValue = '';
    }

    // await $(selector)[command](checkValue);
};
