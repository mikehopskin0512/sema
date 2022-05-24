import type { Selector } from 'webdriverio';
// @ts-ignore
import webElements = require('../sema_web_elements.json');
import setInputField from "../action/setInputField";
import {GlobalVars} from "../GlobalVars";

// @ts-ignore
/**
 * Check if the given elements text is the same as the given text
 * @param  {String}   method  The method to use (add or set)
 * @param  {String}   index   The index of an element on the page
 * @param  {String}   obsolete   The ordinal indicator of the index (unused)
 * @param  {String}   selector               Element selector
 */
export default async (
    method: string,
    index: string,
    obsolete: never,
    selector: Selector
) => {
        // @ts-ignore
        setInputField(method,GlobalVars.globalArray[index-1],selector);
};
