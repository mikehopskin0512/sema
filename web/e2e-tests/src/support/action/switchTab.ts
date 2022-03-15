import switchWindow from "webdriverio/build/commands/browser/switchWindow";

/**
 * Set a given cookie to a given value. When the cookies does not exist it will
 * be created
 * @param  {String}   url    Window handle URL to focus on (if no handle was specified
 *                           the command switches to the first available one)
 */
export default async () => {
    // @ts-ignore
    await browser.switchWindow('https://sema.uservoice.com/forums/934797-sema');
};
