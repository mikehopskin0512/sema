@snippets
Feature: User is able to interact with snippets properly

    Background:
        Given I delete all cookies
         And  I open the url "https://app.semasoftware.com/login"
         And  I click on the button "signInWithGithubBtn"
         And  I pause for 2000ms
         And  I clear the inputfield "loginInput"
        When  I add "semacodereviewtester1000" to the inputfield "loginInput"
         And  I clear the inputfield "passwordInput"
         And  I add "f1$#Uc7Bvb3x" to the inputfield "passwordInput"
         And  I click on the button "signinBtn"
         And  I pause for 5000ms
        Then  I expect that the url is "/dashboard"
         And  I pause for 3000ms

    @snippet
    Scenario: Login successfully
        Given I delete all cookies
         And  I open the url "https://app.semasoftware.com/login"
         And  I click on the button "signInWithGithubBtn"
         And  I pause for 2000ms
         And  I clear the inputfield "loginInput"
        When  I add "semacodereviewtester1000" to the inputfield "loginInput"
         And  I clear the inputfield "passwordInput"
         And  I add "f1$#Uc7Bvb3x" to the inputfield "passwordInput"
         And  I click on the button "signinBtn"
         And  I pause for 5000ms
        Then  I expect that the url is "/dashboard"
         And  I pause for 3000ms

    @C1704  @snippet
    Scenario: Snippets can be turned on and turned off
        When  I click on the element "snippetsTab"
         And  I pause for 5000ms
        Then  I expect that element "collectionArea" is displayed
         And  I save the name of collection "firstInActiveCollectionName"
        When  I click on the element "firstInActiveCollectionToggle"
         And  I pause for 3000ms
#        Then  I expect that collection is enabled    #here check name from global variable

         And  I save the name of collection "firstActiveCollectionName"
        When  I click on the element "firstActiveCollectionToggle"
         And  I pause for 3000ms
#        Then  I expect that collection is disabled    #here check name from global variable

    @C2797  @snippet
    Scenario: Adding new snippet to "My Snippets" collection
        When  I click on the element "snippetsTab"
        Then  I pause for 3000ms
         And  I click on the element "addNewSnippetBtn"
         And  I pause for 5000ms
         And  I set "Test Snippet" to the inputfield "newSnippetTitleInput"
         And  I set "Body text test" to the inputfield "newSnippetBodyInput"
         And  I set "Source name test" to the inputfield "newSnippetSourceNameInput"
         And  I set "Source Link test" to the inputfield "newSnippetSourceLinkInput"
         And  I click on the button "saveNewSnippetBtn"
         And  I pause for 3000ms
#        Then  I expect that new snippet is added       #here check name from global variable

    @C2814  @snippet
        #only for admin and library users    todo
    Scenario: Adding new snippet to already existing collection
        When  I click on the element "snippetsTab"
        Then  I pause for 3000ms
         And  I click on the element "2ndExistingCollection"
        Then  I expect that element "addNewSnippetInCollectionBtn" is displayed

        When  I click on the element "addNewSnippetInCollectionBtn"
         And  I pause for 5000ms
         And  I set "Test Snippet in existing collection" to the inputfield "newSnippetTitleInput"
         And  I set "Body text test" to the inputfield "newSnippetBodyInput"
         And  I set "Source name test" to the inputfield "newSnippetSourceNameInput"
         And  I set "Source Link test" to the inputfield "newSnippetSourceLinkInput"
         And  I select the option with the name "Java" for element "newSnippetLanguagesInput"
         And  I select the option with the name "Naming" for element "newSnippetTagsInput"
         And  I click on the button "saveNewSnippetBtn"
         And  I pause for 3000ms
#        Then  I expect that new snippet is added       #here check name from global variable

    @C1706  @snip
#    library user
    Scenario: Search for existing snippet works
        When  I click on the element "snippetsTab"
         And  I pause for 3000ms
         And  I click on the element "2ndExistingCollection"
         And  I pause for 3000ms
         And  I set "comp" to the inputfield "searchSnippetInput"
         And  I pause for 3000ms
#        need to extend to check name
#        Then  I expect that element "testSnippet" becomes displayed
        Then  I expect that element "searchSnippetsResult" does appear exactly "10" times
#    @C1707
        When  I select the option with the name "Objects" for element "searchSnippetTagInput"
        Then  I expect that element "searchSnippetsResult" does appear exactly "1" times
#    @C1708
        When  I select the option with the name "Comments" for element "searchSnippetTagInput"
        Then  I expect that element "searchSnippetsResult" is not displayed

        When  I select the option with the name "Comparison Operators & Equality" for element "searchSnippetTagInput"
         And  I select the option with the name "JavaScript" for element "searchSnippetLanguageInput"
        Then  I expect that element "searchSnippetsResult" does appear exactly "8" times
#    C1709
        When  I clear the inputfield "searchSnippetInput"
         And  I select the option with the name "Arrays" for element "searchSnippetTagInput"
        Then  I expect that element "searchSnippetsResult" does appear exactly "1" times
#    C1711
        When  I select the option with the name "Tag" for element "searchSnippetTagInput"
         And  I select the option with the name "JavaScript" for element "searchSnippetLanguageInput"
        Then  I expect that element "searchSnippetsResult" does appear exactly "10" times
         And  I expect that element "viewMoreBtn" is displayed
         And  I expect that element "clearSearchResultBtn" is displayed
#    C1710
        When  I select the option with the name "Control Statements" for element "searchSnippetTagInput"
         And  I select the option with the name "Language" for element "searchSnippetLanguageInput"
        Then  I expect that element "searchSnippetsResult" does appear exactly "2" times
         And  I expect that element "clearSearchResultBtn" is displayed
#    C1712
        When  I click on the element "clearSearchResultBtn"
        Then  I expect that element "searchSnippetsResult" does appear exactly "10" times
         And  I expect that element "viewMoreBtn" is displayed
         And  I expect that element "clearSearchResultBtn" is not displayed

    @C1713  @snippet
    Scenario: Return back to collections from snippets
        When  I click on the element "snippetsTab"
         And  I pause for 3000ms
         And  I click on the element "2ndExistingCollection"
         And  I pause for 3000ms
        Then  I expect that element "arrowBackBtn" is displayed
         And  I click on the element "arrowBackBtn"

        When  I pause for 3000ms
         And  I click on the element "2ndExistingCollection"
         And  I pause for 3000ms
        Then  I expect that element "snippetsLibraryLinkBtn" is displayed
        When  I click on the element "snippetsLibraryLinkBtn"
        Then  I expect that element "arrowBackBtn" is not displayed

    @C2790  @snippet
        #only for admin and library users
    Scenario: Adding new snippet collection
        When  I click on the element "snippetsTab"
         And  I pause for 3000ms
         And  I click on the element "addNewCollectionBtn"
         And  I pause for 5000ms
         And  I set "Test Collection" to the inputfield "newCollectionTitleInput"
         And  I set "Body text test" to the inputfield "newCollectionBodyInput"
         And  I set "Source name test" to the inputfield "newCollectionSourceNameInput"
         And  I set "Source Link test" to the inputfield "newCollectionSourceLinkInput"
         And  I click on the button "saveNewCollectionBtn"
         And  I pause for 3000ms
#        Then  I expect that new collection is added       #here check name from global variable

    @C1714  @snippet
    Scenario:  "View more" snippets shows
        When  I click on the element "snippetsTab"
         And  I pause for 3000ms
         And  I click on the element "2ndExistingCollection"
         And  I pause for 3000ms
        Then  I expect that element "viewMoreBtn" is displayed
         And  I expect that element "searchSnippetsResult" does appear exactly "10" times

        When  I click on the element "viewMoreBtn"
        Then  I expect that element "searchSnippetsResult" does appear exactly "20" times