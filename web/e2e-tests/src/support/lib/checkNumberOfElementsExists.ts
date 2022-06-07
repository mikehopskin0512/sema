import { Selector } from 'webdriverio';
// @ts-ignore
import webElements = require('../sema_web_elements.json');
/**
 * Check if the given element exists in the DOM one or more times
 * @param  {String}  selector  Element selector
 * @param  {Boolean} falseCase Check if the element (does not) exists
 * @param  {Number}  exactly   Check if the element exists exactly this number
 *                             of times
 */
export default async (
    selector: Selector,
    falseCase?: boolean,
    exactly?: number
) => {

    /**
     * The number of elements found in the DOM
     * @type {Int}
     */
        // @ts-ignore
    const parsedSelector = webElements[selector];
    const webElementsArr = await $$(parsedSelector);
    // @ts-ignore
    const exactlyInt = parseInt(exactly);

    if (falseCase === true) {
        expect(webElementsArr.length).toEqual(
            0,
            // @ts-expect-error
            `Elements with selector "${selector}" should not exist on the page`
        );
    } else if (exactly) {
        expect(webElementsArr.length).toEqual(
            exactlyInt,
            // @ts-expect-error
            `Element with selector "${selector}" should exist exactly ${exactly} time(s)`
        );
    }
};
