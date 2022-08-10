@snippets @regression
Feature: Snippets

  Background: Starting test from dashboard page
    When I open the site "/dashboard"
    And  I pause for 3000ms

  @C1704 @smoke
  Scenario: Snippets collection can be turned on and turned off
    #    C2787  C1737
    Then I expect that element "snippetsTab" becomes displayed
    When I click on the element "snippetsTab"
    And  I wait on element "firstInActiveCollectionToggle" for 10000ms to be enabled
    And  I scroll to element "firstInActiveCollectionToggle"
    When I click on the element "firstInActiveCollectionToggle"
     And I pause for 3000ms
    Then I expect that element "firstInActiveCollectionName" becomes displayed
    When I save the text of element "firstInActiveCollectionName"
    Then I expect that element "firstInActiveCollectionToggle" becomes displayed
    When I click on the element "firstInActiveCollectionToggle"
    Then I expect that selected collection element "activeCollectionsNames" is enabled
    ##    C2788

    And  I expect that element "firstActiveCollectionName" becomes displayed
    When I save the text of element "firstActiveCollectionName"
    And  I click on the element "firstActiveCollectionToggle"
    Then I expect that selected collection element "inactiveCollectionsNames" is enabled

  @C2797 @smoke
  #      C2798  C1737
  Scenario: Adding new snippet to "My Snippets" collection
    When I open the site "/snippets"
    Then I expect that element "addNewSnippetBtn" becomes displayed
    When I click on the element "addNewSnippetBtn"
    And  I pause for 4000ms
    Then I expect that element "newSnippetTitleInput" becomes displayed
    When I set "Test Snippet" with timestamp to the inputfield "newSnippetTitleInput"
    And  I set "Body text test" to the inputfield "newSnippetBodyInput"
    Then I expect that element "newSnippetLanguagesInput" becomes displayed
    When I click on the element "newSnippetLanguagesInput"
    And  I set "Java" to the inputfield "newSnippetLanguagesInput"
    And  I pause for 3000ms
    And  I press "Enter"
    Then I expect that element "newSnippetTagsInput" becomes displayed
    When I click on the element "newSnippetTagsInput"
    And  I set "Naming" to the inputfield "newSnippetTagsInput"
    And  I pause for 3000ms
    And  I press "Enter"
    Then I expect that element "newSnippetSourceNameInput" becomes displayed
    And  I set "Source name test" to the inputfield "newSnippetSourceNameInput"
    And  I set "http://sourceLinktest.com" to the inputfield "newSnippetSourceLinkInput"
    Then I expect that element "saveNewSnippetBtn" becomes displayed
    And  I pause for 3000ms
    When I click on the button "saveNewSnippetBtn"
    And  I pause for 1000ms
    Then I expect that element "allSnippetsNames" becomes displayed
    Then I expect that new item "allSnippetsNames" is added to snippets

  @C2814
  Scenario: Adding new snippet to already existing collection
    When I open the site "/snippets"
    Then I expect that element "mySnippetsCollection" becomes displayed
    When I click on the element "mySnippetsCollection"
    Then I expect that element "addNewSnippetInCollectionBtn" becomes displayed

    When I click on the element "addNewSnippetInCollectionBtn"
    And  I pause for 4000ms
    And  I expect that element "newSnippetTitleInput" becomes displayed
    And  I expect that element "newSnippetBodyInput" becomes displayed
    And  I expect that element "newSnippetLanguagesInput" becomes displayed
    And  I expect that element "newSnippetTagsInput" becomes displayed
    And  I pause for 1000ms
    When I click on the element "newSnippetBodyInput"
    And  I set "Body text test" to the inputfield "newSnippetBodyInput"
    And  I pause for 1000ms
    And  I click on the element "newSnippetTitleInput"
    And  I set "Test Snippet in existing collection" with timestamp to the inputfield "newSnippetTitleInput"

    And  I click on the element "newSnippetLanguagesInput"
    And  I pause for 1000ms
    And  I set "Java" to the inputfield "newSnippetLanguagesInput"
    And  I pause for 3000ms
    And  I press "Enter"
    And  I click on the element "newSnippetTagsInput"
    And  I pause for 1000ms
    And  I set "Naming" to the inputfield "newSnippetTagsInput"
    And  I pause for 3000ms
    And  I press "Enter"
    And  I click on the element "newSnippetSourceNameInput"
    And  I set "Source name test" to the inputfield "newSnippetSourceNameInput"
    And  I set "https://testSource.com" to the inputfield "newSnippetSourceLinkInput"
    And  I pause for 3000ms

    Then I expect that element "saveNewSnippetBtn" becomes displayed
    When I click on the button "saveNewSnippetBtn"
    And  I pause for 20000ms
    Then I expect that element "allSnippetsNames" becomes displayed
    And  I expect that new item "allSnippetsNames" is added to snippets

  @C1706 @smoke
  Scenario: Search for existing snippet works
    When I open the site "/snippets"
    Then I expect that element "searchIconBtn" becomes displayed
    When I click on the button "searchIconBtn"
    And  I set "philosophies" to the inputfield "searchCollectionInput"
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
    When I select the option with the value "Organization" for element "searchSnippetTagInput"
    And  I select the option with the text "Language" for element "searchSnippetLanguageInput"
    Then I expect that element "searchedSnippetsResult" does appear exactly "2" times
    And  I expect that element "viewMoreBtn" is not displayed
    #    C1712
    When I click on the element "clearSearchResultBtn"
    Then I expect that element "searchedSnippetsResult" does appear exactly "10" times
    And  I expect that element "viewMoreBtn" becomes displayed
    And  I expect that element "clearSearchResultBtn" is not displayed

  @C1713
  Scenario: Return back to collections from snippets
    When I open the site "/snippets"

    Then I expect that element "1stExistingCollection" becomes displayed
    When I click on the element "1stExistingCollection"
    Then I expect that element "arrowBackBtn" becomes displayed
    When I click on the element "arrowBackBtn"
    Then I expect that element "1stExistingCollection" becomes displayed

    When I click on the element "1stExistingCollection"
    Then I expect that element "snippetsLibraryLinkBtn" becomes displayed
    When I click on the element "snippetsLibraryLinkBtn"
    Then I expect that element "arrowBackBtn" is not displayed

  @C1714
  Scenario: "View more" snippets shows
    When I open the site "/snippets"
    Then I expect that element "searchIconBtn" becomes displayed
    When I click on the button "searchIconBtn"
    And  I set "philosophies" to the inputfield "searchCollectionInput"
    Then I expect that element "philosophiesCollection" becomes displayed
    When I click on the element "philosophiesCollection"
    Then I expect that element "searchedSnippetsResult" becomes displayed
    And  I expect that element "viewMoreBtn" becomes displayed
    And  I expect that element "searchedSnippetsResult" does appear exactly "10" times
    When I click on the element "viewMoreBtn"
    Then I expect that element "searchedSnippetsResult" does appear exactly "20" times

#    @C2469
#      after SCR-768   todo
#    Scenario: Global search by items of turned off collection are clickable
#      When I click on the element "snippetsTab"
#      Then I expect that element "collectionArea" becomes displayed
#      When I turn off all collections
#      Then I expect that element "searchIconBtn" becomes displayed
#      When I click on the button "searchIconBtn"
#      When I set "Philosophies" to the inputfield "searchCollectionInput"
#      Then I expect that element "philosophiesCollection" becomes displayed
#      When I click on the element "firstInActiveCollectionToggle"
#      Then I expect that element "philosophiesCollection" becomes displayed
#      When I set "Iterate in Thens" to the inputfield "searchCollectionInput"
#      Then "snippet" snippet should be found in "collection"
#
#      When I clear the inputfield "searchCollectionInput"
#      And  I click on the element "firstActiveCollectionToggle"
#      Then I expect that element "philosophiesCollection" becomes displayed
#      When I set "Iterate in Thens" to the inputfield "searchCollectionInput"
#      Then "snippet" snippet should be found in "collection"

  #  @C2480
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

#    @C2730
#         after SCR-768   todo
#    Scenario: Global search results are clickable
#      When I click on the element "snippetsTab"
#      Then I expect that element "collectionArea" becomes displayed
#      And  I expect that element "searchIconBtn" becomes displayed
#      When I click on the button "searchIconBtn"
#      And  I set "Philosophies" to the inputfield "searchCollectionInput"
#      Then I expect that element "philosophiesCollection" becomes displayed
#      When I click on the element "philosophiesCollection"
#      Then I expect that element "allSnippetsNames" becomes displayed
#
#      When I click on the element "snippetsTab"
#      Then I expect that element "collectionArea" becomes displayed
#
#      When I set "Logic is the beginning" to the inputfield "searchCollectionInput"
#      Then "snippet" snippet should be found in "collection"
#      When I click on the element "searchedSnippetsResultGlob"
#      Then I expect that element "openedSnippetTODO" becomes displayed

#  @C2326
#    waiting for acme creads  todo
#  Scenario: Context menu is not visible for common user
#    When I click on the element "snippetsTab"
##     C2326   check context menu for common user collection
#    Then I expect that element "threeDotsCollectionBtn" becomes not displayed