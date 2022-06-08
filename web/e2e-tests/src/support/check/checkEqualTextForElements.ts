import type {Selector} from 'webdriverio';
// @ts-ignore
import webElements = require('../sema_web_elements.json');
import {GlobalVars} from "../GlobalVars";

/**
 * Check if the given elements text is the same as the given text
 * @param  {String}   selector      Elements selector
 * @param  {String}   falseCase     Whether to check if the content equals the
 *                                  given text or not
 * @param  {String}   state         The state of the collection
 */
export default async (
    selector: Selector,
    falseCase: boolean,
    state: boolean
) => {
    /**
     * The command to execute on the browser object
     * @type {String}
     */
    let command = 'getText';

    /**
     * The expected text to validate against
     * @type {String}
     */
    let parsedExpectedText = GlobalVars.globalName;

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

    const elements = await $$(selector);

    for (let i = 0; i < elements.length; i++) {
        // @ts-ignore
        const text = await $(elements[i])[command]();
        if (!boolFalseCase) {
            if (parsedExpectedText === text) {
                expect(parsedExpectedText).toBe(text);
                break;
            }
        } else {
            expect(parsedExpectedText).not.toBe(text);
        }
    }
}
;