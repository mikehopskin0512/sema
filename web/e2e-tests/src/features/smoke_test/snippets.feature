@snippets
Feature: User is able to interact with snippets properly

    Background:
        Given I delete all cookies
        And   I open the url "https://app.semasoftware.com/login"
        And   I click on the button "signInWithGithubBtn"
        And   I pause for 2000ms
        And   I clear the inputfield "loginInput"
        When  I add "semacodereviewtester1000" to the inputfield "loginInput"
        And   I clear the inputfield "passwordInput"
        And   I add "f1$#Uc7Bvb3x" to the inputfield "passwordInput"
        And   I click on the button "signinBtn"
        And   I pause for 5000ms
        Then  I expect that the url is "/dashboard"
        And   I pause for 3000ms

    @snip
    Scenario: Login successfully
        Given I delete all cookies
        And   I open the url "https://app.semasoftware.com/login"
        And   I click on the button "signInWithGithubBtn"
        And   I pause for 2000ms
        And   I clear the inputfield "loginInput"
        When  I add "semacodereviewtester1000" to the inputfield "loginInput"
        And   I clear the inputfield "passwordInput"
        And   I add "f1$#Uc7Bvb3x" to the inputfield "passwordInput"        
        And   I click on the button "signinBtn"
        And   I pause for 5000ms
        Then  I expect that the url is "/dashboard"
        And   I pause for 3000ms

    @C1704  @snip
    Scenario: Snippets can be turned on and turned off
        When  I click on the element "snippetsTab"
         And  I pause for 5000ms
        Then  I expect that element "collectionArea" is displayed
        And   I save the name of collection "firstInActiveCollectionName"
        When  I click on the element "firstInActiveCollectionToggle"
        And   I pause for 3000ms
#        Then  I expect that collection is enabled    #here check name from global variable

        And   I save the name of collection "firstActiveCollectionName"
        When  I click on the element "firstActiveCollectionToggle"
        And   I pause for 3000ms
#        Then  I expect that collection is disabled    #here check name from global variable

    @C2797  @snip
    Scenario: Adding new snippet to collection
        When  I click on the element "snippetsTab"
        Then  I pause for 3000ms
        And   I click on the element "addNewSnippetBtn"
        And   I pause for 5000ms
         And  I set "Test Snippet" to the inputfield "newSnippetTitleInput"
        And   I set "Body text test" to the inputfield "newSnippetBodyInput"
        And   I set "Source name test" to the inputfield "newSnippetSourceNameInput"
        And   I set "Source Link test" to the inputfield "newSnippetSourceLinkInput"
        And   I click on the button "saveNewSnippetBtn"
        And   I pause for 3000ms
#        Then  I expect that new snippet is added       #here check name from global variable

    @C1706  @snip
    Scenario: Search for existing snippet works
        When  I click on the element "snippetsTab"
        And   I pause for 3000ms
        And   I click on the element "mySnippetsCollection"
        And   I pause for 3000ms
        Then  I set "Test" to the inputfield "searchSnippetInput"
        And   I pause for 3000ms
        Then  I expect that element "testSnippet" becomes displayed

    @C2790  @snip
        #only for admin and library users
    Scenario: Adding new snippet collection
        When  I click on the element "snippetsTab"
        Then  I pause for 3000ms
        And   I click on the element "addNewCollectionBtn"
        And   I pause for 5000ms
        And   I set "Test Collection" to the inputfield "newCollectionTitleInput"
        And   I set "Body text test" to the inputfield "newCollectionBodyInput"
        And   I set "Source name test" to the inputfield "newCollectionSourceNameInput"
        And   I set "Source Link test" to the inputfield "newCollectionSourceLinkInput"
        And   I click on the button "saveNewCollectionBtn"
        And   I pause for 3000ms
#        Then  I expect that new collection is added       #here check name from global variable