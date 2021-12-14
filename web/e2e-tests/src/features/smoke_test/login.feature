@login
Feature: Login with different user roles

    Background: To go github login page
        Given I delete all cookies
        # When I login with user: "admin"
        When  I open the url "https://app.semasoftware.com/login"
        And   I click on the button "span=Sign in with GitHub"
        And   I pause for 2000ms

    @C1724
    Scenario: Normal user can be logged successfully
        And   I clear the inputfield "#login_field"
        When  I add "semacodereviewtester1000" to the inputfield "#login_field"
        And   I clear the inputfield "#password"
        And   I add "f1$#Uc7Bvb3x" to the inputfield "#password"
        And   I click on the button ".js-sign-in-button"
        Then  I expect that the url is "/dashboard"
        And   I pause for 2000ms

    Scenario Outline: Different user roles login successfully        
        And   I clear the inputfield "#login_field"
        When  I add "<user>" to the inputfield "#login_field"
        And   I clear the inputfield "#password"
        And   I add "<password>" to the inputfield "#password"
        And   I click on the button ".js-sign-in-button"
        And   I pause for 5000ms

        Examples:
            | user | password |
            | **** | ***      |
            | **** | ***      |
            | **** | ***      |