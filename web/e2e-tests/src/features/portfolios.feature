@portfolios @regression
Feature: Portfolios

  @PTA71_2
  Scenario: Portfolios user data can be edited
    Then I expect that element "trophyBtn" becomes displayed
    When I click on the element "trophyBtn"
    Then I expect that element "portfolioLibraryTab" becomes displayed
    And  I expect that element "addNewPortfolioBtn" becomes displayed
    When I click on the element "addNewPortfolioBtn"
    Then I expect that element "portfolioListNames" becomes displayed
    And  I pause for 2000ms
    When I click on the "1st" element "portfolioListNames"
    And  I expect that element "portfoliosChangePersonalOverviewBtn" becomes displayed

    When I click on the element "portfoliosChangePersonalOverviewBtn"
    Then I expect that element "portfoliosEditPersonalOverviewInput" becomes displayed
    When I click on the element "portfoliosEditPersonalOverviewInput"
    And  I add "description changed" to the inputfield "portfoliosEditPersonalOverviewInput"
    And  I click on the element "portfoliosEditPersonalOverviewSaveBtn"
    Then I expect that element "portfoliosEditPersonalOverviewInput" becomes not displayed
    And  I expect that element "portfoliosPersonalOverviewText" becomes displayed

    When I click on the element "portfoliosChangePersonalOverviewBtn"
    Then I expect that element "portfoliosEditPersonalOverviewInput" becomes displayed

    When I clear the inputfield "portfoliosEditPersonalOverviewInputText"
    And  I click on the element "portfoliosEditPersonalOverviewSaveBtn"
    Then I expect that element "portfoliosEditPersonalOverviewInput" becomes not displayed

  @PTA71_3
  Scenario: Snapshot can be saved for activity logs
    Then I expect that element "trophyBtn" becomes displayed
    When I click on the element "trophyBtn"

    Then I expect that element "portfolioLibraryTab" becomes displayed
    And  I expect that element "addNewPortfolioBtn" becomes displayed
    When I click on the element "addNewPortfolioBtn"
    Then I expect that element "portfolioListNames" becomes displayed
    And  I pause for 2000ms
    
    When I click on the element "reposTab"
    Then I expect that element "reposContainer" becomes displayed
    And  I pause for 3000ms
    And  I expect that element "1stReposCard" becomes displayed
    And  I pause for 1000ms
    When I click on the element "1stReposCard"
    And  I pause for 1000ms
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
    And  I click on the element "saveSnapshotDescriptionInput"
    And  I add "activity logs - snapshot description" to the inputfield "saveSnapshotDescriptionInput"
    And  I click on the element "saveSnapshotAddToPortfolio"
    And  I pause for 1000ms
    And  I press "ArrowDown"
    And  I press "Enter"
    Then I expect that element "saveSnapshotAddToPortfolio" not matches the text "None"
    When I click on the element "saveSnapshotSaveBtn"
    Then I expect that element "saveSnapshotModal" becomes not displayed
    And  I expect that element "saveSnapshotToPortfolioNotificationText" matches the text "Snapshot was added to your portfolio."
    And  I expect that element "saveSnapshotToPortfolioNotificationLink" becomes displayed
    When I click on the element "saveSnapshotToPortfolioNotificationLink"

    Then I expect that element "portfoliosUserName" becomes displayed
    And  I expect that element "portfoliosUserGitHubLink" becomes displayed
    And  I expect that element "portfoliosChangePersonalOverviewBtn" becomes displayed

    Then I expect that element "portfoliosSnapshotsBoard" becomes displayed
    And  I expect that new item "portfoliosSnapshotName" is added to portfolio
    And  I expect that element "portfoliosSnapshotDescription" becomes displayed
    And  I expect that element "portfoliosSnapshotDescription" matches the text "activity logs - snapshot description"

    When I click on the element "portfoliosSnapshotThreeDotsMenuBtn"
    Then I expect that element "portfoliosSnapshotDeleteBtn" becomes displayed

    When I click on the element "portfoliosSnapshotDeleteBtn"
    Then I expect that element "portfoliosDeleteSnapshotConfirmBtn" becomes displayed
    When I click on the element "portfoliosDeleteSnapshotConfirmBtn"
    Then I expect that element "portfoliosSnapshotsBoard" becomes not displayed

  @PTA71_5
  Scenario: Snapshot can be saved for code stats tags
    Then I expect that element "trophyBtn" becomes displayed
    When I click on the element "trophyBtn"

    Then I expect that element "portfolioLibraryTab" becomes displayed
    And  I expect that element "addNewPortfolioBtn" becomes displayed
    When I click on the element "addNewPortfolioBtn"
    Then I expect that element "portfolioListNames" becomes displayed
    And  I pause for 2000ms

    When I click on the element "reposTab"
    Then I expect that element "reposContainer" becomes displayed
    And  I pause for 3000ms
    And  I expect that element "1stReposCard" becomes displayed
    And  I pause for 1000ms
    When I click on the element "1stReposCard"
    And  I pause for 1000ms
    Then I expect that element "codeStatsTabBtn" becomes displayed
    When I click on the element "codeStatsTabBtn"
    Then I expect that element "dateRangeFilter" becomes displayed
    When I click on the element "dateRangeFilter"
    Then I expect that element "allTimeDateRange" becomes displayed
    When I click on the element "allTimeDateRange"
    Then I expect that element "codeStatsTagsSnapshotBtn" becomes displayed

    When I click on the element "codeStatsTagsSnapshotBtn"

    Then I expect that element "saveSnapshotModal" becomes displayed
    And  I expect that element "saveSnapshotTitleInput" becomes displayed
    And  I expect that element "saveSnapshotDescriptionInput" becomes displayed
    And  I expect that element "saveSnapshotTagsGraph" becomes displayed
    And  I expect that element "saveSnapshotCancelBtn" becomes displayed
    And  I expect that element "saveSnapshotSaveBtn" becomes displayed

    When I click on the element "saveSnapshotCancelBtn"
    Then I expect that element "saveSnapshotModal" becomes not displayed

    When I click on the element "snapshotBtn"
    Then I expect that element "saveSnapshotTitleInput" becomes displayed

    When I set "codeTags " with timestamp to the inputfield "saveSnapshotTitleInput"
    And  I click on the element "saveSnapshotDescriptionInput"
    And  I add "codeTags - snapshot description" to the inputfield "saveSnapshotDescriptionInput"
    And  I click on the element "saveSnapshotAddToPortfolio"
    And  I pause for 1000ms
    And  I press "ArrowDown"
    And  I press "Enter"
    Then I expect that element "saveSnapshotAddToPortfolio" not matches the text "None"
    When I click on the element "saveSnapshotSaveBtn"
    Then I expect that element "saveSnapshotModal" becomes not displayed
    And  I expect that element "saveSnapshotToPortfolioNotificationText" matches the text "Snapshot was added to your portfolio."
    And  I expect that element "saveSnapshotToPortfolioNotificationLink" becomes displayed
    When I click on the element "saveSnapshotToPortfolioNotificationLink"

    Then I expect that element "portfoliosUserName" becomes displayed
    And  I expect that element "portfoliosUserGitHubLink" becomes displayed
    And  I expect that element "portfoliosChangePersonalOverviewBtn" becomes displayed

    Then I expect that element "portfoliosSnapshotsBoard" becomes displayed
    And  I expect that new item "portfoliosSnapshotName" is added to portfolio
    And  I expect that element "portfoliosSnapshotVerticalDescription" becomes displayed
    And  I expect that element "portfoliosSnapshotVerticalDescription" matches the text "codeTags - snapshot description"

    When I click on the element "portfoliosSnapshotThreeDotsMenuBtn"
    Then I expect that element "portfoliosSnapshotDeleteBtn" becomes displayed

    When I click on the element "portfoliosSnapshotDeleteBtn"
    Then I expect that element "portfoliosDeleteSnapshotConfirmBtn" becomes displayed
    When I click on the element "portfoliosDeleteSnapshotConfirmBtn"
    Then I expect that element "portfoliosSnapshotsBoard" becomes not displayed

  @PTA71_4
  Scenario: Snapshot can be saved for code stats summaries
    Then I expect that element "trophyBtn" becomes displayed
    When I click on the element "trophyBtn"

    Then I expect that element "portfolioLibraryTab" becomes displayed
    And  I expect that element "addNewPortfolioBtn" becomes displayed
    When I click on the element "addNewPortfolioBtn"
    Then I expect that element "portfolioListNames" becomes displayed
    And  I pause for 2000ms

    When I click on the element "reposTab"
    Then I expect that element "reposContainer" becomes displayed
    And  I pause for 3000ms
    And  I expect that element "1stReposCard" becomes displayed
    And  I pause for 1000ms
    When I click on the element "1stReposCard"
    And  I pause for 1000ms
    Then I expect that element "codeStatsTabBtn" becomes displayed
    When I click on the element "codeStatsTabBtn"
    Then I expect that element "dateRangeFilter" becomes displayed
    When I click on the element "dateRangeFilter"
    Then I expect that element "allTimeDateRange" becomes displayed
    When I click on the element "allTimeDateRange"
    Then I expect that element "codeStatsSummariesSnapshotBtn" becomes displayed

    When I click on the element "codeStatsSummariesSnapshotBtn"

    Then I expect that element "saveSnapshotModal" becomes displayed
    And  I expect that element "saveSnapshotTitleInput" becomes displayed
    And  I expect that element "saveSnapshotDescriptionInput" becomes displayed
    And  I expect that element "saveSnapshotSummariesGraph" becomes displayed
    And  I expect that element "saveSnapshotCancelBtn" becomes displayed
    And  I expect that element "saveSnapshotSaveBtn" becomes displayed

    When I click on the element "saveSnapshotCancelBtn"
    Then I expect that element "saveSnapshotModal" becomes not displayed

    When I click on the element "snapshotBtn"
    Then I expect that element "saveSnapshotTitleInput" becomes displayed

    When I set "codeStats " with timestamp to the inputfield "saveSnapshotTitleInput"
    And  I click on the element "saveSnapshotDescriptionInput"
    And  I add "codeStats - snapshot description" to the inputfield "saveSnapshotDescriptionInput"
    And  I click on the element "saveSnapshotAddToPortfolio"
    And  I pause for 1000ms
    And  I press "ArrowDown"
    And  I press "Enter"
    Then I expect that element "saveSnapshotAddToPortfolio" not matches the text "None"
    When I click on the element "saveSnapshotSaveBtn"
    Then I expect that element "saveSnapshotModal" becomes not displayed
    And  I expect that element "saveSnapshotToPortfolioNotificationText" matches the text "Snapshot was added to your portfolio."
    And  I expect that element "saveSnapshotToPortfolioNotificationLink" becomes displayed
    When I click on the element "saveSnapshotToPortfolioNotificationLink"

    Then I expect that element "portfoliosUserName" becomes displayed
    And  I expect that element "portfoliosUserGitHubLink" becomes displayed
    And  I expect that element "portfoliosChangePersonalOverviewBtn" becomes displayed

    Then I expect that element "portfoliosSnapshotsBoard" becomes displayed
    And  I expect that new item "portfoliosSnapshotName" is added to portfolio
    And  I expect that element "portfoliosSnapshotVerticalDescription" becomes displayed
    And  I expect that element "portfoliosSnapshotVerticalDescription" matches the text "codeStats - snapshot description"

    When I click on the element "portfoliosSnapshotThreeDotsMenuBtn"
    Then I expect that element "portfoliosSnapshotDeleteBtn" becomes displayed

    When I click on the element "portfoliosSnapshotDeleteBtn"
    Then I expect that element "portfoliosDeleteSnapshotConfirmBtn" becomes displayed
    When I click on the element "portfoliosDeleteSnapshotConfirmBtn"
    Then I expect that element "portfoliosSnapshotsBoard" becomes not displayed

  @PTA71_6
  Scenario: Snapshot can be edited in portfolios
    Then I expect that element "trophyBtn" becomes displayed
    When I click on the element "trophyBtn"

    Then I expect that element "portfolioLibraryTab" becomes displayed
    And  I expect that element "addNewPortfolioBtn" becomes displayed
    When I click on the element "addNewPortfolioBtn"
    Then I expect that element "portfolioListNames" becomes displayed
    And  I pause for 2000ms

    When I click on the element "reposTab"
    Then I expect that element "reposContainer" becomes displayed
    And  I pause for 3000ms
    And  I expect that element "1stReposCard" becomes displayed
    And  I pause for 1000ms
    When I click on the element "1stReposCard"
    And  I pause for 1000ms
    Then I expect that element "dateRangeFilter" becomes displayed
    When I click on the element "dateRangeFilter"
    Then I expect that element "allTimeDateRange" becomes displayed
    When I click on the element "allTimeDateRange"
    And  I click on the element "dateRangeFilter"
    Then I expect that element "snapshotBtn" becomes displayed

    When I click on the element "snapshotBtn"
    Then I expect that element "saveSnapshotTitleInput" becomes displayed

    When I set "activity logs" with timestamp to the inputfield "saveSnapshotTitleInput"
    And  I click on the element "saveSnapshotDescriptionInput"
    And  I add "activity logs - snapshot description" to the inputfield "saveSnapshotDescriptionInput"
    And  I click on the element "saveSnapshotAddToPortfolio"
    And  I pause for 1000ms
    And  I press "ArrowDown"
    And  I press "Enter"
    Then I expect that element "saveSnapshotAddToPortfolio" not matches the text "None"
    When I click on the element "saveSnapshotSaveBtn"
    And  I expect that element "saveSnapshotToPortfolioNotificationText" matches the text "Snapshot was added to your portfolio."
    And  I expect that element "saveSnapshotToPortfolioNotificationLink" becomes displayed
    When I click on the element "saveSnapshotToPortfolioNotificationLink"

    Then I expect that element "portfoliosSnapshotThreeDotsMenuBtn" becomes displayed
    When I click on the element "portfoliosSnapshotThreeDotsMenuBtn"
    Then I expect that element "portfoliosSnapshotEditBtn" becomes displayed

    When I click on the element "portfoliosSnapshotEditBtn"
    Then I expect that element "saveSnapshotTitleInput" becomes displayed

    When I clear the inputfield "saveSnapshotTitleInput"
    And  I set "snapshot name updated" to the inputfield "saveSnapshotTitleInput"
    And  I click on the element "editSnapshotSaveBtn"

    Then I expect that element "saveSnapshotTitleInput" becomes not displayed
    And  I expect that element "portfoliosSnapshotName" matches the text "snapshot name updated"
    When I click on the element "portfoliosSnapshotThreeDotsMenuBtn"
    Then I expect that element "portfoliosSnapshotDeleteBtn" becomes displayed
    When I click on the element "portfoliosSnapshotDeleteBtn"
    Then I expect that element "portfoliosDeleteSnapshotConfirmBtn" becomes displayed
    When I click on the element "portfoliosDeleteSnapshotConfirmBtn"
    Then I expect that element "portfoliosSnapshotsBoard" becomes not displayed

  @PTA95 @smoke
  Scenario: Portfolio Manager elements are displayed correctly
    Then I expect that element "trophyBtn" becomes displayed
    When I click on the element "trophyBtn"

    Then I expect that element "portfolioLibraryTab" becomes displayed
    And  I expect that element "addNewPortfolioBtn" becomes displayed
    When I click on the element "addNewPortfolioBtn"
    Then I expect that element "portfolioListNames" becomes displayed
    And  I expect that element "portfolioListDates" becomes displayed
    And  I expect that element "portfolioListVisibility" becomes displayed
    And  I expect that element "portfolioListShareBtns" becomes displayed
    And  I expect that element "portfolioListThreeDotsBtns" becomes displayed
    When I click on the element "addNewPortfolioBtn"
    And  I click on the element "portfolioListThreeDotsBtns"
    Then I expect that element "portfolioListDuplicateBtn" becomes displayed

    When I click on the element "snapshotLibraryTab"
    Then I expect that element "portfolioLibraryTab" becomes displayed
    And  I expect that element "snapshotListTitles" becomes displayed
    And  I expect that element "snapshotListDates" becomes displayed
    And  I expect that element "snapshotListAddToPortfolioBtns" becomes displayed
    And  I expect that element "snapshotListThreeDotsBtns" becomes displayed
    When I click on the element "snapshotListThreeDotsBtns"
    Then I expect that element "snapshotListEditBtn" becomes displayed
    And  I expect that element "snapshotListDuplicateBtn" becomes displayed
    And  I expect that element "snapshotListDeleteBtn" becomes displayed

  @PTA96 @smoke
  Scenario: All portfolio can be removed from the list except one
    Then I expect that element "trophyBtn" becomes displayed
    When I click on the element "trophyBtn"

    Then I expect that element "portfolioLibraryTab" becomes displayed
    And  I expect that element "addNewPortfolioBtn" becomes displayed
    When I click on the element "addNewPortfolioBtn"
    And  I click on the element "addNewPortfolioBtn"
    Then I expect that element "portfolioListThreeDotsBtns" becomes displayed
    And  I remove all elements "portfolioListNames" with button "portfolioListDeleteBtn" under "portfolioListThreeDotsBtns" with confirmation "portfoliosDeleteSnapshotConfirmBtn"
    Then I expect that element "portfolioListNames" does appear exactly "1" times
    And  I expect that element "portfolioListThreeDotsBtns" becomes displayed
    When I click on the element "portfolioListThreeDotsBtns"
    Then I expect that element "portfolioListDuplicateBtn" becomes displayed
    And  I expect that element "portfolioListDeleteBtn" becomes not displayed

  @PTA71 @smoke
  Scenario: Portfolios elements are displayed correctly for portfolio without snapshots
    Then I expect that element "trophyBtn" becomes displayed
    When I click on the element "trophyBtn"

    Then I expect that element "portfolioLibraryTab" becomes displayed
    And  I expect that element "addNewPortfolioBtn" becomes displayed
    When I click on the element "addNewPortfolioBtn"
    Then I expect that element "portfolioListNames" becomes displayed
    And  I pause for 2000ms
    When I click on the "1st" element "portfolioListNames"
    Then I expect that element "portfoliosUserName" becomes displayed
    And  I expect that element "portfoliosUserGitHubLink" becomes displayed
    And  I expect that element "portfoliosChangePersonalOverviewBtn" becomes displayed

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
    And  I pause for 3000ms
    And  I switch to opened tab "https://github.com/SemaQAAutomationAdmin"
    Then I expect that the absolute url is "github.com/SemaQAAutomationAdmin"

  @PTA94     #https://semalab.atlassian.net/browse/EAST-1405
  Scenario: Portfolios elements can be duplicated
    Then I expect that element "trophyBtn" becomes displayed
    When I click on the element "trophyBtn"

    Then I expect that element "portfolioLibraryTab" becomes displayed
    And  I expect that element "addNewPortfolioBtn" becomes displayed
    When I click on the element "addNewPortfolioBtn"
    And  I pause for 3000ms
    Then I expect that element "portfolioListThreeDotsBtns" becomes displayed
    And  I remove all elements "portfolioListNames" with button "portfolioListDeleteBtn" under "portfolioListThreeDotsBtns" with confirmation "portfoliosDeleteSnapshotConfirmBtn"
    Then I expect that element "portfolioListNames" does appear exactly "1" times
    And  I expect that element "portfolioListThreeDotsBtns" becomes displayed

    When I click on the element "reposTab"
    Then I expect that element "reposContainer" becomes displayed
    And  I pause for 3000ms
    And  I expect that element "1stReposCard" becomes displayed
    And  I pause for 1000ms
    When I click on the element "1stReposCard"
    And  I pause for 1000ms
    Then I expect that element "dateRangeFilter" becomes displayed
    When I click on the element "dateRangeFilter"
    Then I expect that element "allTimeDateRange" becomes displayed
    When I click on the element "allTimeDateRange"
    And  I click on the element "dateRangeFilter"
    Then I expect that element "snapshotBtn" becomes displayed

    When I click on the element "snapshotBtn"
    Then I expect that element "saveSnapshotTitleInput" becomes displayed
    And  I expect that element "saveSnapshotDescriptionInput" becomes displayed

    When I set "activity logs" with timestamp to the inputfield "saveSnapshotTitleInput"
    And  I click on the element "saveSnapshotDescriptionInput"
    And  I add "activity logs - snapshot description" to the inputfield "saveSnapshotDescriptionInput"
    And  I click on the element "saveSnapshotAddToPortfolio"
    And  I pause for 1000ms
    And  I press "ArrowDown"
    And  I press "Enter"
    Then I expect that element "saveSnapshotAddToPortfolio" not matches the text "None"
    When I click on the element "saveSnapshotSaveBtn"
    And  I expect that element "saveSnapshotToPortfolioNotificationText" matches the text "Snapshot was added to your portfolio."
    And  I expect that element "saveSnapshotToPortfolioNotificationLink" becomes displayed
    When I click on the element "saveSnapshotToPortfolioNotificationLink"


    Then I expect that element "portfoliosSnapshotsBoard" becomes displayed
    And  I expect that new item "portfoliosSnapshotName" is added to portfolio
    And  I expect that element "portfoliosSnapshotDescription" becomes displayed
    And  I expect that element "portfoliosSnapshotDescription" matches the text "activity logs - snapshot description"

    Then I expect that element "trophyBtn" becomes displayed
    When I click on the element "trophyBtn"

    Then I expect that element "portfolioListNames" becomes displayed
    And  I expect that element "addNewPortfolioBtn" becomes displayed
    And  I expect that element "portfolioListThreeDotsBtns" becomes displayed
    When I save the text of element "portfolioListNames"
    And  I pause for 3000ms
    And  I click on the element "portfolioListThreeDotsBtns"
    Then I expect that element "portfolioListDuplicateBtn" becomes displayed
    When I click on the element "portfolioListDuplicateBtn"
    And  I pause for 20000ms
    Then I expect that element "portfolioListNames" does appear exactly "2" times
    And  I expect that "2nd" element "portfolioListNames" matches the saved variable with text "_Copy"
    When I click on the "2nd" element "portfolioListNames"
    Then I expect that element "portfoliosSnapshotsBoard" becomes displayed
    And  I expect that element "portfoliosSnapshotDescription" becomes displayed
    And  I expect that element "portfoliosSnapshotDescription" matches the text "activity logs - snapshot description"