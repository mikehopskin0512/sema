import type { Selector } from 'webdriverio';
// @ts-ignore
import webElements = require('../sema_web_elements.json');
import {GlobalVars} from "../GlobalVars";

/**
 * Check if the given elements text is the same as the given text
 * @param  {String}   index                     The index of an element on the page
 * @param  {String}   obsolete                  The ordinal indicator of the index (unused)
 * @param  {String}   elementType               Element type (element or button)
 * @param  {String}   selector                  Element selector
 * @param  {String}   falseCase                 Whether to check if the content equals the
 *                                              given text or not
 */
export default async (
    index: string,
    obsolete: never,
    elementType: 'element' | 'button',
    selector: Selector,
    falseCase: boolean,
) => {
        /**
         * The command to execute on the browser object
         * @type {String}
         */
        let command: 'getText' | 'getValue' = 'getValue';
        const parsedSelector = webElements[selector];
        if (
            elementType === 'button'
            || (await $(parsedSelector).getAttribute('value')) === null
        ) {
                command = 'getText';
        }


        /**
         * The expected text to validate against
         * @type {String}
         */
            // @ts-ignore
        let parsedExpectedText = GlobalVars.globalArray[index-1];
        /**
         * Whether to check if the content equals the given text or not
         * @type {Boolean}
         */
        let boolFalseCase = !!falseCase;
        // Check for empty element

        if (typeof parsedExpectedText === 'function') {
                parsedExpectedText = '';
                boolFalseCase = !boolFalseCase;
        }
        if (parsedExpectedText === undefined && falseCase === undefined) {
                parsedExpectedText = '';
                boolFalseCase = true;
        }

        const text = await $(parsedSelector)[command]();

        if (boolFalseCase) {
                expect(parsedExpectedText).not.toBe(text);
        } else {
                expect(parsedExpectedText).toBe(text);
        }
};
