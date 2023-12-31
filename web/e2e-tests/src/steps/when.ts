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
import getElementText from '../support/action/getElementText';
import setInputFieldWithTimestamp from "../support/action/setInputFieldWithTimestamp";
import setGlobalParamIntoSearchField from "../support/action/setGlobalParamIntoSearchField";
import clickElementByIndex from "../support/action/clickElementByIndex";
import switchTab from '../support/action/switchTab';
import changeTheUserRoleForTheOrganization from "../support/action/changeTheUserRoleForTheOrganization";
import setParticularInputFieldWithTimestamp from "../support/action/setParticularInputFieldWithTimestamp";
import setGlobalArrayByIndexToInputField from "../support/action/setGlobalArrayByIndexToInputField";
import removeElementsWhileExist from '../support/action/removeElementsWhileExist';
import clickElementIfDisplayed from "../support/action/clickElementIfDisplayed";
import refreshThePage from "../support/action/refreshThePage";
import hoverOverElement from '../support/action/hoverOverElement';
import pasteCopiedData from '../support/action/pasteCopiedData';

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

When(
    /^I (click|doubleclick) on the (link|button|element) "([^"]*)?" if visible$/,
    clickElementIfDisplayed
);

When(
    /^I (click|doubleclick) on the "(\d+)(st|nd|rd|th)" (link|button|element) "([^"]*)?"$/,
// @ts-ignore
    clickElementByIndex
);

When(
    /^I (add|set) (\d+)(st|nd|rd|th) created label name to the inputfield "([^"]*)?"$/,
// @ts-ignore
    setGlobalArrayByIndexToInputField
);

When(
    /^I (add|set) "([^"]*)?" to the inputfield "([^"]*)?"$/,
    setInputField
);

When(
    /^I (add|set) "([^"]*)?" with timestamp to the ([^"]*)?(st|nd|rd|th) inputfield "([^"]*)?"$/,
    setParticularInputFieldWithTimestamp
);

When(
    /^I (add|set) "([^"]*)?" with timestamp to the inputfield "([^"]*)?"$/,
    setInputFieldWithTimestamp
);

When(
    /^I set saved variable to the inputfield "([^"]*)?"$/,
    setGlobalParamIntoSearchField
);

When(
    /^I search created snippet "([^"]*)?"/,
    setGlobalParamIntoSearchField
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
    /^I save the text of element "([^"]*)?"$/,
    getElementText
)

When(
    /^I switch to opened tab "([^"]*)?"$/,
    switchTab
)

When(
    /^I change the role for "([^"]*)?" to "([^"]*)?"$/,
    changeTheUserRoleForTheOrganization
)

When(
    /^I remove all elements "([^"]*)?" with button "([^"]*)?" under "([^"]*)?" with confirmation "([^"]*)?" till "([^"]*)?"$/,
    removeElementsWhileExist
)

When(
    /^I refresh the page$/,
    refreshThePage
)

When(
    /^I hover over element "([^"]*)?"$/,
    hoverOverElement
)

When(
    /^I paste copied to clipboard value into url$/,
    pasteCopiedData
)