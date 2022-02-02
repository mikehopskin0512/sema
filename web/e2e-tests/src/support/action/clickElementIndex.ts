import {Selector} from 'webdriverio';

import checkIfElementExists from '../lib/checkIfElementExists';
// @ts-ignore
import webElements = require('../sema_web_elements.json');

/**
 * Perform an click action on the given element
 * @param  {String}   action  The action to perform (click or doubleClick)
 * @param  {Number}   index   The index of an element on the page
 * @param  {String}   type    Type of the element (link or selector)
 * @param  {String}   selector Element selector
 */
export default async (
    action: 'click' | 'doubleClick',
    index: number,
    type: 'link' | 'selector',
    selector: Selector
) => {
    /**
     * Parsing string common name to  actual Selector
     * @param selector to be translated
     */

    const elements = await $$(selector);

    const parsedSelector = webElements[selector];

    /**
     * Element to perform the action on
     * @type {String}
     */
    const selector2 = (type === 'link') ? `=${parsedSelector}` : parsedSelector;

    /**
     * The method to call on the browser object
     * @type {String}
     */
    const method = (action === 'click') ? 'click' : 'doubleClick';

    await checkIfElementExists(selector2);

    for (let i = 1; i <= elements.length; i++) {
        if (index == i) {
            await $(elements[i])[method]();
            break;
        }
    }
};
