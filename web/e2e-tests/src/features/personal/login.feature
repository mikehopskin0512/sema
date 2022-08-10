@login @regression
Feature: Login

    @C1724
    Scenario: Normal user can be logged in and logged out successfully                      
        When  I wait on element "userLogo" for 10000ms to be displayed        
        And   I expect that element "userLogo" becomes displayed
        When  I click on the element "userLogo"
        Then  I expect that element "signOutBtn" becomes displayed
        When  I click on the element "signOutBtn"
        Then  I expect that element "confirmBtn" becomes displayed
        And   I click on the element "confirmBtn"        
        Then  I expect that element "signInWithGithubBtn" becomes displayed        


    # Depending of user privilegies, features will be tagged with user 
    # eg @admin, @user1, @user2, etc
    # also this tag user will correspond with user information provided in json file
    # For now this tests can be skipped

    # @skip
    # Scenario Outline: Different user roles login successfully        
    #     And   I clear the inputfield "loginInput"
    #     When  I add "<user>" to the inputfield "loginInput"
    #     And   I clear the inputfield "passwordInput"
    #     And   I add "<password>" to the inputfield "passwordInput"
    #     And   I click on the button "signinBtn"
    #     And   I pause for 5000ms

    #     Examples:
    #         | user                                      | password            |
    #         | qateam+automationadmin@semasoftware.com   | Automation1Tester2# |
    #         | qateam+automationlibrary@semasoftware.com | Automation2Tester3# |
    #         | qateam+automationacme@semasoftware.com    | Automation3Tester4# |