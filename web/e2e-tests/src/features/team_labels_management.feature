@team_labels_management  @regression
Feature: Team Labels Management

    @PTA88  @smoke
    Scenario: Label Management elements are displayed correctly
        Then I expect that element "userLogo" becomes displayed
        When I click on the element "userLogo"
        Then I expect that element "semaCorporateTeamLogo" becomes displayed
        When I click on the element "semaCorporateTeamLogo"
        Then I expect that element "viewAllTeamMembersBtn" becomes displayed
        When I click on the element "viewAllTeamMembersBtn"
        Then I expect that element "teamLabelsManagementTab" becomes displayed
        When I click on the element "teamLabelsManagementTab"
        Then I expect that element "searchLabelsInput" becomes displayed
        And  I expect that element "languageFilterCheckBox" becomes displayed
        And  I expect that element "otherLabelsFilterCheckBox" becomes displayed
        And  I expect that element "addLabelsBtn" becomes displayed
        And  I expect that element "labelsTable" becomes displayed
        And  I expect that element "labelsTable1stRow" becomes displayed
        And  I expect that element "threeDots1stRowBtn" becomes displayed
        And  I expect that element "teamManagementTab" becomes displayed
        And  I expect that element "editTeamProfileBtn" becomes displayed

    @PTA88_2  @smoke    #https://semalab.atlassian.net/browse/EAST-1344
    Scenario: Sema member can create new label for Language category
        Then I expect that element "userLogo" becomes displayed
        When I click on the element "userLogo"
        Then I expect that element "semaCorporateTeamLogo" becomes displayed
        When I click on the element "semaCorporateTeamLogo"
        Then I expect that element "viewAllTeamMembersBtn" becomes displayed
        When I click on the element "viewAllTeamMembersBtn"
        Then I expect that element "teamLabelsManagementTab" becomes displayed
        When I click on the element "teamLabelsManagementTab"
        Then I expect that element "addLabelsBtn" becomes displayed
        When I click on the element "addLabelsBtn"
        Then I expect that element "newLabelNameInput" becomes displayed
        And  I expect that element "newLabelLanguageCategoryRadioBtn" becomes displayed
        And  I expect that element "newLabelOtherLabelsCategoryRadioBtn" becomes displayed
        And  I expect that element "newLabelAddAnotherLabelBtn" becomes displayed
        And  I expect that element "newLabelCancelBtn" becomes displayed
        And  I expect that element "newLabelArrowBackBtn" becomes displayed
        And  I expect that element "labelManagementLinkBtn" becomes displayed

        When I set "TEST LANGUAGE LABEL" with timestamp to the inputfield "newLabelNameInput"
        And  I click on the element "newLabelLanguageCategoryRadioBtn"
        Then  I expect that element "newLabelSaveBtn" becomes displayed
        When I click on the element "newLabelSaveBtn"

        Then I expect that element "labelNotificationText" matches the text "Labels added successfully!"
        And  I expect that element "searchLabelsInput" becomes displayed
        When I set saved variable to the inputfield "searchLabelsInput"
        Then I expect that element "labelsTable1stRowLabelName" matches the saved variable
        And  I expect that element "labelsTable1stRowLabelCategory" matches the text "Language"
        And  I expect that element "labelsTable1stRowLabelSnippets" matches the text "0"

    @PTA88_3   #https://semalab.atlassian.net/browse/EAST-1344
    Scenario: Sema member can create new label for Other labels category
        Then I expect that element "userLogo" becomes displayed
        When I click on the element "userLogo"
        Then I expect that element "semaCorporateTeamLogo" becomes displayed
        When I click on the element "semaCorporateTeamLogo"
        Then I expect that element "viewAllTeamMembersBtn" becomes displayed
        When I click on the element "viewAllTeamMembersBtn"
        Then I expect that element "teamLabelsManagementTab" becomes displayed
        When I click on the element "teamLabelsManagementTab"
        Then I expect that element "addLabelsBtn" becomes displayed
        When I click on the element "addLabelsBtn"
        Then I expect that element "newLabelNameInput" becomes displayed

        When I set "TEST OTHER LABELS " with timestamp to the inputfield "newLabelNameInput"
        And  I click on the element "newLabelOtherLabelsCategoryRadioBtn"
        And  I expect that element "newLabelSaveBtn" becomes displayed
        And  I click on the element "newLabelSaveBtn"

        Then I expect that element "labelNotificationText" matches the text "Labels added successfully!"
        And  I expect that element "searchLabelsInput" becomes displayed
        When I set saved variable to the inputfield "searchLabelsInput"
        Then I expect that element "labelsTable1stRowLabelName" matches the saved variable
        And  I expect that element "labelsTable1stRowLabelCategory" matches the text "Guide"
        And  I expect that element "labelsTable1stRowLabelSnippets" matches the text "0"

    @PTA88_4   #https://semalab.atlassian.net/browse/EAST-1288
    Scenario: Sema member can go back to the team from Add labels page by back arrow and Label Management link
        Then I expect that element "userLogo" becomes displayed
        When I click on the element "userLogo"
        Then I expect that element "semaCorporateTeamLogo" becomes displayed
        When I click on the element "semaCorporateTeamLogo"
        Then I expect that element "viewAllTeamMembersBtn" becomes displayed
        When I click on the element "viewAllTeamMembersBtn"
        Then I expect that element "teamLabelsManagementTab" becomes displayed
        When I click on the element "teamLabelsManagementTab"
        Then I expect that element "addLabelsBtn" becomes displayed
        When I click on the element "addLabelsBtn"
        Then I expect that element "newLabelArrowBackBtn" becomes displayed
        When I click on the element "newLabelArrowBackBtn"
        Then I expect that element "teamManagementTab" becomes displayed
        And  I expect that element "addLabelsBtn" becomes displayed

        When I click on the element "addLabelsBtn"
        Then I expect that element "labelManagementLinkBtn" becomes displayed
        When I click on the element "labelManagementLinkBtn"
        Then I expect that element "teamManagementTab" becomes displayed
        And  I expect that element "addLabelsBtn" becomes displayed

    @PTA88_5
    Scenario: Sema member can create several label simultaneously
        Then I expect that element "userLogo" becomes displayed
        When I click on the element "userLogo"
        Then I expect that element "semaCorporateTeamLogo" becomes displayed
        When I click on the element "semaCorporateTeamLogo"
        Then I expect that element "viewAllTeamMembersBtn" becomes displayed
        When I click on the element "viewAllTeamMembersBtn"
        Then I expect that element "teamLabelsManagementTab" becomes displayed
        When I click on the element "teamLabelsManagementTab"
        Then I expect that element "addLabelsBtn" becomes displayed
        When I click on the element "addLabelsBtn"
        Then I expect that element "newLabelNameInput" becomes displayed
        And  I expect that element "newLabelAddAnotherLabelBtn" becomes displayed
        When I click on the element "newLabelAddAnotherLabelBtn"
        Then I expect that element "newLabelNameInput" does appear exactly "2" times
        And  I expect that element "newLabelRemoveNotAddedLabelBtn" does appear exactly "1" times
        When I click on the element "newLabelAddAnotherLabelBtn"
        Then I expect that element "newLabelNameInput" does appear exactly "3" times
        And  I expect that element "newLabelRemoveNotAddedLabelBtn" does appear exactly "2" times

        When I click on the element "newLabelRemoveNotAddedLabelBtn"
        Then I expect that element "newLabelNameInput" does appear exactly "2" times
        And  I expect that element "newLabelRemoveNotAddedLabelBtn" does appear exactly "1" times

        When I set "multipleLabel " with timestamp to the 1st inputfield "newLabelNameInput"
        And  I set "secondMultipleLabel " with timestamp to the 2nd inputfield "newLabelNameInput"

        Then I expect that element "newLabelSaveBtn" becomes displayed
        When I click on the element "newLabelSaveBtn"
        Then I expect that element "labelNotificationText" matches the text "Labels added successfully!"
        And  I expect that element "searchLabelsInput" becomes displayed
        When I clear the inputfield "searchLabelsInput"
        And  I set 1st created label name to the inputfield "searchLabelsInput"
        Then I expect that element "labelsTable1stRowLabelName" becomes displayed
        And  I expect 1st created label element "labelsTable1stRowLabelName" becomes displayed
        When I clear the inputfield "searchLabelsInput"
        And  I set 2nd created label name to the inputfield "searchLabelsInput"
        Then I expect that element "labelsTable1stRowLabelName" becomes displayed
        And  I expect 2nd created label element "labelsTable1stRowLabelName" becomes displayed

    @PTA88_6
    Scenario: Sema member can see error messages for creating new label
        Then I expect that element "userLogo" becomes displayed
        When I click on the element "userLogo"
        Then I expect that element "semaCorporateTeamLogo" becomes displayed
        When I click on the element "semaCorporateTeamLogo"
        Then I expect that element "viewAllTeamMembersBtn" becomes displayed
        When I click on the element "viewAllTeamMembersBtn"
        Then I expect that element "teamLabelsManagementTab" becomes displayed
        When I click on the element "teamLabelsManagementTab"
        Then I expect that element "addLabelsBtn" becomes displayed
        When I click on the element "addLabelsBtn"
        Then I expect that element "newLabelNameInput" becomes displayed
        And  I expect that element "newLabelSaveBtn" becomes displayed
        When I click on the element "newLabelSaveBtn"
        Then I expect that element "labelNameErrorMessage" becomes displayed
        And  I expect that element "labelNameErrorMessage" matches the text "Label name is required!"

        When I click on the element "newLabelAddAnotherLabelBtn"
        And  I click on the element "newLabelSaveBtn"
        Then I expect that element "labelNameErrorMessage" does appear exactly "2" times
        When I set "invalid name" with timestamp to the 1st inputfield "newLabelNameInput"
        And  I click on the element "newLabelSaveBtn"
        Then I expect that element "labelNameErrorMessage" does appear exactly "1" times
        And  I expect that element "labelNameErrorMessage" matches the text "Label name is required!"

    @PTA90   #https://semalab.atlassian.net/browse/EAST-1344
    Scenario: Sema member can remove label in Label Management table
        Then I expect that element "userLogo" becomes displayed
        When I click on the element "userLogo"
        Then I expect that element "semaCorporateTeamLogo" becomes displayed
        When I click on the element "semaCorporateTeamLogo"
        Then I expect that element "viewAllTeamMembersBtn" becomes displayed
        When I click on the element "viewAllTeamMembersBtn"
        Then I expect that element "teamLabelsManagementTab" becomes displayed
        When I click on the element "teamLabelsManagementTab"
        Then I expect that element "addLabelsBtn" becomes displayed
        When I click on the element "addLabelsBtn"
        Then I expect that element "newLabelNameInput" becomes displayed

        When I set "TEST LANGUAGE LABEL" with timestamp to the inputfield "newLabelNameInput"
        And  I click on the element "newLabelLanguageCategoryRadioBtn"
        And  I expect that element "newLabelSaveBtn" becomes displayed
        And  I click on the element "newLabelSaveBtn"

        Then I expect that element "labelNotificationText" matches the text "Labels added successfully!"
        And  I expect that element "labelNotificationCloseBtn" becomes displayed
        When I click on the element "labelNotificationCloseBtn"
        Then I expect that element "searchLabelsInput" becomes displayed
        When I set saved variable to the inputfield "searchLabelsInput"
        And  I pause for 3000ms
        Then I expect that element "labelsTable1stRowLabelName" matches the saved variable
        And  I expect that element "threeDots1stRowBtn" becomes displayed
        When I click on the element "threeDots1stRowBtn"
        Then I expect that element "deleteLabelBtn" becomes displayed

        When I click on the element "deleteLabelBtn"
        Then I expect that element "labelNotificationText" matches the text "Label deleted successfully"
        And  I expect that element "searchLabelsInput" becomes displayed
        When I set saved variable to the inputfield "searchLabelsInput"
        Then I expect that element "labelsTable1stRowLabelName" becomes not displayed
        And  I expect that element "noTagsFoundMessage" becomes displayed

    @PTA89
    Scenario: Sema member can edit label in use in Label Management table
        Then I expect that element "userLogo" becomes displayed
        When I click on the element "userLogo"
        Then I expect that element "semaCorporateTeamLogo" becomes displayed
        When I click on the element "semaCorporateTeamLogo"
        Then I expect that element "viewAllTeamMembersBtn" becomes displayed
        When I click on the element "viewAllTeamMembersBtn"
        Then I expect that element "teamLabelsManagementTab" becomes displayed
        When I click on the element "teamLabelsManagementTab"
        Then I expect that element "searchLabelsInput" becomes displayed
        When I set "Test Coverage" to the inputfield "searchLabelsInput"
        And  I pause for 3000ms
        Then I expect that element "labelsTable1stRowLabelName" matches the text "TEST COVERAGE"
        And  I expect that element "threeDots1stRowBtn" becomes displayed
        When I click on the element "threeDots1stRowBtn"
        Then I expect that element "editLabelBtn" becomes displayed
        When I click on the element "editLabelBtn"
        Then I expect that element "newLabelNameInput" becomes displayed
        And  I expect that element "newLabelLanguageCategoryRadioBtn" becomes displayed
        And  I expect that element "newLabelOtherLabelsCategoryRadioBtn" becomes displayed
        And  I expect that element "newLabelSaveBtn" becomes displayed
        And  I expect that element "newLabelCancelBtn" becomes displayed
        And  I expect that element "editLabelSearchSnippetInput" becomes displayed
        And  I expect that element "editLabelAddedOnTable" becomes displayed
        And  I expect that element "editLabelAddedOn1stRowName" becomes displayed
        And  I expect that element "editLabelAddedOn1stRowToggle" becomes displayed
        
        When I click on the element "newLabelLanguageCategoryRadioBtn"
        And  I click on the element "newLabelSaveBtn"
        Then I expect that element "labelNotificationText" matches the text "Label updated successfully"
        And  I expect that element "searchLabelsInput" becomes displayed

        When I set "Test Coverage" to the inputfield "searchLabelsInput"
        And  I pause for 3000ms
        Then I expect that element "labelsTable1stRowLabelName" matches the text "TEST COVERAGE"
        And  I expect that element "labelsTable1stRowLabelCategory" matches the text "Language"
        And  I expect that element "labelsTable1stRowLabelSnippets" not matches the text "0"
        And  I expect that element "threeDots1stRowBtn" becomes displayed
        When I click on the element "threeDots1stRowBtn"
        Then I expect that element "editLabelBtn" becomes displayed
        When I click on the element "editLabelBtn"
        Then I expect that element "newLabelOtherLabelsCategoryRadioBtn" becomes displayed
        When I click on the element "newLabelOtherLabelsCategoryRadioBtn"
        And  I click on the element "newLabelSaveBtn"
        Then I expect that element "labelNotificationText" matches the text "Label updated successfully"
        And  I expect that element "searchLabelsInput" becomes displayed

        When I set "Test Coverage" to the inputfield "searchLabelsInput"
        And  I pause for 3000ms
        Then I expect that element "labelsTable1stRowLabelName" matches the text "TEST COVERAGE"
        And  I expect that element "labelsTable1stRowLabelCategory" matches the text "Guide"
        And  I expect that element "labelsTable1stRowLabelSnippets" not matches the text "0"

    @PTA89_2  #https://semalab.atlassian.net/browse/EAST-1344
    Scenario: Sema member can edit new label in Label Management table
        Then I expect that element "userLogo" becomes displayed
        When I click on the element "userLogo"
        Then I expect that element "semaCorporateTeamLogo" becomes displayed
        When I click on the element "semaCorporateTeamLogo"
        Then I expect that element "viewAllTeamMembersBtn" becomes displayed
        When I click on the element "viewAllTeamMembersBtn"
        Then I expect that element "teamLabelsManagementTab" becomes displayed
        When I click on the element "teamLabelsManagementTab"
        Then I expect that element "addLabelsBtn" becomes displayed
        When I click on the element "addLabelsBtn"
        Then I expect that element "newLabelNameInput" becomes displayed
        #create new label
        When I set "EDIT TEST LABELS " with timestamp to the inputfield "newLabelNameInput"
        And  I click on the element "newLabelOtherLabelsCategoryRadioBtn"
        And  I expect that element "newLabelSaveBtn" becomes displayed
        And  I click on the element "newLabelSaveBtn"
        #search new label
        Then I expect that element "labelNotificationText" matches the text "Labels added successfully!"
        And  I expect that element "searchLabelsInput" becomes displayed
        When I set saved variable to the inputfield "searchLabelsInput"
        Then I expect that element "labelsTable1stRowLabelName" becomes displayed
        And  I expect that element "labelsTable1stRowLabelName" matches the saved variable
        And  I expect that element "labelsTable1stRowLabelSnippets" matches the text "0"
        And  I expect that element "threeDots1stRowBtn" becomes displayed
        When I click on the element "threeDots1stRowBtn"
        Then I expect that element "editLabelBtn" becomes displayed
        When I click on the element "editLabelBtn"
        #edit new label
        When I click on the element "newLabelLanguageCategoryRadioBtn"
        And  I click on the element "newLabelSaveBtn"
        Then I expect that element "labelNotificationText" matches the text "Label updated successfully"
        And  I expect that element "searchLabelsInput" becomes displayed
        When I set saved variable to the inputfield "searchLabelsInput"
        Then I expect that element "labelsTable1stRowLabelName" matches the saved variable
        And  I expect that element "labelsTable1stRowLabelCategory" matches the text "Language"
        And  I expect that element "labelsTable1stRowLabelSnippets" matches the text "0"

    @PTA89_3
    Scenario: Sema member can remove label from the snippet during editing in Label Management table
        Then I expect that element "userLogo" becomes displayed
        When I click on the element "userLogo"
        Then I expect that element "semaCorporateTeamLogo" becomes displayed
        When I click on the element "semaCorporateTeamLogo"
        Then I expect that element "viewAllTeamMembersBtn" becomes displayed
        When I click on the element "viewAllTeamMembersBtn"
        Then I expect that element "teamLabelsManagementTab" becomes displayed
        When I click on the element "teamLabelsManagementTab"
        Then I expect that element "searchLabelsInput" becomes displayed
        When I set "All" to the inputfield "searchLabelsInput"
        And  I pause for 3000ms
        Then I expect that element "labelsTable1stRowLabelName" matches the text "ALL"
        And  I expect that element "threeDots1stRowBtn" becomes displayed
        When I click on the element "threeDots1stRowBtn"
        Then I expect that element "editLabelBtn" becomes displayed
        When I click on the element "editLabelBtn"
        Then I expect that element "newLabelNameInput" becomes displayed
        And  I expect that element "editLabelAddedOnTable" becomes displayed
        And  I expect that element "editLabelAddedOn1stRowToggle" becomes displayed
        When I click on the element "editLabelAddedOn1stRowToggle"
        Then I expect that element "labelNotificationText" matches the text "Successfully removed tag from this snippet!"
        And  I expect that element "labelNotificationCloseBtn" becomes displayed
        When I click on the element "labelNotificationCloseBtn"
        Then I expect that element "labelNotificationText" becomes not displayed
        When I click on the element "editLabelAddedOn1stRowToggle"
        Then I expect that element "labelNotificationText" matches the text "Successfully added tag to this snippet!"

    @PTA89_4
    Scenario: Sema member can remove label from the snippet during editing in Label Management table
        Then I expect that element "userLogo" becomes displayed
        When I click on the element "userLogo"
        Then I expect that element "semaCorporateTeamLogo" becomes displayed
        When I click on the element "semaCorporateTeamLogo"
        Then I expect that element "viewAllTeamMembersBtn" becomes displayed
        When I click on the element "viewAllTeamMembersBtn"
        Then I expect that element "teamLabelsManagementTab" becomes displayed
        When I click on the element "teamLabelsManagementTab"
        Then I expect that element "searchLabelsInput" becomes displayed
        When I set "All" to the inputfield "searchLabelsInput"
        And  I pause for 3000ms
        Then I expect that element "labelsTable1stRowLabelName" matches the text "ALL"
        When I save the text of element "labelsTable1stRowLabelSnippets"
        And  I expect that element "threeDots1stRowBtn" becomes displayed
        When I click on the element "threeDots1stRowBtn"
        Then I expect that element "editLabelBtn" becomes displayed
        When I click on the element "editLabelBtn"
        Then I expect that element "editLabelAddedOnTable" becomes displayed
        And  I expect that element "editLabelAddedOn1stRowToggle" becomes displayed
        When I click on the element "editLabelAddedOn1stRowToggle"
        Then I expect that element "labelNotificationText" matches the text "Successfully removed tag from this snippet!"
        And  I expect that element "labelNotificationCloseBtn" becomes displayed
        When I click on the element "labelNotificationCloseBtn"
        Then I expect that element "labelNotificationCloseBtn" becomes not displayed
        And  I expect that element "newLabelSaveBtn" becomes displayed
        When I click on the element "newLabelSaveBtn"
        Then I expect that element "labelNotificationText" matches the text "Label updated successfully"
        And  I expect that element "searchLabelsInput" becomes displayed
        When I set "All" to the inputfield "searchLabelsInput"
        And  I pause for 3000ms
        Then I expect that element "labelsTable1stRowLabelName" matches the text "ALL"
        And  I expect that button "labelsTable1stRowLabelSnippets" not matches the saved variable

    @PTA89_5    #https://semalab.atlassian.net/browse/EAST-1288
    Scenario: Sema member can go back to the team from Edit label page by back arrow and Label Management link
        Then I expect that element "userLogo" becomes displayed
        When I click on the element "userLogo"
        Then I expect that element "semaCorporateTeamLogo" becomes displayed
        When I click on the element "semaCorporateTeamLogo"
        Then I expect that element "viewAllTeamMembersBtn" becomes displayed
        When I click on the element "viewAllTeamMembersBtn"
        Then I expect that element "teamLabelsManagementTab" becomes displayed
        When I click on the element "teamLabelsManagementTab"
        And  I pause for 2000ms
        Then I expect that element "threeDots1stRowBtn" becomes displayed
        When I click on the element "threeDots1stRowBtn"
        Then I expect that element "editLabelBtn" becomes displayed
        When I click on the element "editLabelBtn"
        Then I expect that element "newLabelArrowBackBtn" becomes displayed
        When I click on the element "newLabelArrowBackBtn"
        And  I pause for 2000ms
        Then I expect that element "teamManagementTab" becomes displayed
        And  I expect that element "threeDots1stRowBtn" becomes displayed
        When I click on the element "threeDots1stRowBtn"
        Then I expect that element "editLabelBtn" becomes displayed
        When I click on the element "editLabelBtn"

        Then I expect that element "labelManagementLinkBtn" becomes displayed
        When I click on the element "labelManagementLinkBtn"
        Then I expect that element "teamManagementTab" becomes displayed
        And  I expect that element "addLabelsBtn" becomes displayed