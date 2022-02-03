import {Selector} from 'webdriverio';

import checkIfElementExists from '../lib/checkIfElementExists';
// @ts-ignore
import webElements = require('../sema_web_elements.json');

/**
 * Perform an click action on the given element
 * @param  {String}   action  The action to perform (click or doubleClick)
 * @param  {String}   index   The index of an element on the page
 * @param  {String}   obsolete   The ordinal indicator of the index (unused)
 * @param  {String}   type    Type of the element (link or selector)
 * @param  {String}   selector Element selector
 */
export default async (
    action: 'click' | 'doubleClick',
    index: string,
    obsolete: never,
    type: 'link' | 'selector',
    selector: Selector
) => {
    /**
     * Parsing string common name to  actual Selector
     * @param selector to be translated
     */

    const parsedSelector = webElements[selector];

    /**
     * Element to perform the action on
     * @type {String}
     */
    const selector2 = (type === 'link') ? `=${parsedSelector}` : parsedSelector;
    await checkIfElementExists(selector2);

    const method = (action === 'click') ? 'click' : 'doubleClick';
    const optionIndex = parseInt(index, 10)-1;
    const element = await $$(parsedSelector)[optionIndex];
    // @ts-ignore
    await element[method]();
};
