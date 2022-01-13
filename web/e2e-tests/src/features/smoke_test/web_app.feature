@webapp
Feature: Web tabs should contains all functionality items

#    Background:
#        Given I delete all cookies
#        And   I open the url "https://app-staging.semasoftware.com/login"
#        And   I click on the button "signInWithGithubBtn"
#        And   I pause for 2000ms
#        And   I clear the inputfield "loginInput"
#        When  I add "qateam+automationadmin@semasoftware.com" to the inputfield "loginInput"
#        And   I clear the inputfield "passwordInput"
#        And   I add "Automation1Tester2#" to the inputfield "passwordInput"
#        And   I click on the button "signinBtn"
#        And   I pause for 5000ms
#        Then  I expect that the url is "/dashboard"
#        And   I pause for 3000ms

    Scenario: Login successfully
        Given I delete all cookies
        And   I open the url "https://app-staging.semasoftware.com/login"
        And   I click on the button "signInWithGithubBtn"
        And   I pause for 2000ms
        And   I clear the inputfield "loginInput"
        When  I add "qateam+automationadmin@semasoftware.com" to the inputfield "loginInput"
        And   I clear the inputfield "passwordInput"
        And   I add "Automation1Tester2#" to the inputfield "passwordInput"
        And   I click on the button "signinBtn"
        And   I pause for 5000ms
        Then  I expect that the url is "/dashboard"
        And   I pause for 3000ms

    @C1725
    Scenario: Navigate throught tab web pages
        When I click on the button "reposTab"
        And  I pause for 3000ms
        Then I expect that the url is "/dashboard"
        And  I expect that the title is "Sema Dashboard"
#        And  I expect that element "reposContainer" becomes displayed

        When I click on the button "personalInsightsTab"
        And  I pause for 3000ms
        Then I expect that the url is "/personal-insights"
        And  I expect that the title is "Personal Insights"
        And  I expect that element "personalInsightsHeader" becomes displayed

        When I click on the button "snippetsTab"
        And  I pause for 3000ms
        Then I expect that the url is "/snippets"
        And  I expect that the title is "Snippet Collections"
        And  I expect that element "collectionArea" becomes displayed

        When I click on the button "invitationsTab"
        And  I pause for 3000ms
        Then I expect that the url is "/invitations"
        And  I expect that the title is "Invites"
        And  I expect that element "invitesSection" becomes displayed

        When I click on the button "supportTab"
        And  I pause for 3000ms
        Then I expect that the url is "/support"
        And  I expect that the title is "Help and Support"
        And  I expect that element "supportSection" becomes displayed

#        When I click on the button "labelsManagementTab"
#        And  I pause for 3000ms
#        Then I expect that the url is "/labels-management"
#        And  I expect that the title is "Labels Management"
#        And  I expect that element "labelManagementSection" becomes displayed