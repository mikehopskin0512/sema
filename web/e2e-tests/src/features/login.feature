Feature: To create a new customer

    @zicu  @C1724
    Scenario: To login into SEMA software
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
#
#    @zicu
#    Scenario Outline: To login with different roles
#        Given I delete all cookies
#        When  I open the url "https://app.semasoftware.com/login"
#        And   I click on the button "span=Sign in with GitHub"
#        And   I pause for 5000ms
#        And   I clear the inputfield "#login_field"
#        When  I add "<user>" to the inputfield "#login_field"
#        And   I clear the inputfield "#password"
#        And   I add "<password>" to the inputfield "#password"
#        And   I click on the button ".js-sign-in-button"
#        Then  I expect that the url is "/dashboard"
#
#        Examples:
#            | user                                      | password            |
#            | qateam+automationacme@semasoftware.com    | Automation3Tester4# |
#            | qateam+automationlibrary@semasoftware.com | Automation2Tester3# |
#            | qateam+automationadmin@semasoftware.com   | Automation1Tester2# |

