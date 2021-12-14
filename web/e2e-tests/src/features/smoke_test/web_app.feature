@webapp
Feature: Web tabs should contains all functionality items

    Scenario: Login successfully
        Given I delete all cookies
        And   I open the url "https://app.semasoftware.com/login"
        And   I click on the button "span=Sign in with GitHub"
        And   I pause for 2000ms
        And   I clear the inputfield "#login_field"
        When  I add "semacodereviewtester1000" to the inputfield "#login_field"
        And   I clear the inputfield "#password"
        And   I add "f1$#Uc7Bvb3x" to the inputfield "#password"        
        And   I click on the button ".js-sign-in-button"
        And   I pause for 5000ms
        Then  I expect that the url is "/dashboard"
        And   I pause for 3000ms

    Scenario: Navigate throught tab web pages
        When  I click on the element "a*=Repos"
        And   I pause for 3000ms
        And   I expect that element ".has-text-black-950" becomes displayed
        Then  I expect that the url is "/dashboard"
        And   I expect that the title is "Sema Dashboard"
        
        
        When  I click on the element "a*=Personal Insights"
        And   I pause for 3000ms
        Then  I expect that the url is "/personal-insights"
        And   I expect that the title is "Personal Insights"
        And   I expect that element ".columns.is-vcentered" does exist

        When I click on the element "a*=Snippets"
        And   I pause for 3000ms
        Then I expect that the url is "/snippets"
        And I expect that the title is "Snippet Collections"        

        When I click on the button "a*=Invitations"
        And I pause for 3000ms
        Then I expect that the url is "/invitations"
        And I expect that the title is "Invites"
        And I expect that element ".invitations_container__2fSJy" does exist

        When I click on the button "a*=Support"
        And I pause for 3000ms
        Then I expect that the url is "/support"
        And I expect that the title is "Help and Support"        