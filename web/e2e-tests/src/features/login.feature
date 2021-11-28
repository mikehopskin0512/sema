Feature: To create a new customer

    @zicu
    Scenario: To login into SEMA software
        Given I delete all cookies
        When  I open the url "https://app.semasoftware.com/login"
        And   I click on the button "span=Sign in with GitHub"
        And   I pause for 5000ms
        And   I clear the inputfield "#login_field"
        When  I add "******" to the inputfield "#login_field"
        And   I clear the inputfield "#password"
        And   I add "***" to the inputfield "#password"
        And   I click on the button ".js-sign-in-button"
        Then I expect that the url is "https://github.com/sessions/verified-device"
        And   I pause for 5000ms

    @zicu
    Scenario Outline: To login with different roles
        Given I delete all cookies
        When  I open the url "https://app.semasoftware.com/login"
        And   I click on the button "span=Sign in with GitHub"
        And   I pause for 5000ms
        And   I clear the inputfield "#login_field"
        When  I add "<user>" to the inputfield "#login_field"
        And   I clear the inputfield "#password"
        And   I add "<password>" to the inputfield "#password"
        And   I click on the button ".js-sign-in-button"
        Then I expect that the url is "https://github.com/sessions/verified-device"
        And   I pause for 5000ms

        Examples:
            | user | password |
            | **** | ***      |
            | **** | ***      |
            | **** | ***      |

