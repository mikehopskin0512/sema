@webapp
Feature: Web tabs should contains all functionality items

    @C1725
    Scenario: Navigate throught tab web pages    
        Then I expect that the url is "/dashboard"
        When I click on the button "reposTab"        
        Then I expect that the url is "/dashboard"
        And  I expect that the title is "Sema23d Dashboard"        

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