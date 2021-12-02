import { Given } from '@cucumber/cucumber';

import checkSelected from '../support/check/checkSelected';
import isEnabled from '../support/check/isEnabled';
import isDisplayed from '../support/check/isDisplayed';
import openWebsite from '../support/action/openWebsite';
import deleteAllcookies from '../support/action/deleteAllcookies';

Given(
    /^I open the (url|site) "([^"]*)?"$/,
    openWebsite
);

Given(
    /^I delete all cookies$/,
    deleteAllcookies
);

Given(
    /^the element "([^"]*)?" is( not)* displayed$/,
    isDisplayed
);

Given(
    /^the element "([^"]*)?" is( not)* enabled$/,
    isEnabled
);

Given(
    /^the element "([^"]*)?" is( not)* selected$/,
    checkSelected
);

Given(
    /^the checkbox "([^"]*)?" is( not)* checked$/,
    checkSelected
);
