import type {Selector} from 'webdriverio';
// @ts-ignore
import webElements = require('../sema_web_elements.json');
import {GlobalVars} from "../GlobalVars";

/**
 * Check if the given elements text is the same as the given text
 * @param  {String}   userEmail        User email
 * @param  {String}   falseCase        Whether to check if the content equals the
 *                                     given text or not
 * @param  {String}   expectedValue    The role of the user
 */
export default async (
    userEmail: Selector,
    falseCase: boolean,
    expectedValue: String
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
    /**
     * Whether to check if the content equals the given text or not
     * @type {Boolean}
     */
    let boolFalseCase = !!falseCase;

// Check for empty element
    if (typeof expectedValue === 'function') {
        expectedValue = '';

        boolFalseCase = !boolFalseCase;
    }

    if (expectedValue === undefined && falseCase === undefined) {
        expectedValue = '';
        boolFalseCase = true;
    }

    const elements = await $$(`//p[normalize-space()='${userEmail}']/../../..//div[contains(@class,'TeamManagement_status__2JVEe ')]//div[@class=' css-1uccc91-singleValue']`);

    for (let i = 0; i < elements.length; i++) {
        // @ts-ignore
        const text = await $(elements[i])[command]();
        if (!boolFalseCase) {
            if (expectedValue === text) {
                expect(expectedValue).toBe(text);
                break;
            }
        } else {
            expect(expectedValue).not.toBe(text);
        }
    }
}
;