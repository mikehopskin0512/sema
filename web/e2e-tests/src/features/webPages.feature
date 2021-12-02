Feature: To create a new customer


    Background:
        Given I delete all cookies
        When  I open the url "https://app.semasoftware.com/login"
        And   I click on the button "span=Sign in with GitHub"
        And   I pause for 5000ms
        And   I clear the inputfield "#login_field"
        And   I add "andriy@semasoftware.com" to the inputfield "#login_field"
        And   I clear the inputfield "#password"
        And   I add "semasoftware1" to the inputfield "#password"
        And   I click on the button ".js-sign-in-button"

    @andriy  @C1725  @Repo
    Scenario: Navigate to Repos menu
        When I click on the button ".navbar-menu a[href='/'].has-text-black-950"
        Then I expect that the url is "/dashboard"
         And I expect that the title is "Sema Dashboard"
         And I expect that element ".has-text-black-950" is displayed

    @andriy  @C1725   @pers
    Scenario: Navigate to Personal Insights menu
        When I click on the button ".navbar-menu a[href='/personal-insights'].has-text-black-950"
        Then I expect that the url is "/personal-insights"
         And I expect that the title is "Personal Insights"
#        And I expect that element "//p[text()='My Repos']" does exist

    @andriy  @C1725
    Scenario: Navigate to Suggested Snippets menu
        When I click on the button ".navbar-menu a[href='/snippets'].has-text-black-950"
        Then I expect that the url is "/snippets"
         And I expect that the title is "Snippet Collections"
#        And I expect that element "//p[text()='My Repos']" does exist

    @andriy  @C1725
    Scenario: Navigate to Invitations menu
        When I click on the button ".navbar-menu a[href='/invitations'].has-text-black-950"
        Then I expect that the url is "/invitations"
         And I expect that the title is "Invites"
#        And I expect that element "//p[text()='My Repos']" does exist

    @andriy  @C1725
    Scenario: Navigate to Support menu
        When I click on the button ".navbar-menu a[href='/support'].has-text-black-950"
        Then I expect that the url is "/support"
         And I expect that the title is "Help and Support"
#        And I expect that element "//p[text()='My Repos']" does exist