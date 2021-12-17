@snippets
Feature: User is able to interact with snippets properly 
    @snip
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

    @C1704  @snip
    Scenario: Snippets can be turned on and turned off
        When  I click on the element "a*=Snippets"
        Then  I expect that element ".suggestedComments_container__1QSzG.my-40" does exist
        When  I click on the element "//div[contains(@class,'is-clickable')][1]//input[not(@checked)]"
#        And   I save the name of collection     #here check name from global variable
        And   I pause for 3000ms
#        Then  I expect that collection is enabled    #here check name from global variable

        When  I click on the element "//div[contains(@class,'is-clickable')][1]//input[@checked]"
#        And   I save the name of collection      #here check name from global variable
        And   I pause for 3000ms
#        Then  I expect that collection is disabled    #here check name from global variable

    @C2797  @snip
    Scenario: Adding new snippet to collection
        When  I click on the element "a*=Snippets"
        Then  I pause for 3000ms
        And   I click on the element "div=New Snippet"
        And   I pause for 3000ms
        When  I add "Test Snippet" to the inputfield "//label[text()='Title']/following-sibling::input"
        And   I add "Body text test" to the inputfield "//label[text()='Body']/following-sibling::textarea"
        And   I set "Source name test" to the inputfield "//label[text()='Source Name']/following-sibling::input"
        And   I set "Source Link test" to the inputfield "//label[text()='Source Link']/following-sibling::input"
        And   I click on the button "span=Save New Snippet"
        And   I pause for 3000ms
#        Then  I expect that new snippet is added       #here check name from global variable

    @C1706  @snip
    Scenario: Search for existing snippet works
        When  I click on the element "a*=Snippets"
        And   I pause for 3000ms
        And   I click on the element "p=My Snippets"
        And   I pause for 3000ms
#        Then  I set "Test Snippet" to the inputfield "[placeholder='Search snippets']"
        And   I pause for 3000ms
        Then  I expect that element "p=Test Snippet" becomes displayed