@webapp @regression
Feature: Web tabs

    Background: Wait for page to be displayed
        When I wait on element "userLogo" for 10000ms to be displayed

    @C1725 @smoke
    Scenario: Navigate throught tab web pages
        When I click on the button "reposTab"
        Then I expect that the url is "/dashboard"
        And  I expect that the title is "Sema Dashboard"

        When I click on the button "personalInsightsTab"
        Then I expect that element "personalInsightsSummariesLbl" becomes displayed
        And  I expect that element "personalInsightsHeader" becomes displayed
        Then I expect that the url is "/personal-insights"
        And  I expect that the title is "Personal Insights"

        When I click on the button "snippetsTab"
        And  I expect that element "collectionArea" becomes displayed
        Then I expect that the url is "/snippets"
        And  I expect that the title is "Snippet Collections"
#
#        When I click on the button "invitationsTab"
#        And  I expect that element "invitesSection" becomes displayed
#        Then I expect that the url is "/invitations"
#        And  I expect that the title is "Invites"

        When I click on the button "supportTab"
        And  I expect that element "supportSection" becomes displayed
        Then I expect that the url is "/support"
        And  I expect that the title is "Help and Support"

#        When I click on the button "labelsManagementTab"
#        And  I pause for 3000ms
#        Then I expect that the url is "/labels-management"
#        And  I expect that the title is "Labels Management"
#        And  I expect that element "labelManagementSection" becomes displayed