import type { Selector } from 'webdriverio';
// @ts-ignore
import webElements = require('../sema_web_elements.json');

/**
 * Check if the given elements text is the same as the given text
 * @param  {String}   selector      Elements selector
 * @param  {String}   falseCase     Whether to check if the content equals the
 *                                  given text or not
 * @param  {String}   expectedText  The text to validate against
 */
export default async (
    selector: Selector,
    falseCase: boolean,
    expectedText: string
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
    let parsedExpectedText = expectedText;

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

    const parsedSelector = webElements[selector];
    const elements = await $$(selector);

    if (falseCase) {
        expect(elements).toHaveLength(
            0,
            // @ts-expect-error
            `Expected element "${selector}" not to exist`
        );
    } else {
        expect(elements.length).toBeGreaterThan(
            0,
            // @ts-expect-error
            `Expected element "${selector}" to exist`
        );
    }






    // @ts-ignore
    const text = await $(selector)[command]();

    if (boolFalseCase) {
        expect(parsedExpectedText).not.toBe(text);
    } else {
        expect(parsedExpectedText).toBe(text);
    }
};
