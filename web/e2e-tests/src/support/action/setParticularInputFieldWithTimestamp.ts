import type { Selector } from 'webdriverio';

import checkIfElementExists from '../lib/checkIfElementExists';
// @ts-ignore
import webElements = require('../sema_web_elements.json');
import {GlobalVars} from "../GlobalVars";

/**
 * Set the value of the given input field to a new value or add a value to the
 * current selector value
 * @param  {String}   method        The method to use (add or set)
 * @param  {String}   value         The value to set the selector to
 * @param  {String}   index         Sequence number of element on the page
 * @param  {String}   numeral       Numeral meaning
 * @param  {String}   selector      Element selector
 */
export default async (method: string, value: string, index: string, numeral:string, selector: Selector) => {
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

    let checkValue = value + Date.now();
    GlobalVars.globalArray.push(checkValue.toString());

    // @ts-ignore
    const optionIndex = parseInt(index, 10)-1;

    await checkIfElementExists(parsedSelector);

    if (!value) {
        checkValue = '';
    }
    const element = await $$(parsedSelector)[optionIndex];
    // @ts-ignore
    await element[command](checkValue);
};
