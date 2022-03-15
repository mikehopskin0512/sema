import type { Selector } from 'webdriverio';
// @ts-ignore
import webElements = require('../sema_web_elements.json');
/**
 * Check if the given selector is enabled
 * @param  {String}   expectedValue The value to match against
 * @param  {String}   falseCase Whether to check if the given selector
 *                              should match the expected value
 * @param  {String}   selector   Element selector
 */
export default async (expectedValue: string, falseCase: boolean, selector: Selector) => {

    /**
     * The text of the element
     * @type {String}
     */

    const parsedSelector = webElements[selector];
    const text = await $(parsedSelector).getValue();

    if (falseCase) {
        expect(text).not.toEqual(
            expectedValue,
            // @ts-expect-error
            `Expected drop down option "${expectedValue}" is not equal to "${text}"`
        );
    } else {
        expect(text).toEqual(
            expectedValue,
            // @ts-expect-error
            `Expected drop down option "${expectedValue}" is equal to "${text}"`
        );
    }
};