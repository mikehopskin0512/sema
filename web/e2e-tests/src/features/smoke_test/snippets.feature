@snippets
Feature: User is able to interact with snippets properly


#  Background: Wait for page to be displayed
#    Given User click on the element "authorizeSemaSoftwareBtn" if visible
#    When I wait on element "userLogo" for 10000ms

  @admin  @C1704  @snippet
  Scenario: Snippets collection can be turned on and turned off
#    C2787  C1737
    When I click on the element "snippetsTab"

    Then I expect that element "collectionArea" becomes displayed
    When I click on the element "firstInActiveCollectionToggle"
    Then I expect that element "firstInActiveCollectionName" becomes displayed
    When I save the name of collection "firstInActiveCollectionName"
    And  I click on the element "firstInActiveCollectionToggle"
    Then I expect that selected collection element "activeCollectionsNames" is enabled
##    C2788
    When I save the name of collection "firstActiveCollectionName"
    And  I click on the element "firstActiveCollectionToggle"
    Then I expect that selected collection element "inactiveCollectionsNames" is enabled

  @admin  @C2797  @snippet
#      C2798  C1737
  Scenario: Adding new snippet to "My Snippets" collection
    When I click on the element "snippetsTab"
    Then I expect that element "addNewSnippetBtn" becomes displayed
    When I click on the element "addNewSnippetBtn"
    Then I expect that element "newSnippetTitleInput" becomes displayed
    When I set "Test Snippet" with timestamp to the inputfield "newSnippetTitleInput"
    And  I set "Body text test" to the inputfield "newSnippetBodyInput"
    Then I expect that element "newSnippetLanguagesInput" becomes displayed
    When I click on the element "newSnippetLanguagesInput"
    And  I set "Java" to the inputfield "newSnippetLanguagesInput"
    And  I press "Enter"
    Then I expect that element "newSnippetTagsInput" becomes displayed
    When I click on the element "newSnippetTagsInput"
    And  I set "Naming" to the inputfield "newSnippetTagsInput"
    And  I press "Enter"
    Then I expect that element "newSnippetSourceNameInput" becomes displayed
    And  I set "Source name test" to the inputfield "newSnippetSourceNameInput"
    And  I set "http://sourceLinktest.com" to the inputfield "newSnippetSourceLinkInput"
    Then I expect that element "saveNewSnippetBtn" becomes displayed
    When I click on the button "saveNewSnippetBtn"
    Then I expect that new item "allSnippetsNames" is added to snippets

  @admin  @C2814  @snippet
  Scenario: Adding new snippet to already existing collection
    When I click on the element "snippetsTab"
    Then I expect that element "mySnippetsCollection" becomes displayed
    When I click on the element "mySnippetsCollection"
    Then I expect that element "addNewSnippetInCollectionBtn" becomes displayed

    When I click on the element "addNewSnippetInCollectionBtn"
    Then I expect that element "newSnippetTitleInput" becomes displayed
    When I set "Test Snippet in existing collection" with timestamp to the inputfield "newSnippetTitleInput"
    And  I set "Body text test" to the inputfield "newSnippetBodyInput"

    When I click on the element "newSnippetLanguagesInput"
    And  I set "Java" to the inputfield "newSnippetLanguagesInput"
    And  I press "Enter"
    And  I click on the element "newSnippetTagsInput"
    And  I set "Naming" to the inputfield "newSnippetTagsInput"
    And  I press "Enter"
    And  I set "Source name test" to the inputfield "newSnippetSourceNameInput"
    And  I set "https://testSource.com" to the inputfield "newSnippetSourceLinkInput"

    Then I expect that element "saveNewSnippetBtn" becomes displayed
    When I click on the button "saveNewSnippetBtn"
    Then I expect that new item "allSnippetsNames" is added to snippets

  @admin  @C1706  @snip
  Scenario: Search for existing snippet works
    When I click on the element "snippetsTab"
    Then I expect that element "philosophiesCollection" becomes displayed
    When I click on the element "philosophiesCollection"
    Then I expect that element "searchedSnippetsResult" becomes displayed
    And  I expect that element "searchedSnippetsResult" does appear exactly "10" times
    When I set "log" to the inputfield "searchSnippetInput"
    Then I expect that element "searchedSnippetsResult" does appear exactly "5" times
#    @C1707
    When I select the option with the value "Practices" for element "searchSnippetTagInput"
    Then I expect that element "searchedSnippetsResult" does appear exactly "3" times
#    @C1708
    When I select the option with the value "Go" for element "searchSnippetLanguageInput"
    Then I expect that element "searchedSnippetsResult" is not displayed

    When I clear the inputfield "searchSnippetInput"
    And  I set "enf" to the inputfield "searchSnippetInput"
    And  I select the option with the value "Strategic" for element "searchSnippetTagInput"
    And  I select the option with the value "All" for element "searchSnippetLanguageInput"
    Then I expect that element "searchedSnippetsResult" does appear exactly "1" times
#    C1709
    When I click on the element "clearSearchResultBtn"
    And  I select the option with the value "Individual" for element "searchSnippetTagInput"
    And  I select the option with the value "All" for element "searchSnippetLanguageInput"
    Then I expect that element "searchedSnippetsResult" does appear exactly "2" times
#    C1711
    When I select the option with the text "Label" for element "searchSnippetTagInput"
    And  I select the option with the value "All" for element "searchSnippetLanguageInput"
    Then I expect that element "searchedSnippetsResult" does appear exactly "10" times
    And  I expect that element "viewMoreBtn" becomes displayed
#    C1710
    When I select the option with the value "Team" for element "searchSnippetTagInput"
    And  I select the option with the text "Language" for element "searchSnippetLanguageInput"
    Then I expect that element "searchedSnippetsResult" does appear exactly "5" times
    And  I expect that element "viewMoreBtn" is not displayed
#    C1712
    When I click on the element "clearSearchResultBtn"
    Then I expect that element "searchedSnippetsResult" does appear exactly "10" times
    And  I expect that element "viewMoreBtn" becomes displayed
    And  I expect that element "clearSearchResultBtn" is not displayed

  @C1713  @snippet
  Scenario: Return back to collections from snippets
    When I click on the element "snippetsTab"
    Then I expect that element "philosophiesCollection" becomes displayed
    When I click on the element "philosophiesCollection"
    Then I expect that element "arrowBackBtn" becomes displayed
    When I click on the element "arrowBackBtn"
    Then I expect that element "philosophiesCollection" becomes displayed

    When I click on the element "philosophiesCollection"
    Then I expect that element "snippetsLibraryLinkBtn" becomes displayed
    When I click on the element "snippetsLibraryLinkBtn"
    Then I expect that element "arrowBackBtn" is not displayed

  @admin  @C2790  @snippet
  Scenario: Adding new snippet collection
      #temporary solution
    When I click on the element "userLogo"
    When I click on the element "semaCorporateTeamLogo"
      #------------------
    When I click on the element "snippetsTab"
    Then I expect that element "addNewCollectionBtn" becomes displayed
    When I click on the element "addNewCollectionBtn"
    Then I expect that element "newCollectionTitleInput" becomes displayed
    When I set "Test Collection" with timestamp to the inputfield "newCollectionTitleInput"
    When I click on the element "newCollectionLanguagesInput"
    And  I set "Type" to the inputfield "newCollectionLanguagesInput"
    Then I expect that element "firstOptionForLanguagesInput" becomes displayed
    When I press "Enter"
    Then I expect that element "newCollectionOtherLabelInput" becomes displayed
    When I click on the element "newCollectionOtherLabelInput"
    And  I set "Syntax" to the inputfield "newCollectionOtherLabelInput"
    Then I expect that element "firstOptionForOtherLabelInput" becomes displayed
    When I press "Enter"
    And  I set "test author name" to the inputfield "newCollectionAuthorInput"
    And  I set "Source name test" to the inputfield "newCollectionSourceNameInput"
    And  I set "https://testSource.com" to the inputfield "newCollectionSourceLinkInput"
    When I set "Body text test" to the inputfield "newCollectionDescriptionInput"
    Then I expect that element "saveNewCollectionBtn" becomes displayed
    When I click on the button "saveNewCollectionBtn"
    Then I expect that new item "allCollectionsNames" is added to collections

  @C1714  @snippet
  Scenario:  "View more" snippets shows
    When I click on the element "snippetsTab"
    Then I expect that element "philosophiesCollection" becomes displayed
    When I click on the element "philosophiesCollection"
    Then I expect that element "viewMoreBtn" becomes displayed
    And  I expect that element "searchedSnippetsResult" does appear exactly "10" times
    When I click on the element "viewMoreBtn"
    Then I expect that element "searchedSnippetsResult" does appear exactly "20" times

  @admin  @C2442  @snippet
  Scenario: The default tags for collection is added to snippet
      #temporary solution
    Then I expect that element "userLogo" becomes displayed
    When I click on the element "userLogo"
    Then I expect that element "semaCorporateTeamLogo" becomes displayed
    When I click on the element "semaCorporateTeamLogo"
    Then I expect that element "snippetsTab" becomes displayed
      #------------------
    When I click on the element "snippetsTab"
    Then I expect that element "addNewCollectionBtn" becomes displayed
    When I click on the element "addNewCollectionBtn"
    Then I expect that element "newCollectionTitleInput" becomes displayed
    When I set "Test Collection FOR TAGS " with timestamp to the inputfield "newCollectionTitleInput"
    And  I set "This collection is for creating snippets with same tag in as here" to the inputfield "newCollectionDescriptionInput"
    And  I set "Source name test" to the inputfield "newCollectionSourceNameInput"
    And  I set "https://testSource.com" to the inputfield "newCollectionSourceLinkInput"
    And  I set "test author name" to the inputfield "newCollectionAuthorInput"
    Then I expect that element "newCollectionLanguagesInput" becomes displayed
    When I click on the element "newCollectionLanguagesInput"
    And  I set "Type" to the inputfield "newCollectionLanguagesInput"
    Then I expect that element "firstOptionForLanguagesInput" becomes displayed
    When I press "Enter"
    Then I expect that element "newCollectionTitleInput" becomes displayed
    When I click on the element "newCollectionTitleInput"
    And  I set "Leadership" to the inputfield "newCollectionOtherLabelInput"
    Then I expect that element "firstOptionForOtherLabelInput" becomes displayed
    When I press "Enter"

    And  I click on the button "saveNewCollectionBtn"
    Then I expect that element "searchCollectionInput" becomes displayed

    When I search created collection "searchCollectionInput"
    Then I expect that element "firstInActiveCollectionName" becomes displayed
    And  I click on the element "firstInActiveCollectionName"
    Then I expect that element "addNewSnippetInCollectionBtn" becomes displayed
    When I click on the element "addNewSnippetInCollectionBtn"
    Then I expect that element "selectedLeadershipTag" becomes displayed
    And  I expect that element "selectedTypeScriptLanguage" becomes displayed

    When I set "Test Snippet with default tags " with timestamp to the inputfield "newSnippetTitleInput"
    And  I set "default tags" to the inputfield "newSnippetBodyInput"
    And  I set "https://testSource.com" to the inputfield "newSnippetSourceLinkInput"
    And  I click on the button "saveNewSnippetBtn"
    Then I expect that element "allSnippetsNames" becomes displayed
    When I search created snippet "searchSnippetInput"

    Then I expect that element "searchedSnippetsResult" does appear exactly "1" times
    And  I expect that element "snippetsLanguage" matches the text "Leadership"
    And  I expect that element "snippetsLabel" matches the text "TypeScript"

#  @admin  @C2469
#    after SCR-768   todo
#  Scenario: Global search by items of turned off collection are clickable
#    When I click on the element "snippetsTab"
#    Then I expect that element "collectionArea" becomes displayed
#    When I turn off all collections
#    When I set "Philosophies" to the inputfield "searchCollectionInput"
#    Then I expect that element "philosophiesCollection" becomes displayed
#    When I click on the element "firstInActiveCollectionToggle"
#    Then I expect that element "philosophiesCollection" becomes displayed
#    When I set "Iterate in Thens" to the inputfield "searchCollectionInput"
#    Then "snippet" snippet should be found in "collection"
#
#    When I clear the inputfield "searchCollectionInput"
#    And  I click on the element "firstActiveCollectionToggle"
#    Then I expect that element "philosophiesCollection" becomes displayed
#    When I set "Iterate in Thens" to the inputfield "searchCollectionInput"
#    Then "snippet" snippet should be found in "collection"

#  @admin  @C2480
        #    after SCR-768   todo
#  Scenario: Global search with non-alphanumeric characters
#    When I click on the element "snippetsTab"
#    Then I expect that element "collectionArea" becomes displayed
#    When I set "+" to the inputfield "searchCollectionInput"
#    Then I expect that element "searchedCollectionsResult" does appear exactly "todo" times
#
#    When I clear the inputfield "searchCollectionInput"
#    And  I set "$" to the inputfield "searchCollectionInput"
#    Then I expect that element "searchedCollectionsResult" does appear exactly "todo" times
#
#    When I clear the inputfield "searchCollectionInput"
#    And  I set "++" to the inputfield "searchCollectionInput"
#    Then I expect that element "searchedCollectionsResult" does appear exactly "todo" times
#
#    When I clear the inputfield "searchCollectionInput"
#    And  I set "/" to the inputfield "searchCollectionInput"
#    Then I expect that element "searchedCollectionsResult" does appear exactly "todo" times
#
#    When I clear the inputfield "searchCollectionInput"
#    And  I set "&" to the inputfield "searchCollectionInput"
#    Then I expect that element "searchedCollectionsResult" does appear exactly "todo" times
#
#    When I clear the inputfield "searchCollectionInput"
#    And  I set "%" to the inputfield "searchCollectionInput"
#    Then I expect that element "searchedCollectionsResult" does appear exactly "todo" times

#  @admin  @C2730
#       after SCR-768   todo
#  Scenario: Global search results are clickable
#    When I click on the element "snippetsTab"
#    Then I expect that element "collectionArea" becomes displayed
#    When I set "Philosophies" to the inputfield "searchCollectionInput"
#    Then I expect that element "philosophiesCollection" becomes displayed
#    When I click on the element "philosophiesCollection"
#    Then I expect that element "allSnippetsNames" becomes displayed
#
#    When I click on the element "snippetsTab"
#    Then I expect that element "collectionArea" becomes displayed
#
#    When I set "Logic is the beginning" to the inputfield "searchCollectionInput"
#    Then "snippet" snippet should be found in "collection"
#    When I click on the element "searchedSnippetsResultGlob"
#    Then I expect that element "openedSnippetTODO" becomes displayed


  @admin  @C2741  @snippet
#      C2741  C2742
#  https://semalab.atlassian.net/browse/SCR-797     todo
  Scenario: Field validation for creating collection
        #temporary solution
    When I click on the element "userLogo"
    When I click on the element "semaCorporateTeamLogo"
        #------------------
    When I click on the element "snippetsTab"
    Then I expect that element "addNewCollectionBtn" becomes displayed
    When I click on the element "addNewCollectionBtn"
    Then I expect that element "newCollectionTitleInput" becomes displayed
    And  I expect that element "saveNewCollectionBtn" becomes displayed
    When I click on the button "saveNewCollectionBtn"

    Then I expect that element "snippetCollectionTitleError" becomes displayed
    And  I expect that element "snippetCollectionTitleError" matches the text "Title is required"
    And  I expect that element "snippetCollectionLanguageError" matches the text "At least one tag is required"
    And  I expect that element "snippetCollectionOtherError" matches the text "At least one tag is required"
    And  I expect that element "snippetCollectionAuthorError" matches the text "Author is required"
    And  I expect that element "snippetCollectionSourceNameError" matches the text "Source name is required"
    And  I expect that element "snippetCollectionLinkError" matches the text "Source link is required"

    When I set "Test Collection" with timestamp to the inputfield "newCollectionTitleInput"
    When I click on the element "newCollectionLanguagesInput"
    And  I set "java" to the inputfield "newCollectionLanguagesInput"
    Then I expect that element "firstOptionForLanguagesInput" becomes displayed
    When I press "Enter"
    Then I expect that element "newCollectionOtherLabelInput" becomes displayed
    When I click on the element "newCollectionOtherLabelInput"
    And  I set "Syntax" to the inputfield "newCollectionOtherLabelInput"
    Then I expect that element "firstOptionForOtherLabelInput" becomes displayed
    When I press "Enter"
    And  I set "test author name" to the inputfield "newCollectionAuthorInput"
    And  I set "Source name test" to the inputfield "newCollectionSourceNameInput"
    And  I set "invalid url text" to the inputfield "newCollectionSourceLinkInput"

    Then I expect that element "snippetCollectionTitleError" becomes not displayed
    And  I expect that element "snippetCollectionLanguageError" becomes not displayed
    And  I expect that element "snippetCollectionOtherError" becomes not displayed
    And  I expect that element "snippetCollectionAuthorError" becomes not displayed
    And  I expect that element "snippetCollectionSourceNameError" becomes not displayed
    And  I expect that element "snippetCollectionLinkError" matches the text "Invalid URL"

    When I set "https://testSource.com" to the inputfield "newSnippetSourceLinkInput"
    Then I expect that element "snippetCollectionLinkError" becomes not displayed


  @admin  @C2786  @snippet
  Scenario: Populate this collection to all users checkbox is marked
        #temporary solution
    When I click on the element "userLogo"
    Then I expect that element "semaCorporateTeamLogo" becomes displayed
    When I click on the element "semaCorporateTeamLogo"
        #------------------
    When I click on the element "snippetsTab"
    Then I expect that element "addNewCollectionBtn" becomes displayed
    When I click on the element "addNewCollectionBtn"
    Then I expect that element "newCollectionTitleInput" becomes displayed
    When I set "Test Collection with marked" with timestamp to the inputfield "newCollectionTitleInput"
    When I click on the element "newCollectionLanguagesInput"
    And  I set "java" to the inputfield "newCollectionLanguagesInput"
    Then I expect that element "firstOptionForLanguagesInput" becomes displayed
    When I press "Enter"
    Then I expect that element "newCollectionOtherLabelInput" becomes displayed
    When I click on the element "newCollectionOtherLabelInput"
    And  I set "Syntax" to the inputfield "newCollectionOtherLabelInput"
    Then I expect that element "firstOptionForOtherLabelInput" becomes displayed
    When I press "Enter"
    And  I set "test author name" to the inputfield "newCollectionAuthorInput"
    And  I set "Source name test" to the inputfield "newCollectionSourceNameInput"
    And  I set "https://testSource.com" to the inputfield "newCollectionSourceLinkInput"
    When I set "Body text test" to the inputfield "newCollectionDescriptionInput"
    Then I expect that checkbox "newCollectionPopulateCheckBox" is checked

    Then I expect that element "saveNewCollectionBtn" becomes displayed
    When I click on the button "saveNewCollectionBtn"
    Then I expect that new item "allCollectionsNames" is added to collections
#      logout       todo   acme login
    When I click on the element "userLogo"
    Then I expect that element "signOutBtn" becomes displayed
    When I click on the element "signOutBtn"
    Then I expect that element "confirmBtn" becomes displayed
    And  I click on the element "confirmBtn"
    Then I expect that element "signInWithGithubBtn" becomes displayed
#       login with acme
    When I click on the button "signInWithGithubBtn"
    And  I pause for 2000ms
    And  I clear the inputfield "loginInput"
    When I add "qateam+automationacme@semasoftware.com" to the inputfield "loginInput"
    And  I clear the inputfield "passwordInput"
    And  I add "Automation3Tester4#" to the inputfield "passwordInput"
    And  I click on the button "signinBtn"
    Then I expect that element "snippetsTab" becomes displayed
#      check added collection
    When I click on the element "snippetsTab"
    And  I search created collection "searchCollectionInput"
    Then I expect that new item "allCollectionsNames" is added to collections

  @admin  @C2786000  @snippet
  Scenario: Populate this collection to all users checkbox is not marked
          #temporary solution
    When I click on the element "userLogo"
    Then I expect that element "semaCorporateTeamLogo" becomes displayed
    When I click on the element "semaCorporateTeamLogo"
          #------------------
    When I click on the element "snippetsTab"
    Then I expect that element "addNewCollectionBtn" becomes displayed
    When I click on the element "addNewCollectionBtn"
    Then I expect that element "newCollectionTitleInput" becomes displayed
    When I set "Test Collection with unmarked" with timestamp to the inputfield "newCollectionTitleInput"
    And  I click on the element "newCollectionLanguagesInput"
    And  I set "java" to the inputfield "newCollectionLanguagesInput"
    Then I expect that element "firstOptionForLanguagesInput" becomes displayed
    And  I press "Enter"
    Then I expect that element "newCollectionOtherLabelInput" becomes displayed
    When I click on the element "newCollectionOtherLabelInput"
    And  I set "Syntax" to the inputfield "newCollectionOtherLabelInput"
    Then I expect that element "firstOptionForOtherLabelInput" becomes displayed
    When I press "Enter"
    And  I set "test author name" to the inputfield "newCollectionAuthorInput"
    When I set "Source name test" to the inputfield "newCollectionSourceNameInput"
    And  I set "https://testSource.com" to the inputfield "newCollectionSourceLinkInput"
    When I set "Body text test" to the inputfield "newCollectionDescriptionInput"
#      unmark checkbox
    And  I expect that checkbox "newCollectionPopulateCheckBox" is checked
    When I click on the element "newCollectionPopulateCheckBox"
    Then I expect that checkbox "newCollectionPopulateCheckBox" is not checked

    Then I expect that element "saveNewCollectionBtn" becomes displayed
    When I click on the button "saveNewCollectionBtn"
    Then I expect that new item "allCollectionsNames" is added to collections
#        logout     todo   acme login
    When I click on the element "userLogo"
    Then I expect that element "signOutBtn" becomes displayed
    When I click on the element "signOutBtn"
    Then I expect that element "confirmBtn" becomes displayed
    And  I click on the element "confirmBtn"
    Then I expect that element "signInWithGithubBtn" becomes displayed
    When I delete all cookies
#         login with acme
    And  I click on the button "signInWithGithubBtn"
    Then I expect that element "loginInput" becomes displayed
    When I clear the inputfield "loginInput"
    And  I add "qateam+automationacme@semasoftware.com" to the inputfield "loginInput"
    And  I clear the inputfield "passwordInput"
    And  I add "Automation3Tester4#" to the inputfield "passwordInput"
    And  I click on the button "signinBtn"
    Then I expect that element "snippetsTab" becomes displayed
#        check added collection
    When I click on the element "snippetsTab"
    And  I search created collection "searchCollectionInput"
    Then I expect that new item "allCollectionsNames" is not added to collections

  @admin @C2795  @C2324
  Scenario: Snippet collection can be edited
              #temporary solution
    When I click on the element "userLogo"
    Then I expect that element "semaCorporateTeamLogo" becomes displayed
    When I click on the element "semaCorporateTeamLogo"
    Then I expect that element "snippetsTab" becomes displayed
          #------------------
    When I click on the element "snippetsTab"
    Then I expect that element "threeDotsCollectionBtn" becomes displayed
#  C2324
    When I click on the "1st" element "threeDotsCollectionBtn"
    Then I expect that element "editCollectionBtn" becomes displayed
    When I click on the element "editCollectionBtn"

    Then I expect that element "newCollectionTitleInput" becomes displayed
    When I set "edited" with timestamp to the inputfield "newCollectionTitleInput"
    When I click on the element "newCollectionLanguagesInput"
    And  I set "java" to the inputfield "newCollectionLanguagesInput"
    Then I expect that element "firstOptionForLanguagesInput" becomes displayed
    When I press "Enter"
    Then I expect that element "newCollectionOtherLabelInput" becomes displayed
    When I click on the element "newCollectionOtherLabelInput"
    And  I set "Syntax" to the inputfield "newCollectionOtherLabelInput"
    Then I expect that element "firstOptionForOtherLabelInput" becomes displayed
    When I press "Enter"
    And  I set "test author name" to the inputfield "newCollectionAuthorInput"
    And  I set "Source name test" to the inputfield "newCollectionSourceNameInput"
    And  I set "https://testSource.com" to the inputfield "newCollectionSourceLinkInput"
    When I set "Body text test" to the inputfield "newCollectionDescriptionInput"
    Then I expect that element "saveNewCollectionBtn" becomes displayed
    When I click on the button "saveNewCollectionBtn"
    Then I expect that new item "allCollectionsNames" is added to collections

#  @acme  @C2326
#    waiting for acme creads  todo
#  Scenario: Context menu is not visible for common user
#    When I click on the element "snippetsTab"
##     C2326   check context menu for common user collection
#    Then I expect that element "threeDotsCollectionBtn" becomes not displayed

