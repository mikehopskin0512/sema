@dashboard @regression
Feature: Dashboard options

    Background: Starting test from dashboard page
        When I open the site "/dashboard"
        And  I pause for 3000ms

    @PTA25_2 @smoke
    Scenario: User profile elements are displayed for company account
        Then I expect that element "companyDropdown" becomes displayed
        When I click on the element "companyDropdown"
        Then I expect that element "semaCorporateOrganizationLogo" becomes displayed
        When I hover over element "semaCorporateOrganizationLogo"
        And  I pause for 1000ms
        When I click on the element "highlightedTeam"
        Then I expect that element "userLogo" becomes displayed
        And  I expect that element "userLogo" does appear exactly "1" times
        And  I pause for 1000ms
        When I click on the element "userLogo"

        And  I expect that element "accountBtn" becomes displayed
        And  I expect that element "accountBtn" does appear exactly "1" times
        And  I expect that element "signOutBtn" becomes displayed
        And  I expect that element "recommendAFriendBtn" becomes displayed
        And  I expect that element "adminPanelBtn" becomes displayed