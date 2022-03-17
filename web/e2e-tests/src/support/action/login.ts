import { Selector } from "webdriverio";
import clearInputField from "./clearInputField";
import clickElement from "./clickElement";
import openWebsite from "./openWebsite";
import setInputField from "./setInputField";
import pause from "./pause";

/**
 * Login using using a user role 
 * @param  {String}   user The user to login
 */
 export default async (user: string) => {
    /**
     * The URL to navigate to
     * @type {String}
     */
    const url: string = "https://app.semasoftware.com/login";
    const loginBtn: Selector = "span=Sign in with GitHub";
    const loginInput: Selector = "#login_field";
    const username = "semacodereviewtester1000";
    const passInput: Selector = "#password";
    const password: string = "f1$#Uc7Bvb3x";
    const signInBtn: Selector = "js-sign-in-button";


    /**
     * The steps to login
     */
    await openWebsite('url', url) 
    await clickElement('click', 'selector', loginBtn); 
    await pause('5000');    
    //await clearInputField(loginInput); 
    await setInputField('set', username, loginInput);
    //await clearInputField(passInput); 
    await setInputField('set', password, passInput);
    await clickElement('click', 'selector', signInBtn);
};
