import {Selector} from "webdriverio";
// @ts-ignore
import webElements = require('../sema_web_elements.json');

/**
 * @param  {String}   selector Element selector
 */
export default async (selector: Selector) => {
    const parsedSelector = webElements[selector];
    await $(parsedSelector).moveTo();
};
