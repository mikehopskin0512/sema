import { Selector } from 'webdriverio';
// @ts-ignore
import webElements = require('../sema_web_elements.json');

/**
 * Drag a element to a given destination
 * @param  {String}   selector      The selector for the source element
 * @param  {String}   destination The selector for the destination element
 */
export default async (selector: Selector, destination: Selector) => {
    /**
     * Parsing string common name to  actual Selector
     * @param selector to be translated
     */
    const parsedSelector = webElements[selector];

    const target = await $(destination);
    await $(parsedSelector).dragAndDrop(target);
};
