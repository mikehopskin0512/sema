@repo
Feature: Portfolios

    @admin  @PTA71
    Scenario: Portfolios elements are displayed correctly
        Then I expect that element "trophyBtn" becomes displayed
        When I click on the element "trophyBtn"
        Then I expect that element "portfoliosUserName" becomes displayed
        And  I expect that element "portfoliosUserGitHubLink" becomes displayed
        And  I expect that element "portfoliosChangePersonalOverviewBtn" becomes displayed
        And  I expect that element "portfoliosPersonalOverview" becomes displayed

        When I click on the element "portfoliosChangePersonalOverviewBtn"
        Then I expect that element "portfoliosEditPersonalOverviewInput" becomes displayed
        And  I expect that element "portfoliosEditPersonalOverviewCloseBtn" becomes displayed
        And  I expect that element "portfoliosEditPersonalOverviewSaveBtn" becomes displayed
        And  I expect that element "portfoliosEditPersonalOverviewCancelBtn" becomes displayed

        When I click on the element "portfoliosEditPersonalOverviewCloseBtn"
        Then I expect that element "portfoliosEditPersonalOverviewInput" becomes not displayed

        When I click on the element "portfoliosChangePersonalOverviewBtn"
        Then I expect that element "portfoliosEditPersonalOverviewCancelBtn" becomes displayed

        When I click on the element "portfoliosEditPersonalOverviewCancelBtn"
        Then I expect that element "portfoliosEditPersonalOverviewInput" becomes not displayed

        When I click on the element "portfoliosUserGitHubLink"
        And  I pause for 2000ms
        And  I switch to opened tab
        Then I expect that the absolute url is "https://github.com/AndriyVivcharSema"

    @admin  @PTA71_2
    Scenario: Portfolios user data can be edited
        Then I expect that element "trophyBtn" becomes displayed
        When I click on the element "trophyBtn"
        And  I expect that element "portfoliosChangePersonalOverviewBtn" becomes displayed
        And  I expect that element "portfoliosPersonalOverview" becomes displayed
        And  I expect that element "portfoliosPersonalOverview" is empty

        When I click on the element "portfoliosChangePersonalOverviewBtn"
        Then I expect that element "portfoliosEditPersonalOverviewInput" becomes displayed
        When I set "description changed" to the inputfield "portfoliosEditPersonalOverviewInput"
        And  I click on the element "portfoliosEditPersonalOverviewSaveBtn"
        Then I expect that element "portfoliosEditPersonalOverviewInput" becomes not displayed
        And  I expect that element "portfoliosPersonalOverview" matches the text "description changed"

        When I click on the element "portfoliosChangePersonalOverviewBtn"
        Then I expect that element "portfoliosEditPersonalOverviewInput" becomes displayed
        When I clear the inputfield "portfoliosEditPersonalOverviewInput"
        And  I click on the element "portfoliosEditPersonalOverviewSaveBtn"
        Then I expect that element "portfoliosEditPersonalOverviewInput" becomes not displayed
        And  I expect that element "portfoliosPersonalOverview" is empty

    @admin  @PTA71_3
    Scenario: Snapshot can be saved for activity logs
        Then I expect that element "reposContainer" becomes displayed
        And  I expect that element "reposCards" becomes displayed
        When I click on the element "1stReposCard"
        Then I expect that element "dateRangeFilter" becomes displayed
        When I click on the element "dateRangeFilter"
        Then I expect that element "allTimeDateRange" becomes displayed
        When I click on the element "allTimeDateRange"
        And  I click on the element "dateRangeFilter"
        Then I expect that element "snapshotBtn" becomes displayed

        When I click on the element "snapshotBtn"
        Then I expect that element "saveSnapshotModal" becomes displayed
        And  I expect that element "saveSnapshotTitleInput" becomes displayed
        And  I expect that element "saveSnapshotDescriptionInput" becomes displayed
        And  I expect that element "saveSnapshotCommentsList" becomes displayed
        And  I expect that element "saveSnapshotCancelBtn" becomes displayed
        And  I expect that element "saveSnapshotSaveBtn" becomes displayed

        When I click on the element "saveSnapshotCancelBtn"
        Then I expect that element "saveSnapshotModal" becomes not displayed

        When I click on the element "snapshotBtn"
        Then I expect that element "saveSnapshotTitleInput" becomes displayed

        When I set "activity logs" with timestamp to the inputfield "saveSnapshotTitleInput"
        And  I set "activity logs - snapshot description" to the inputfield "saveSnapshotDescriptionInput"
        And  I click on the element "saveSnapshotSaveBtn"
        Then I expect that element "saveSnapshotModal" becomes not displayed
        And  I expect that element "trophyBtn" becomes displayed

        When I click on the element "trophyBtn"
        Then I expect that element "portfoliosSnapshotsBoard" becomes displayed
        And  I expect that new item "portfoliosSnapshotName" is added to portfolios
        And  I expect that element "portfoliosSnapshotDescription" matches the text "activity logs - snapshot description"

        When I click on the element "portfoliosSnapshotThreeDotsMenuBtn"
        Then I expect that element "portfoliosSnapshotDeleteBtn" becomes displayed

        When I click on the element "portfoliosSnapshotDeleteBtn"
        Then I expect that element "portfoliosDeleteSnapshotConfirmBtn" becomes displayed
        When I click on the element "portfoliosDeleteSnapshotConfirmBtn"
        Then I expect that element "portfoliosSnapshotsBoard" becomes not displayed

    @admin  @PTA71_4
    Scenario: Snapshot can be saved for code stats summaries
        Then I expect that element "reposContainer" becomes displayed
        And  I expect that element "reposCards" becomes displayed
        When I click on the element "1stReposCard"
        Then I expect that element "codeStatsTabBtn" becomes displayed
        When I click on the element "codeStatsTabBtn"
        Then I expect that element "dateRangeFilter" becomes displayed
        When I click on the element "dateRangeFilter"
        Then I expect that element "allTimeDateRange" becomes displayed
        When I click on the element "allTimeDateRange"
        And  I click on the element "dateRangeFilter"
        Then I expect that element "codeStatsSummariesSnapshotBtn" becomes displayed

        When I click on the element "codeStatsSummariesSnapshotBtn"
        Then I expect that element "saveSnapshotTitleInput" becomes displayed

        When I set "activity logs" with timestamp to the inputfield "saveSnapshotTitleInput"
        And  I set "activity logs - snapshot description" to the inputfield "saveSnapshotDescriptionInput"
        And  I click on the element "saveSnapshotSaveBtn"
        Then I expect that element "saveSnapshotModal" becomes not displayed
        And  I expect that element "trophyBtn" becomes displayed

        When I click on the element "trophyBtn"
        Then I expect that element "portfoliosSnapshotsBoard" becomes displayed
        And  I expect that new item "portfoliosSnapshotName" is added to portfolios
        And  I expect that element "portfoliosSnapshotDescription" matches the text "activity logs - snapshot description"

        When I click on the element "portfoliosSnapshotThreeDotsMenuBtn"
        Then I expect that element "portfoliosSnapshotDeleteBtn" becomes displayed

        When I click on the element "portfoliosSnapshotDeleteBtn"
        Then I expect that element "portfoliosDeleteSnapshotConfirmBtn" becomes displayed
        When I click on the element "portfoliosDeleteSnapshotConfirmBtn"
        Then I expect that element "portfoliosSnapshotsBoard" becomes not displayed

    @admin  @PTA71_5
    Scenario: Snapshot can be saved for code stats tags
        Then I expect that element "reposContainer" becomes displayed
        And  I expect that element "reposCards" becomes displayed
        When I click on the element "1stReposCard"
        Then I expect that element "codeStatsTabBtn" becomes displayed
        When I click on the element "codeStatsTabBtn"
        Then I expect that element "dateRangeFilter" becomes displayed
        When I click on the element "dateRangeFilter"
        Then I expect that element "allTimeDateRange" becomes displayed
        When I click on the element "allTimeDateRange"
        And  I click on the element "dateRangeFilter"
        Then I expect that element "codeStatsTagsSnapshotBtn" becomes displayed

        When I click on the element "codeStatsTagsSnapshotBtn"
        Then I expect that element "saveSnapshotTitleInput" becomes displayed

        When I set "activity logs" with timestamp to the inputfield "saveSnapshotTitleInput"
        And  I set "activity logs - snapshot description" to the inputfield "saveSnapshotDescriptionInput"
        And  I click on the element "saveSnapshotSaveBtn"
        Then I expect that element "saveSnapshotModal" becomes not displayed
        And  I expect that element "trophyBtn" becomes displayed

        When I click on the element "trophyBtn"
        Then I expect that element "portfoliosSnapshotsBoard" becomes displayed
        And  I expect that new item "portfoliosSnapshotName" is added to portfolios
        And  I expect that element "portfoliosSnapshotDescription" matches the text "activity logs - snapshot description"

        When I click on the element "portfoliosSnapshotThreeDotsMenuBtn"
        Then I expect that element "portfoliosSnapshotDeleteBtn" becomes displayed

        When I click on the element "portfoliosSnapshotDeleteBtn"
        Then I expect that element "portfoliosDeleteSnapshotConfirmBtn" becomes displayed
        When I click on the element "portfoliosDeleteSnapshotConfirmBtn"
        Then I expect that element "portfoliosSnapshotsBoard" becomes not displayed

    @admin  @PTA71_6
    Scenario: Snapshot can be edited in portfolios
        Then I expect that element "reposContainer" becomes displayed
        And  I expect that element "reposCards" becomes displayed
        When I click on the element "1stReposCard"
        Then I expect that element "dateRangeFilter" becomes displayed
        When I click on the element "dateRangeFilter"
        Then I expect that element "allTimeDateRange" becomes displayed
        When I click on the element "allTimeDateRange"
        And  I click on the element "dateRangeFilter"
        Then I expect that element "snapshotBtn" becomes displayed

        When I click on the element "snapshotBtn"
        Then I expect that element "saveSnapshotTitleInput" becomes displayed

        When I set "activity logs" with timestamp to the inputfield "saveSnapshotTitleInput"
        And  I set "activity logs - snapshot description" to the inputfield "saveSnapshotDescriptionInput"
        And  I click on the element "saveSnapshotSaveBtn"
        Then I expect that element "saveSnapshotModal" becomes not displayed
        And  I expect that element "trophyBtn" becomes displayed

        When I click on the element "trophyBtn"
        Then I expect that element "portfoliosSnapshotsBoard" becomes displayed
        And  I expect that new item "portfoliosSnapshotName" is added to portfolios
        And  I expect that element "portfoliosSnapshotDescription" matches the text "activity logs - snapshot description"

        When I click on the element "portfoliosSnapshotThreeDotsMenuBtn"
        Then I expect that element "portfoliosSnapshotEditBtn" becomes displayed

        When I click on the element "portfoliosSnapshotEditBtn"
        Then I expect that element "saveSnapshotTitleInput" becomes displayed

        When I clear the inputfield "saveSnapshotTitleInput"
        And  I clear the inputfield "saveSnapshotDescriptionInput"
        When I set "snapshot name updated" to the inputfield "saveSnapshotTitleInput"
        And  I set "snapshot description UPDATED" to the inputfield "saveSnapshotDescriptionInput"
        And  I click on the element "saveSnapshotSaveBtn"

        Then I expect that element "saveSnapshotTitleInput" becomes not displayed
        And  I expect that element "portfoliosSnapshotName" matches the text "snapshot name updated"
        And  I expect that element "portfoliosSnapshotDescription" matches the text "snapshot description UPDATED"

        When I click on the element "portfoliosSnapshotDeleteBtn"
        Then I expect that element "portfoliosDeleteSnapshotConfirmBtn" becomes displayed
        When I click on the element "portfoliosDeleteSnapshotConfirmBtn"
        Then I expect that element "portfoliosSnapshotsBoard" becomes not displayed