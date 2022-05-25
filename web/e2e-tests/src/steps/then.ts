import { Then } from '@cucumber/cucumber';

import checkTitle from '../support/check/checkTitle';
import checkTitleContains from '../support/check/checkTitleContains';
import isExisting from '../support/check/isExisting';
import isVisible from '../support/check/isDisplayed';
import waitForVisible from '../support/action/waitForDisplayed';
import checkURLPath from "../support/check/checkURLPath";
import checkEqualsText from '../support/check/checkEqualsText';
import checkContainsAnyText from '../support/check/checkContainsAnyText';
import checkIsEmpty from '../support/check/checkIsEmpty';
import checkProperty from '../support/check/checkProperty';
import checkFontProperty from '../support/check/checkFontProperty';
import waitFor from '../support/action/waitFor';
import checkNumberOfElementsExists from "../support/lib/checkNumberOfElementsExists";
import checkEqualTextForElements from "../support/check/checkEqualTextForElements";
import isEnabled from "../support/check/isEnabled";
import checkAbsoluteURLPath from "../support/check/checkAbsoluteURLPath";
import checkSelectedDropDownOption from '../support/check/checkSelectedDropDownOption';
import checkTeamURLPath from "../support/check/checkTeamURLPath";
import checkRoleForUser from "../support/check/checkRoleForUser";
import checkEqualTextToSavedVariable from "../support/check/checkEqualTextToSavedVariable";
import checkSearchedResults from "../support/check/checkSearchedResults";
Then(
    /^I expect that the url is( not)* "([^"]*)?"$/,
    checkURLPath
);

Then(
    /^I expect that the team url is( not)* correct$/,
    checkTeamURLPath
);

Then(
    /^I expect that the absolute url is( not)* "([^"]*)?"$/,
    checkAbsoluteURLPath
);

Then(
    /^I expect that the title is( not)* "([^"]*)?"$/,
    checkTitle
);

Then(
    /^I expect that the title( not)* contains "([^"]*)?"$/,
    checkTitleContains
);

Then(
    /^I expect that element "([^"]*)?" does( not)* appear exactly "([^"]*)?" times$/,
    checkNumberOfElementsExists
);

Then(
    /^I expect that element "([^"]*)?" is( not)* displayed$/,
    isVisible
);

Then(
    /^I expect that element "([^"]*)?" becomes( not)* displayed$/,
    waitForVisible
);


Then(
    /^I expect (\d+)(st|nd|rd|th) created label (button|element) "([^"]*)?" becomes( not)* displayed$/,
    // @ts-ignore
    checkSearchedResults
);

Then(
     /^I expect that element "([^"]*)?" does( not)* exist$/,
    isExisting
);

Then(
    /^I expect that (button|element) "([^"]*)?"( not)* matches the text "([^"]*)?"$/,
    checkEqualsText
);

Then(
    /^I expect that (button|element) "([^"]*)?"( not)* matches the saved variable$/,
    checkEqualTextToSavedVariable
);

Then(
    /^I expect that (button|element) "([^"]*)?"( not)* contains any text$/,
    checkContainsAnyText
);

Then(
    /^I expect that (button|element) "([^"]*)?" is( not)* empty$/,
    checkIsEmpty
);

Then(
    /^I expect that the( css)* attribute "([^"]*)?" from element "([^"]*)?" is( not)* "([^"]*)?"$/,
    checkProperty
);

Then(
    /^I expect that the font( css)* attribute "([^"]*)?" from element "([^"]*)?" is( not)* "([^"]*)?"$/,
    checkFontProperty
);

Then(
    /^I expect that checkbox "([^"]*)?" is( not)* checked$/,
    isEnabled
);

Then(
    /^I expect that option "([^"]*)?" is( not)* selected in the dropdown "([^"]*)?"$/,
    checkSelectedDropDownOption
);

Then(
    /^I wait on element "([^"]*)?"(?: for (\d+)ms)*(?: to( not)* (be checked|be enabled|be selected|be displayed|contain a text|contain a value|exist))*$/,
    {
        wrapperOptions: {
            retry: 3,
        },
    },
    waitFor
);

Then(
    /^I expect that selected collection element "([^"]*)?" is( not)* (enabled|disabled)$/,
    checkEqualTextForElements
)
Then(
    /^I expect that new item "([^"]*)?" is( not)* added to (snippets|collections|portfolios)$/,
    checkEqualTextForElements
)


Then(
    /^I expect that the role for user "([^"]*)?" is( not)* updated to "([^"]*)?"$/,
    checkRoleForUser
)
