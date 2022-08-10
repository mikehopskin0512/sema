@snippets @regression
Feature: Snippets

  Background: Starting test from dashboard page
    When I open the site "/dashboard"
    And  I pause for 3000ms

  @C2795  @smoke
  Scenario: Snippet collection can be edited
    Then I expect that element "companyDropdown" becomes displayed
    When I click on the element "companyDropdown"
    Then I expect that element "semaCorporateOrganizationLogo" becomes displayed
    When I hover over element "semaCorporateOrganizationLogo"
    Then I expect that element "highlightedTeam" becomes displayed
    When I click on the element "highlightedTeam"
    Then I expect that element "snippetsTab" becomes displayed
    #------------------
    When I click on the element "snippetsTab"
    Then I expect that element "addNewCollectionBtn" becomes displayed
    When I click on the element "addNewCollectionBtn"
    Then I expect that element "newCollectionTitleInput" becomes displayed
    When I set "Test Collection for editing" to the inputfield "newCollectionTitleInput"
    And  I click on the element "newCollectionLanguagesInput"
    And  I set "all" to the inputfield "newCollectionLanguagesInput"
    And  I pause for 3000ms
    And  I press "Enter"
    Then I expect that element "newCollectionOtherLabelInput" becomes displayed
    When I click on the element "newCollectionOtherLabelInput"
    And  I set "Syntax" to the inputfield "newCollectionOtherLabelInput"
    And  I pause for 3000ms
    And  I press "Enter"
    And  I set "test author name" to the inputfield "newCollectionAuthorInput"
    And  I set "Source name test" to the inputfield "newCollectionSourceNameInput"
    And  I set "https://testSource.com" to the inputfield "newCollectionSourceLinkInput"
    When I set "Body text test" to the inputfield "newCollectionDescriptionInput"
    Then I expect that element "saveNewCollectionBtn" becomes displayed
    When I click on the button "saveNewCollectionBtn"
    Then I expect that new item "allCollectionsNames" is added to collections

    Then I expect that element "searchIconBtn" becomes displayed
    When I click on the button "searchIconBtn"
    And  I set "Test Collection for editing" to the inputfield "searchCollectionInput"
    Then I expect that element "threeDotsCollectionBtn" becomes displayed
    #  C2324
    When I click on the "1st" element "threeDotsCollectionBtn"
    Then I expect that element "editCollectionBtn" becomes displayed
    When I click on the element "editCollectionBtn"

    Then I expect that element "newCollectionTitleInput" becomes displayed
    When I set "Test Collection edited" to the inputfield "newCollectionTitleInput"
    And  I pause for 1000ms
    Then I expect that element "newCollectionLanguagesCleanInputBtn" becomes displayed
    And  I click on the element "newCollectionLanguagesCleanInputBtn"
    And  I pause for 1000ms
    Then I expect that element "newCollectionOtherLabelCleanInputBtn" becomes displayed
    When I click on the element "newCollectionOtherLabelCleanInputBtn"

    Then I expect that element "newCollectionLanguagesValue" becomes not displayed
    When I click on the element "newCollectionLanguagesInput"
    When I set "go" to the inputfield "newCollectionLanguagesInput"
    And  I pause for 3000ms
    When I press "Enter"
    Then I expect that element "newCollectionOtherLabelInput" becomes displayed
    When I click on the element "newCollectionOtherLabelInput"
    Then I expect that element "newCollectionOtherLabelValue" becomes not displayed

    And  I set "prop" to the inputfield "newCollectionOtherLabelInput"
    And  I pause for 2000ms
    When I press "Enter"
    And  I set "test author edit" to the inputfield "newCollectionAuthorInput"
    And  I set "Source name edit" to the inputfield "newCollectionSourceNameInput"
    And  I set "https://testSourceedit.com" to the inputfield "newCollectionSourceLinkInput"
    When I set "Body text test edit" to the inputfield "newCollectionDescriptionInput"
    Then I expect that element "saveNewCollectionBtn" becomes displayed
    When I click on the button "saveNewCollectionBtn"
    Then I expect that new item "allCollectionsNames" is added to collections

    Then I expect that element "searchIconBtn" becomes displayed
    When I click on the button "searchIconBtn"
    And  I set "Test Collection edited" to the inputfield "searchCollectionInput"
    Then I expect that element "threeDotsCollectionBtn" becomes displayed
    When I click on the "1st" element "threeDotsCollectionBtn"
    Then I expect that element "editCollectionBtn" becomes displayed
    When I click on the element "editCollectionBtn"

    Then I expect that element "newCollectionTitleInput" becomes displayed
    When I set "Test Finish Collection" with timestamp to the inputfield "newCollectionTitleInput"
    Then I expect that element "newCollectionLanguagesCleanInputBtn" becomes displayed
    And I expect that element "newCollectionLanguagesValue" becomes displayed
    And  I expect that element "newCollectionOtherLabelCleanInputBtn" becomes displayed
    And  I expect that element "newCollectionOtherLabelValue" becomes displayed

    And  I expect that element "newCollectionAuthorInput" matches the text "test author edit"
    And  I expect that element "newCollectionSourceNameInput" matches the text "Source name edit"
    And  I expect that element "newCollectionSourceLinkInput" matches the text "https://testSourceedit.com"
    Then I expect that element "saveNewCollectionBtn" becomes displayed
    When I click on the button "saveNewCollectionBtn"
    Then I expect that new item "allCollectionsNames" is added to collections

  @C2790 @smoke
  Scenario: Adding new snippet collection
    Then I expect that element "companyDropdown" becomes displayed
    When I click on the element "companyDropdown"
    Then I expect that element "semaCorporateOrganizationLogo" becomes displayed
    When I hover over element "semaCorporateOrganizationLogo"
    Then I expect that element "highlightedTeam" becomes displayed
    When I click on the element "highlightedTeam"

    When I click on the element "snippetsTab"
    Then I expect that element "addNewCollectionBtn" becomes displayed
    When I click on the element "addNewCollectionBtn"
    Then I expect that element "newCollectionTitleInput" becomes displayed
    When I set "Test Collection" with timestamp to the inputfield "newCollectionTitleInput"
    And  I click on the element "newCollectionLanguagesInput"
    And  I set "all" to the inputfield "newCollectionLanguagesInput"
    And  I pause for 3000ms
    And  I press "Enter"
    Then I expect that element "newCollectionOtherLabelInput" becomes displayed
    When I click on the element "newCollectionOtherLabelInput"
    And  I set "Syntax" to the inputfield "newCollectionOtherLabelInput"
    And  I pause for 3000ms
    And  I press "Enter"
    And  I set "test author name" to the inputfield "newCollectionAuthorInput"
    And  I set "Source name test" to the inputfield "newCollectionSourceNameInput"
    And  I set "https://testSource.com" to the inputfield "newCollectionSourceLinkInput"
    When I set "Body text test" to the inputfield "newCollectionDescriptionInput"
    Then I expect that element "saveNewCollectionBtn" becomes displayed
    When I click on the button "saveNewCollectionBtn"
    Then I expect that new item "allCollectionsNames" is added to collections

  @C2442
  Scenario: The default tags for collection is added to snippet
    Then I expect that element "companyDropdown" becomes displayed
    When I click on the element "companyDropdown"
    Then I expect that element "semaCorporateOrganizationLogo" becomes displayed
    When I hover over element "semaCorporateOrganizationLogo"
    Then I expect that element "highlightedTeam" becomes displayed
    When I click on the element "highlightedTeam"
    Then I expect that element "snippetsTab" becomes displayed

    When I click on the element "snippetsTab"
    Then I expect that element "addNewCollectionBtn" becomes displayed
    When I click on the element "addNewCollectionBtn"
    Then I expect that element "newCollectionTitleInput" becomes displayed
    When I set "Test Collection FOR TAGS " with timestamp to the inputfield "newCollectionTitleInput"
    And  I set "This collection is for creating snippets with same tag in as here" to the inputfield "newCollectionDescriptionInput"
    And  I set "Source name test" to the inputfield "newCollectionSourceNameInput"
    And  I set "https://testSource.com" to the inputfield "newCollectionSourceLinkInput"
    And  I set "test author name" to the inputfield "newCollectionAuthorInput"

    Then I expect that element "newCollectionOtherLabelInput" becomes displayed
    When I click on the element "newCollectionOtherLabelInput"
    And  I pause for 1000ms
    And  I set "Leader" to the inputfield "newCollectionOtherLabelInput"
    And  I pause for 3000ms
    And  I press "Enter"

    Then I expect that element "newCollectionLanguagesInput" becomes displayed
    When I click on the element "newCollectionLanguagesInput"
    And  I pause for 1000ms
    And  I set "all" to the inputfield "newCollectionLanguagesInput"
    And  I pause for 3000ms
    And  I press "Enter"

    And  I pause for 2000ms
    And  I click on the button "saveNewCollectionBtn"
    And  I pause for 4000ms
    Then I expect that element "searchIconBtn" becomes displayed
    When I click on the button "searchIconBtn"
    Then I expect that element "searchCollectionInput" becomes displayed

    And  I pause for 2000ms
    When I set saved variable to the inputfield "searchCollectionInput"
    Then I expect that element "firstInActiveCollectionName" becomes displayed
    And  I click on the element "firstInActiveCollectionName"
    Then I expect that element "addNewSnippetInCollectionBtn" becomes displayed
    When I click on the element "addNewSnippetInCollectionBtn"
    And  I pause for 4000ms
    Then I expect that element "selectedLeadershipTag" becomes displayed
    And  I expect that element "selectedAllLanguage" becomes displayed
    And  I expect that element "newSnippetTitleInput" becomes displayed
    And  I expect that element "newSnippetBodyInput" becomes displayed
    When I click on the element "newSnippetBodyInput"
    And  I pause for 1000ms
    And  I set "default tags" to the inputfield "newSnippetBodyInput"
    And  I click on the element "newSnippetTitleInput"
    And  I pause for 1000ms
    And  I set "Test Snippet with default tags " with timestamp to the inputfield "newSnippetTitleInput"
    And  I pause for 1000ms
    And  I set "https://testSource.com" to the inputfield "newSnippetSourceLinkInput"
    Then I expect that element "saveNewSnippetBtn" becomes displayed
    And  I pause for 3000ms
    When I click on the button "saveNewSnippetBtn"
    And  I pause for 2000ms
    Then I expect that element "allSnippetsNames" becomes displayed
    And  I expect that element "searchSnippetInput" becomes displayed
    When I search created snippet "searchSnippetInput"

    Then I expect that element "searchedSnippetsResult" does appear exactly "1" times
    And  I pause for 2000ms
    And  I expect that element "snippetsLanguage" matches the text "LEADERSHIP"
    And  I expect that element "snippetsLabel" matches the text "ALL"

  #      C2741  C2742
  @C2741
  Scenario: Field validation for creating collection
    Then I expect that element "companyDropdown" becomes displayed
    When I click on the element "companyDropdown"
    Then I expect that element "semaCorporateOrganizationLogo" becomes displayed
    When I hover over element "semaCorporateOrganizationLogo"
    Then I expect that element "highlightedTeam" becomes displayed
    When I click on the element "highlightedTeam"

    And  I click on the element "snippetsTab"
    Then I expect that element "addNewCollectionBtn" becomes displayed
    When I click on the element "addNewCollectionBtn"
    Then I expect that element "newCollectionTitleInput" becomes displayed
    And  I expect that element "saveNewCollectionBtn" becomes displayed
    When I click on the button "saveNewCollectionBtn"

    Then I expect that element "snippetCollectionTitleError" becomes displayed
    And  I expect that element "snippetCollectionTitleError" matches the text "Title is required"
    And  I expect that element "snippetCollectionLanguageError" matches the text "At least one label is required"
    And  I expect that element "snippetCollectionOtherError" matches the text "At least one label is required"
    And  I expect that element "snippetCollectionAuthorError" matches the text "Author is required"
    And  I expect that element "snippetCollectionSourceNameError" matches the text "Source Name is required"
    And  I expect that element "snippetCollectionLinkError" matches the text "Source Link is required"

    When I set "Test Collection" with timestamp to the inputfield "newCollectionTitleInput"
    And  I set "test author name" to the inputfield "newCollectionAuthorInput"
    And  I set "Source name test" to the inputfield "newCollectionSourceNameInput"
    And  I set "invalid url text" to the inputfield "newCollectionSourceLinkInput"
    When I click on the element "newCollectionLanguagesInput"
    And  I pause for 1000ms
    And  I set "java" to the inputfield "newCollectionLanguagesInput"
    And  I pause for 3000ms
    When I press "Enter"
    Then I expect that element "newCollectionOtherLabelInput" becomes displayed
    When I click on the element "newCollectionOtherLabelInput"
    And  I pause for 1000ms
    And  I set "Syntax" to the inputfield "newCollectionOtherLabelInput"
    And  I pause for 3000ms
    And  I press "Enter"

    Then I expect that element "snippetCollectionTitleError" becomes not displayed
    And  I expect that element "snippetCollectionLanguageError" becomes not displayed
    And  I expect that element "snippetCollectionOtherError" becomes not displayed
    And  I expect that element "snippetCollectionAuthorError" becomes not displayed
    And  I expect that element "snippetCollectionSourceNameError" becomes not displayed
    And  I expect that element "snippetCollectionLinkError" matches the text "Invalid URL"

    When I set "https://testSource.com" to the inputfield "newSnippetSourceLinkInput"
    Then I expect that element "snippetCollectionLinkError" becomes not displayed

#  @C2786
#  Scenario: Populate this collection to all users checkbox is marked
#    Then I expect that element "companyDropdown" becomes displayed
#    When I click on the element "companyDropdown"
#    Then I expect that element "semaCorporateOrganizationLogo" becomes displayed
#    When I hover over element "semaCorporateOrganizationLogo"
#    Then I expect that element "highlightedTeam" becomes displayed
    #    When I click on the element "highlightedTeam"
#
#    And  I click on the element "snippetsTab"
#    Then I expect that element "addNewCollectionBtn" becomes displayed
#    When I click on the element "addNewCollectionBtn"
#    Then I expect that element "newCollectionTitleInput" becomes displayed
#    When I set "Test Collection with marked" with timestamp to the inputfield "newCollectionTitleInput"
#    When I click on the element "newCollectionLanguagesInput"
#    And  I pause for 2000ms
#    And  I set "java" to the inputfield "newCollectionLanguagesInput"
#    Then I expect that element "firstOptionForLanguagesInput" becomes displayed
#    When I press "Enter"
#    Then I expect that element "newCollectionOtherLabelInput" becomes displayed
#    When I click on the element "newCollectionOtherLabelInput"
#    And  I pause for 2000ms
#    And  I set "Syntax" to the inputfield "newCollectionOtherLabelInput"
#    Then I expect that element "firstOptionForOtherLabelInput" becomes displayed
#    When I press "Enter"
#    And  I set "test author name" to the inputfield "newCollectionAuthorInput"
#    And  I set "Source name test" to the inputfield "newCollectionSourceNameInput"
#    And  I set "https://testSource.com" to the inputfield "newCollectionSourceLinkInput"
#    When I set "Body text test" to the inputfield "newCollectionDescriptionInput"
#    Then I expect that checkbox "newCollectionPopulateCheckBox" is checked
#
#    Then I expect that element "saveNewCollectionBtn" becomes displayed
#    When I click on the button "saveNewCollectionBtn"
#    Then I expect that new item "allCollectionsNames" is added to collections
#    #      logout       todo   acme login
#    When I click on the element "companyDropdown"
#    Then I expect that element "signOutBtn" becomes displayed
#    When I click on the element "signOutBtn"
#    Then I expect that element "confirmBtn" becomes displayed
#    And  I click on the element "confirmBtn"
#    Then I expect that element "signInWithGithubBtn" becomes displayed
#    #       login with acme
#    When I click on the button "signInWithGithubBtn"
#    And  I pause for 2000ms
#    And  I clear the inputfield "loginInput"
#    When I add "qateam+automationacme@semasoftware.com" to the inputfield "loginInput"
#    And  I clear the inputfield "passwordInput"
#    And  I add "Automation3Tester4#" to the inputfield "passwordInput"
#    And  I click on the button "signinBtn"
#    Then I expect that element "snippetsTab" becomes displayed
#    #      check added collection
#    When I click on the element "snippetsTab"
#    Then I expect that element "searchIconBtn" becomes displayed
#    When I click on the button "searchIconBtn"
#    And  I set saved variable to the inputfield "searchCollectionInput"
#    Then I expect that new item "allCollectionsNames" is added to collections

#  @C2786000
#  Scenario: Populate this collection to all users checkbox is not marked
#    Then I expect that element "companyDropdown" becomes displayed
#    When I click on the element "companyDropdown"
#    Then I expect that element "semaCorporateOrganizationLogo" becomes displayed
#    When I hover over element "semaCorporateOrganizationLogo"
#    Then I expect that element "highlightedTeam" becomes displayed
    #    When I click on the element "highlightedTeam"

#    And  I click on the element "snippetsTab"
#    Then I expect that element "addNewCollectionBtn" becomes displayed
#    When I click on the element "addNewCollectionBtn"
#    Then I expect that element "newCollectionTitleInput" becomes displayed
#    When I set "Test Collection with unmarked" with timestamp to the inputfield "newCollectionTitleInput"
#    And  I click on the element "newCollectionLanguagesInput"
#    And  I pause for 2000ms
#    And  I set "java" to the inputfield "newCollectionLanguagesInput"
#    Then I expect that element "firstOptionForLanguagesInput" becomes displayed
#    And  I press "Enter"
#    Then I expect that element "newCollectionOtherLabelInput" becomes displayed
#    When I click on the element "newCollectionOtherLabelInput"
#    And  I pause for 2000ms
#    And  I set "Syntax" to the inputfield "newCollectionOtherLabelInput"
#    Then I expect that element "firstOptionForOtherLabelInput" becomes displayed
#    When I press "Enter"
#    And  I set "test author name" to the inputfield "newCollectionAuthorInput"
#    When I set "Source name test" to the inputfield "newCollectionSourceNameInput"
#    And  I set "https://testSource.com" to the inputfield "newCollectionSourceLinkInput"
#    When I set "Body text test" to the inputfield "newCollectionDescriptionInput"
#    #      unmark checkbox
#    And  I expect that checkbox "newCollectionPopulateCheckBox" is checked
#    When I click on the element "newCollectionPopulateCheckBox"
#    Then I expect that checkbox "newCollectionPopulateCheckBox" is not checked
#
#    Then I expect that element "saveNewCollectionBtn" becomes displayed
#    When I click on the button "saveNewCollectionBtn"
#    Then I expect that new item "allCollectionsNames" is added to collections
#    #        logout     todo   acme login
#    When I click on the element "companyDropdown"
#    Then I expect that element "signOutBtn" becomes displayed
#    When I click on the element "signOutBtn"
#    Then I expect that element "confirmBtn" becomes displayed
#    And  I click on the element "confirmBtn"
#    Then I expect that element "signInWithGithubBtn" becomes displayed
#    When I delete all cookies
#    #         login with acme
#    And  I click on the button "signInWithGithubBtn"
#    Then I expect that element "loginInput" becomes displayed
#    When I clear the inputfield "loginInput"
#    And  I add "qateam+automationacme@semasoftware.com" to the inputfield "loginInput"
#    And  I clear the inputfield "passwordInput"
#    And  I add "Automation3Tester4#" to the inputfield "passwordInput"
#    And  I click on the button "signinBtn"
#    Then I expect that element "snippetsTab" becomes displayed
#    #        check added collection
#    When I click on the element "snippetsTab"
#    Then I expect that element "searchIconBtn" becomes displayed
#    When I click on the button "searchIconBtn"
#    And  I set saved variable to the inputfield "searchCollectionInput"
#    Then I expect that new item "allCollectionsNames" is not added to collections