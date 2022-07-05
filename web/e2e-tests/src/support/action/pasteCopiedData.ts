/**
 * Set a given cookie to a given value. When the cookies does not exist it will
 * be created
 */
export default async () => {
    // @ts-ignore

    await browser.keys('F6');
    await browser.pause(5000);
    await browser.keys('["Control", "v"]');
};
