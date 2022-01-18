@login @parser
Feature: Login with different user roles

    Background: To go github login page
        Given I delete all cookies
        # When I login with user: "admin"
        And   I open the url "https://app-staging.semasoftware.com/login"
        And   I click on the button "signInWithGithubBtn"
        Then  I expect that element "loginInput" becomes displayed

    @C1724
    Scenario: Normal user can be logged in and logged out successfully
        And   I clear the inputfield "loginInput"
        When  I add "qateam+automationadmin@semasoftware.com" to the inputfield "loginInput"
        And   I clear the inputfield "passwordInput"
        And   I add "Automation1Tester2#" to the inputfield "passwordInput"
        And   I click on the button "signinBtn"
        Then  I expect that element "userLogo" becomes displayed
        Then  I expect that the url is "/dashboard"
#    C1730
        When  I click on the element "userLogo"
        Then  I expect that element "signOutBtn" becomes displayed
        When  I click on the element "signOutBtn"
        Then  I expect that element "confirmBtn" becomes displayed
        When  I click on the element "confirmBtn"
        Then  I expect that element "signInWithGithubBtn" becomes displayed


    @skip
    Scenario Outline: Different user roles login successfully        
        And   I clear the inputfield "loginInput"
        When  I add "<user>" to the inputfield "loginInput"
        And   I clear the inputfield "passwordInput"
        And   I add "<password>" to the inputfield "passwordInput"
        And   I click on the button "signinBtn"
        Then  I expect that element "userLogo" becomes displayed


        Examples:
            | user                                      | password            |
            | qateam+automationadmin@semasoftware.com   | Automation1Tester2# |
            | qateam+automationlibrary@semasoftware.com | Automation2Tester3# |
            | qateam+automationacme@semasoftware.com    | Automation3Tester4# |