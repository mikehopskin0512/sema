Feature: To navigate tab menus

    Background:
        Given I delete all cookies
        When  I open the url "https://app.semasoftware.com/login"
        And   I click on the button "span=Sign in with GitHub"
        And   I pause for 4000ms
        And   I clear the inputfield "#login_field"
        And   I add "zicur" to the inputfield "#login_field"
        And   I clear the inputfield "#password"
        And   I add "7NOkSbk)19" to the inputfield "#password"
        And   I click on the button ".js-sign-in-button"
        And   I pause for 3000ms

    @andriy  @C1725  @repo
    Scenario: Navigate to Repos menu
        When I click on the button ".navbar-menu a[href='/'].has-text-black-950"
        And I pause for 3000ms
        Then I expect that the url is "/dashboard"
        And I expect that the title is "Sema Dashboard"
        And I expect that element ".has-text-black-950" is displayed

    @andriy  @C1725  @insights
    Scenario: Navigate to Personal Insights menu
        When I click on the button ".navbar-menu a[href='/personal-insights'].has-text-black-950"
        And I pause for 3000ms
        Then I expect that the url is "/personal-insights"
        And I expect that the title is "Personal Insights"
        And I expect that element ".columns.is-vcentered" does exist

    @andriy  @C1725  @snippets_1
    Scenario: Navigate to Suggested Snippets menu
        When I click on the button ".navbar-menu a[href='/snippets'].has-text-black-950"
        And I pause for 3000ms
        Then I expect that the url is "/snippets"
        And I expect that the title is "Snippet Collections"
        #And I expect that element ".suggestedComments_container__1QSzG.my-40" does exist

    @andriy  @C1725  @invites
    Scenario: Navigate to Invitations menu
        When I click on the button ".navbar-menu a[href='/invitations'].has-text-black-950"
        And I pause for 3000ms
        Then I expect that the url is "/invitations"
        And I expect that the title is "Invites"
        And I expect that element ".invitations_container__2fSJy" does exist

    @andriy  @C1725  @support
    Scenario: Navigate to Support menu
        When I click on the button ".navbar-menu a[href='/support'].has-text-black-950"
        And I pause for 3000ms
        Then I expect that the url is "/support"
        And I expect that the title is "Help and Support"
        And I expect that element ".support_animation-container__3HyJ8" does exist