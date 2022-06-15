import type { Selector } from 'webdriverio';
// @ts-ignore
import webElements = require('../sema_web_elements.json');
import {GlobalVars} from "../GlobalVars";

// @ts-ignore
/**
 * Check if the given elements text is the same as the given text
 * @param  {String}   elementType       Element type (element or button)
 * @param  {String}   selector          Element selector
 * @param  {String}   falseCase         Whether to check if the content equals the
 *                                      given text or not
 * @param  {String}   additionalText    Additional text for check with saved one
 */
export default async (
    elementType: 'element' | 'button',
    selector: Selector,
    falseCase: boolean,
    additionalText?: String
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
    let parsedExpectedText = GlobalVars.globalName;
    console.log(additionalText)
    if (additionalText)
    {
        parsedExpectedText = parsedExpectedText+additionalText;
    }
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
