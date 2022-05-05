import {GlobalVars} from "../GlobalVars";

/**
 * Check if the current URL path matches the given path
 * @param  {String}   falseCase    Whether to check if the path matches the
 *                                 expected value or not
 */
export default async (falseCase: boolean) => {
    /**
     * The URL of the current browser window
     * @type {String}
     */
    let currentUrl = (await browser.getUrl()).replace(/http(s?):\/\//, '');

    /**
     * The base URL of the current browser window
     * @type {Object}
     */
    const domain = `${currentUrl.split('/')[0]}`;

    currentUrl = currentUrl.replace(domain, '');
    let expectedPath = "/teams/"+GlobalVars.globalName+"/dashboard";
    if (falseCase) {
        expect(currentUrl)
            // @ts-expect-error
            .not.toEqual(expectedPath, `expected path not to be "${currentUrl}"`);
    } else {
        expect(currentUrl).toEqual(
            expectedPath,
            // @ts-expect-error
            `expected path to be "${expectedPath}" but found `
            + `"${currentUrl}"`
        );
    }
};
