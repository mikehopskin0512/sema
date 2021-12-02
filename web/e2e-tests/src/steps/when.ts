import {Given, When} from '@cucumber/cucumber';

import clearInputField from '../support/action/clearInputField';
import clickElement from '../support/action/clickElement';
import deleteCookies from '../support/action/deleteCookies';
import dragElement from '../support/action/dragElement';
import focusFrame from '../support/action/focusFrame';
import pause from '../support/action/pause';
import pressButton from '../support/action/pressButton';
import setCookie from '../support/action/setCookie';
import setInputField from '../support/action/setInputField';
import openWebsite from "../support/action/openWebsite";

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