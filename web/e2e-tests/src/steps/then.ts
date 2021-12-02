import { Then } from '@cucumber/cucumber';

import checkTitle from '../support/check/checkTitle';
import checkTitleContains from '../support/check/checkTitleContains';
import checkWithinViewport from '../support/check/checkWithinViewport';
import isExisting from '../support/check/isExisting';
import isVisible from '../support/check/isDisplayed';
import waitForVisible from '../support/action/waitForDisplayed';
import checkIfElementExists from '../support/lib/checkIfElementExists';
import checkURLPath from "../support/check/checkURLPath";
Then(
    /^I expect that the url is( not)* "([^"]*)?"$/,
    checkURLPath
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
    checkIfElementExists
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
    /^I expect that element "([^"]*)?" is( not)* within the viewport$/,
    checkWithinViewport
);

Then(
     /^I expect that element "([^"]*)?" does( not)* exist$/,
    isExisting
);