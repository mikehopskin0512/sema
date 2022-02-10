import { Selector } from 'webdriverio';

import checkIfElementExists from '../lib/checkIfElementExists';
// @ts-ignore
import webElements = require('../sema_web_elements.json');

/**
 * Perform an click action on the given element
 * @param  {String}   action  The action to perform (click or doubleClick)
 * @param  {String}   type    Type of the element (link or selector)
 * @param  {String}   selector Element selector
 */
export default async (
    action: 'click' | 'doubleClick',
    type: 'link' | 'selector',
    selector: Selector
) => {

    /**
     * Parsing string common name to  actual Selector
     * @param selector to be translated
     */

    const parsedSelector = webElements[selector];
    const isDisplayed = await $(parsedSelector).isDisplayed();

    if (isDisplayed) {
        /**
         * Parsing string common name to  actual Selector
         * @param selector to be translated
         */
        await browser.pause(2000);
        const selector2 = (type === 'link') ? `=${parsedSelector}` : parsedSelector;
        const method = (action === 'click') ? 'click' : 'doubleClick';
        await $(selector2)[method]();
    }
};
