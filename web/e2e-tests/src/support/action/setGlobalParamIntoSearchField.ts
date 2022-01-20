import type { Selector } from 'webdriverio';

// @ts-ignore
import {GlobalVars} from "../GlobalVars";
import setInputField from "./setInputField";

/**
 * Set the value of the given input field to a new value or add a value to the
 * current selector value
 * @param  {String}   selector  Element selector
 */
export default async (selector: Selector) => {
   // @ts-ignore
    setInputField(GlobalVars.globalName, selector)
};
