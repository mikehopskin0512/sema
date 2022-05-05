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

    @PTA88_2  @smoke
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
        And  I expect that element "newLabelSaveBtn" becomes displayed
        And  I expect that element "newLabelCancelBtn" becomes displayed
        And  I expect that element "newLabelArrowBackBtn" becomes displayed
        And  I expect that element "labelManagementLinkBtn" becomes displayed

        When I set "TEST LANGUAGE LABEL" with timestamp to the inputfield "newLabelNameInput"
        And  I click on the element "newLabelLanguageCategoryRadioBtn"
        And  I click on the element "newLabelSaveBtn"

        Then I expect that element "labelNotificationText" matches the text "Labels added successfully!"
        And  I expect that element "searchLabelsInput" becomes displayed
        When I set saved variable to the inputfield "searchLabelsInput"
        Then I expect that element "labelsTable1stRowLabelName" matches the saved variable
        And  I expect that element "labelsTable1stRowLabelCategory" matches the text "Language"
        And  I expect that element "labelsTable1stRowLabelSnippets" matches the text "0"

    @PTA88_3
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
        And  I expect that element "newLabelLanguageCategoryRadioBtn" becomes displayed
        And  I expect that element "newLabelOtherLabelsCategoryRadioBtn" becomes displayed
        And  I expect that element "newLabelAddAnotherLabelBtn" becomes displayed
        And  I expect that element "newLabelSaveBtn" becomes displayed
        And  I expect that element "newLabelCancelBtn" becomes displayed
        And  I expect that element "newLabelArrowBackBtn" becomes displayed
        And  I expect that element "labelManagementLinkBtn" becomes displayed

        When I set "TEST OTHER LABELS " with timestamp to the inputfield "newLabelNameInput"
        And  I click on the element "newLabelOtherLabelsCategoryRadioBtn"
        And  I click on the element "newLabelSaveBtn"

        Then I expect that element "labelNotificationText" matches the text "Labels added successfully!"
        And  I expect that element "searchLabelsInput" becomes displayed
        When I set saved variable to the inputfield "searchLabelsInput"
        Then I expect that element "labelsTable1stRowLabelName" matches the saved variable
        And  I expect that element "labelsTable1stRowLabelCategory" matches the text "Guide"
        And  I expect that element "labelsTable1stRowLabelSnippets" matches the text "0"