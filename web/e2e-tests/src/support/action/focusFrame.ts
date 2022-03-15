import { Selector } from 'webdriverio';

import checkIfElementExists from '../lib/checkIfElementExists';

/**
 * Focus in specific iFrame
 * @param  {String}   selector Element identifier, can be and integer
 */
export default async (    
    index: any
) => {
    console.log('THE NUMBER:', index)
    await browser.switchToFrame(index);     
};
