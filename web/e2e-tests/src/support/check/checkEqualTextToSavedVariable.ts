import type { Selector } from 'webdriverio';
// @ts-ignore
import webElements = require('../sema_web_elements.json');
import setInputField from "../action/setInputField";
import {GlobalVars} from "../GlobalVars";
import checkEqualsText from "./checkEqualsText";

// @ts-ignore
/**
 * Check if the given elements text is the same as the given text
 * @param  {String}   elementType   Element type (element or button)
 * @param  {String}   selector      Element selector
 * @param  {String}   falseCase     Whether to check if the content equals the
 *                                  given text or not
 * @param  {String}   expectedText  The text to validate against
 */
export default async (
    elementType: 'element' | 'button',
    selector: Selector,
    falseCase: boolean
) => {
    // @ts-ignore
    checkEqualsText(elementType, selector, falseCase, GlobalVars.globalName)
};
