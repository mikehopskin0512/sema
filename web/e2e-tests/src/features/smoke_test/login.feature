@login @parser
Feature: Login with different user roles

    Background: To go github login page
        Given I delete all cookies
        # When I login with user: "admin"
        When  I open the url "https://app.semasoftware.com/login"
        And   I click on the button "signInWithGithubBtn"
        And   I pause for 2000ms

    @C1724
    Scenario: Normal user can be logged in and logged out successfully
        And   I clear the inputfield "loginInput"
        When  I add "semacodereviewtester1000" to the inputfield "loginInput"
        And   I clear the inputfield "passwordInput"
        And   I add "f1$#Uc7Bvb3x" to the inputfield "passwordInput"
        And   I click on the button "signinBtn"
#        And   I pause for 10000ms
        Then  I expect that the url is "/dashboard"
        And   I pause for 5000ms
        Then  I expect that element "userLogo" becomes displayed

        When  I click on the element "userLogo"
        Then  I expect that element "signOutBtn" becomes displayed
        When  I click on the element "signOutBtn"
        And   I pause for 2000ms
        When  I click on the element "confirmBtn"
        And   I pause for 2000ms
        Then  I expect that element "signInWithGithubBtn" becomes displayed


    @skip
    Scenario Outline: Different user roles login successfully        
        And   I clear the inputfield "loginInput"
        When  I add "<user>" to the inputfield "loginInput"
        And   I clear the inputfield "passwordInput"
        And   I add "<password>" to the inputfield "passwordInput"
        And   I click on the button "signinBtn"
        And   I pause for 5000ms

        Examples:
            | user | password |
            | **** | ***      |
            | **** | ***      |
            | **** | ***      |