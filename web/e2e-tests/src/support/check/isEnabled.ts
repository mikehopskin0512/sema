import type { Selector } from 'webdriverio';
// @ts-ignore
import webElements = require('../sema_web_elements.json');

/**
 * Check if the given selector is enabled
 * @param  {String}   selector   Element selector
 * @param  {String}   falseCase Whether to check if the given selector
 *                              is enabled or not
 */
export default async (selector: Selector, falseCase: boolean) => {
    /**
     * The enabled state of the given selector
     * @type {Boolean}
     */
    const parsedSelector = webElements[selector];
    const isEnabled = await $(parsedSelector).isEnabled();
    if (falseCase) {
        expect(isEnabled).not.toEqual(
            true,
            // @ts-expect-error
            `Expected element "${selector}" not to be enabled`
        );
    } else {
        expect(isEnabled).toEqual(
            true,
            // @ts-expect-error
            `Expected element "${selector}" to be enabled`
        );
    }
};
