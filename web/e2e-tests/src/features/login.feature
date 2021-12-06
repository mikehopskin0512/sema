@login
Feature: Login with different user roles

    @zicu  @C1724
    Scenario: Normal user can be logged successfully
        Given I delete all cookies
        When  I open the url "https://app.semasoftware.com/login"
        And   I click on the button "span=Sign in with GitHub"
        And   I pause for 5000ms
        And   I clear the inputfield "#login_field"
        When  I add "andriy@semasoftware.com" to the inputfield "#login_field"
        And   I clear the inputfield "#password"
        And   I add "semasoftware1" to the inputfield "#password"
        And   I click on the button ".js-sign-in-button"
        Then  I expect that the url is "/dashboard"

    Scenario Outline: Different user roles login successfully
        Given I delete all cookies
        When  I open the url "https://app.semasoftware.com/login"
        And   I click on the button "span=Sign in with GitHub"
        And   I pause for 5000ms
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

    Scenario Outline: To test interaction btw Behave Pro and Github

        Given I delete all cookies
        When  I open the url "https://app.semasoftware.com/login"
        And   I click on the button "span=Sign in with GitHub"
        And   I pause for 5000ms
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