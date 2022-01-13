@snippets
Feature: User is able to interact with snippets properly

    Background:
      Given I delete all cookies
      And   I open the url "https://app-staging.semasoftware.com/login"
      And   I pause for 5000ms
      And   I click on the button "signInWithGithubBtn"
      And   I pause for 2000ms
      And   I clear the inputfield "loginInput"
      When  I add "qateam+automationadmin@semasoftware.com" to the inputfield "loginInput"
      And   I clear the inputfield "passwordInput"
      And   I add "Automation1Tester2#" to the inputfield "passwordInput"
      And   I click on the button "signinBtn"
      And   I pause for 5000ms
      Then  I expect that the url is "/dashboard"
      And   I pause for 3000ms

    @snippet
    Scenario: Login successfully
      Given I delete all cookies
      And   I open the url "https://app-staging.semasoftware.com/login"
      And   I click on the button "signInWithGithubBtn"
      And   I pause for 2000ms
      And   I clear the inputfield "loginInput"
      When  I add "qateam+automationadmin@semasoftware.com" to the inputfield "loginInput"
      And   I clear the inputfield "passwordInput"
      And   I add "Automation1Tester2#" to the inputfield "passwordInput"
      And   I click on the button "signinBtn"
      And   I pause for 5000ms
      Then  I expect that the url is "/dashboard"
      And   I pause for 3000ms

    @C1704  @snippet
    Scenario: Snippets collection can be turned on and turned off
#    C2787
      When I click on the element "snippetsTab"
      And  I pause for 5000ms
      Then I expect that element "collectionArea" becomes displayed
#         And  I save the name of collection "firstInActiveCollectionName"
      When I click on the element "firstInActiveCollectionToggle"
      And  I pause for 3000ms
#        Then  I expect that collection is enabled    #here check name from global variable
#    C2788
#         And  I save the name of collection "firstActiveCollectionName"
      When I click on the element "firstActiveCollectionToggle"
      And  I pause for 3000ms
#        Then  I expect that collection is disabled    #here check name from global variable

    @C2797  @snippet
#      C2798
    Scenario: Adding new snippet to "My Snippets" collection
      When I click on the element "snippetsTab"
      Then I pause for 3000ms
      And  I click on the element "addNewSnippetBtn"
      And  I pause for 5000ms
      And  I set "Test Snippet" to the inputfield "newSnippetTitleInput"
      And  I set "Body text test" to the inputfield "newSnippetBodyInput"
      And  I set "Source name test" to the inputfield "newSnippetSourceNameInput"
      And  I set "http://sourceLinktest.com" to the inputfield "newSnippetSourceLinkInput"
      And  I click on the element "newSnippetLanguagesInput"
      And  I pause for 5000ms
      And  I set "Java" to the inputfield "newSnippetLanguagesInput"
      And  I press "Enter"
      And  I click on the element "newSnippetTagsInput"
      And  I set "Naming" to the inputfield "newSnippetTagsInput"
      And  I press "Enter"
      And  I click on the button "saveNewSnippetBtn"
      And  I pause for 5000ms
#        Then  I expect that new snippet is added       #here check name from global variable

    @C2814  @snippet
        #only for admin and library users    todo
    Scenario: Adding new snippet to already existing collection
      When I click on the element "snippetsTab"
      Then I pause for 3000ms
      And  I click on the element "2ndExistingCollection"
      Then I expect that element "addNewSnippetInCollectionBtn" is displayed

      When I click on the element "addNewSnippetInCollectionBtn"
      And  I pause for 5000ms
      And  I set "Test Snippet in existing collection" to the inputfield "newSnippetTitleInput"
      And  I set "Body text test" to the inputfield "newSnippetBodyInput"
      And  I set "Source name test" to the inputfield "newSnippetSourceNameInput"
      And  I set "Source Link test" to the inputfield "newSnippetSourceLinkInput"

      And  I click on the element "newSnippetLanguagesInput"
      And  I set "Java" to the inputfield "newSnippetLanguagesInput"
      And  I press "Enter"
      And  I click on the element "newSnippetTagsInput"
      And  I set "Naming" to the inputfield "newSnippetTagsInput"
      And  I press "Enter"
      And  I click on the button "saveNewSnippetBtn"
      And  I pause for 3000ms
#        Then  I expect that new snippet is added       #here check name from global variable

    @C1706  @snip
    Scenario: Search for existing snippet works
      When I click on the element "snippetsTab"
      And  I pause for 5000ms
      And  I click on the element "philosophiesCollection"
      And  I pause for 3000ms
      Then I expect that element "searchSnippetsResult" does appear exactly "10" times
      When I set "log" to the inputfield "searchSnippetInput"
      And  I pause for 3000ms
#      Then  I expect that element "testSnippet" becomes displayed
      Then I expect that element "searchSnippetsResult" does appear exactly "5" times
#    @C1707
      When I select the option with the value "Practices" for element "searchSnippetTagInput"
      Then I expect that element "searchSnippetsResult" does appear exactly "3" times
#    @C1708
      When I select the option with the value "Go" for element "searchSnippetLanguageInput"
      Then I expect that element "searchSnippetsResult" is not displayed

      When I clear the inputfield "searchSnippetInput"
      And  I set "enf" to the inputfield "searchSnippetInput"
      And  I select the option with the value "Strategic" for element "searchSnippetTagInput"
      And  I select the option with the value "All" for element "searchSnippetLanguageInput"
      Then I expect that element "searchSnippetsResult" does appear exactly "1" times
#    C1709
      When I click on the element "clearSearchResultBtn"
      And  I select the option with the value "Individual" for element "searchSnippetTagInput"
      And  I select the option with the value "All" for element "searchSnippetLanguageInput"
      And  I pause for 3000ms
      Then I expect that element "searchSnippetsResult" does appear exactly "2" times
#    C1711
      When I select the option with the text "Label" for element "searchSnippetTagInput"
      And  I select the option with the value "All" for element "searchSnippetLanguageInput"
      Then I expect that element "searchSnippetsResult" does appear exactly "10" times
      And  I expect that element "viewMoreBtn" becomes displayed
#    C1710
      When I select the option with the value "Team" for element "searchSnippetTagInput"
      And  I select the option with the text "Language" for element "searchSnippetLanguageInput"
      Then I expect that element "searchSnippetsResult" does appear exactly "5" times
      And  I expect that element "viewMoreBtn" is not displayed
#    C1712
      When I click on the element "clearSearchResultBtn"
      Then I expect that element "searchSnippetsResult" does appear exactly "10" times
      And  I expect that element "viewMoreBtn" becomes displayed
      And  I expect that element "clearSearchResultBtn" is not displayed

    @C1713  @snippet
    Scenario: Return back to collections from snippets
      When I click on the element "snippetsTab"
      And  I pause for 3000ms
      And  I click on the element "philosophiesCollection"
      And  I pause for 3000ms
      Then I expect that element "arrowBackBtn" becomes displayed
      And  I click on the element "arrowBackBtn"

      When I pause for 3000ms
      And  I click on the element "philosophiesCollection"
      And  I pause for 3000ms
      Then I expect that element "snippetsLibraryLinkBtn" becomes displayed
      When I click on the element "snippetsLibraryLinkBtn"
      Then I expect that element "arrowBackBtn" is not displayed

    @C2790  @snippet
        #only for admin and library users
    Scenario: Adding new snippet collection
      #temporary solution
      When I click on the element "userLogo"
      When I click on the element "semaCorporateTeamLogo"
      #------------------

      When I click on the element "snippetsTab"
      And  I pause for 3000ms
      And  I click on the element "addNewCollectionBtn"
      And  I pause for 5000ms
      And  I set "Test Collection" to the inputfield "newCollectionTitleInput"
      And  I set "Body text test" to the inputfield "newCollectionDescriptionInput"
      And  I set "Source name test" to the inputfield "newCollectionSourceNameInput"
      And  I set "https://testSource.com" to the inputfield "newCollectionSourceLinkInput"
      And  I set "test author name" to the inputfield "newCollectionAuthorInput"
      And  I click on the element "newCollectionLanguagesInput"
      And  I set "Type" to the inputfield "newCollectionLanguagesInput"
      And  I press "Enter"
      And  I click on the element "newCollectionOtherLabelInput"
      And  I set "Syntax" to the inputfield "newCollectionOtherLabelInput"
      And  I press "Enter"

      And  I click on the button "saveNewCollectionBtn"
      And  I pause for 5000ms
#      Then  I expect that new collection is added       #here check name from global variable

    @C1714  @snippet
    Scenario: "View more" snippets shows
      And  I pause for 5000ms
      When I click on the element "snippetsTab"
      And  I pause for 3000ms
      And  I click on the element "philosophiesCollection"
      And  I pause for 3000ms
      Then I expect that element "viewMoreBtn" becomes displayed
      And  I expect that element "searchSnippetsResult" does appear exactly "10" times
      When I click on the element "viewMoreBtn"
      Then I expect that element "searchSnippetsResult" does appear exactly "20" times

    @C2442  @snippet
    Scenario: The default tags for collection is added to snippet
      #temporary solution
      When I click on the element "userLogo"
      When I click on the element "semaCorporateTeamLogo"
      #------------------

      When I click on the element "snippetsTab"
      And  I pause for 3000ms
      And  I click on the element "addNewCollectionBtn"
      And  I pause for 5000ms
      And  I set "Test Collection FOR TAGS" to the inputfield "newCollectionTitleInput"
      And  I set "This collection is for creating snippets with same tag in as here" to the inputfield "newCollectionDescriptionInput"
      And  I set "Source name test" to the inputfield "newCollectionSourceNameInput"
      And  I set "https://testSource.com" to the inputfield "newCollectionSourceLinkInput"
      And  I set "test author name" to the inputfield "newCollectionAuthorInput"
      And  I click on the element "newCollectionLanguagesInput"
      And  I set "Type" to the inputfield "newCollectionLanguagesInput"
      And  I press "Enter"
      And  I click on the element "newCollectionOtherLabelInput"
      And  I set "Leadership" to the inputfield "newCollectionOtherLabelInput"
      And  I press "Enter"

      And  I click on the button "saveNewCollectionBtn"
      And  I pause for 5000ms

      And  I set "Test Collection FOR TAGS" to the inputfield "searchCollectionInput"
      And  I click on the element "testTagCollection"
      And  I pause for 3000ms
      And  I click on the element "addNewSnippetInCollectionBtn"
      Then I expect that element "selectedLeadershipTag" becomes displayed
      And  I expect that element "selectedTypeScriptLanguage" becomes displayed

      When I set "Test Snippet with default tags" to the inputfield "newSnippetTitleInput"
      And  I set "default tags" to the inputfield "newSnippetBodyInput"
      And  I set "https://testSource.com" to the inputfield "newSnippetSourceLinkInput"

      And  I click on the button "saveNewSnippetBtn"
      And  I pause for 3000ms
#      verify new snippet


