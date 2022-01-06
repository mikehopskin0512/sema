import {Given, When} from '@cucumber/cucumber';

import clearInputField from '../support/action/clearInputField';
import clickElement from '../support/action/clickElement';
import deleteCookies from '../support/action/deleteCookies';
import dragElement from '../support/action/dragElement';
import focusFrame from '../support/action/focusFrame';
import pause from '../support/action/pause';
import pressButton from '../support/action/pressButton';
import scroll from '../support/action/scroll';
import setCookie from '../support/action/setCookie';
import setInputField from '../support/action/setInputField';
import openWebsite from "../support/action/openWebsite";
import handleModal from '../support/action/handleModal';
import selectOptionByIndex from '../support/action/selectOptionByIndex';
import selectOption from '../support/action/selectOption';
import login from '../support/action/login';
import {getElement} from "webdriverio/build/utils/getElementObject";
import getElementText from '../support/action/getElementText';

/**
 * Abstracting some steps by functionality. 
 * e.g login through github
 *  */ 
 When(
    /^I login with user: "([^"]*)?"$/,
    login
);

When(
    /^I open the (url|site) "([^"]*)?"$/,
    openWebsite
);

When(
    /^I focus on "(\d+)" iFrame$/,
    focusFrame
);

When(
    /^I (click|doubleclick) on the (link|button|element) "([^"]*)?"$/,
    clickElement
);

// When(
//    /^I save the name of collection$/,
//
// );

When(
    /^I (add|set) "([^"]*)?" to the inputfield "([^"]*)?"$/,
    setInputField
);

When(
    /^I clear the inputfield "([^"]*)?"$/,
    clearInputField
);

When(
    /^I drag element "([^"]*)?" to element "([^"]*)?"$/,
    dragElement
);

When(
    /^I pause for (\d+)ms$/,
    pause
);

When(
    /^I set a cookie "([^"]*)?" with the content "([^"]*)?"$/,
    setCookie
);

When(
    /^I delete the cookie "([^"]*)?"$/,
    deleteCookies
);

When(
    /^I press "([^"]*)?"$/,
    pressButton
);

When(
    /^I (accept|dismiss) the (alertbox|confirmbox|prompt)$/,
    handleModal
);

When(
    /^I scroll to element "([^"]*)?"$/,
    scroll
);

When(
    /^I select the (\d+)(st|nd|rd|th) option for element "([^"]*)?"$/,
    // @ts-ignore
    selectOptionByIndex
);

When(
    /^I select the option with the (name|value|text) "([^"]*)?" for element "([^"]*)?"$/,
    selectOption
);

When(
    /^I save the name of collection "([^"]*)?"$/,
    getElementText
)