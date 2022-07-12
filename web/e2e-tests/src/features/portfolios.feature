@portfolios @regression
Feature: Portfolios

  @PTA71_2
  Scenario: Portfolios user data can be edited
    When I open the site "/dashboard"
    And  I pause for 2000ms
    Then I expect that element "trophyBtn" becomes displayed
    When I click on the element "trophyBtn"
    Then I expect that element "portfolioLibraryTab" becomes displayed
    And  I expect that element "addNewPortfolioBtn" becomes displayed
    When I click on the element "addNewPortfolioBtn"
    Then I expect that element "portfolioListNames" becomes displayed
    And  I pause for 2000ms
    When I doubleclick on the "1st" element "portfolioListNames"
    And  I expect that element "portfoliosChangePersonalOverviewBtn" becomes displayed

    When I click on the element "portfoliosChangePersonalOverviewBtn"
    Then I expect that element "portfoliosEditPersonalOverviewInput" becomes displayed
    When I click on the element "portfoliosEditPersonalOverviewInput"
    And  I add "description changed" to the inputfield "portfoliosEditPersonalOverviewInput"
    And  I click on the element "portfoliosEditPersonalOverviewSaveBtn"
    Then I expect that element "portfoliosEditPersonalOverviewInput" becomes not displayed
    And  I expect that element "portfoliosPersonalOverviewText" becomes displayed
    And  I expect that element "portfoliosChangePersonalOverviewBtn" becomes displayed

    When I click on the element "portfoliosChangePersonalOverviewBtn"
    Then I expect that element "portfoliosEditPersonalOverviewInput" becomes displayed

    When I clear the inputfield "portfoliosEditPersonalOverviewInputText"
    And  I click on the element "portfoliosEditPersonalOverviewSaveBtn"
    Then I expect that element "portfoliosEditPersonalOverviewInput" becomes not displayed

  @PTA71_3
  Scenario: Snapshot can be saved for activity logs
    When I open the site "/dashboard"
    Then I expect that element "trophyBtn" becomes displayed
    When I click on the element "trophyBtn"

    Then I expect that element "portfolioLibraryTab" becomes displayed
    And  I expect that element "addNewPortfolioBtn" becomes displayed
    When I click on the element "addNewPortfolioBtn"
    And  I pause for 3000ms
    And  I refresh the page
    Then I expect that element "portfolioListThreeDotsBtns" becomes displayed
    And  I remove all elements "portfolioListNames" with button "portfolioListDeleteBtn" under "portfolioListThreeDotsBtns" with confirmation "portfoliosDeleteSnapshotConfirmBtn" till "1"
    Then I expect that element "portfolioListNames" does appear exactly "1" times
    And  I expect that element "portfolioListThreeDotsBtns" becomes displayed
    
    When I click on the element "reposTab"
    And  I pause for 3000ms
    Then I expect that element "reposContainer" becomes displayed
    And  I expect that element "1stReposCard" becomes displayed
    When I click on the element "1stReposCard"
    And  I pause for 2000ms
    And  I click on the element "1stReposCard" if visible
    Then I expect that element "dateRangeFilter" becomes displayed
    When I click on the element "dateRangeFilter"
    Then I expect that element "last30DaysDateRange" becomes displayed
    When I click on the element "last30DaysDateRange"
    And  I pause for 1000ms
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
    And  I pause for 1000ms
    And  I click on the element "saveSnapshotAddToPortfolio"
    And  I pause for 1000ms
    And  I press "ArrowDown"
    And  I press "Enter"
    Then I expect that element "saveSnapshotAddToPortfolio" not matches the text "None"
    And  I expect that element "saveSnapshotSaveBtn" becomes displayed
    When I click on the element "saveSnapshotSaveBtn"
    Then I expect that element "saveSnapshotModal" becomes not displayed
    And  I expect that element "saveSnapshotToPortfolioNotificationText" matches the text "Snapshot was added to your portfolio."
    And  I expect that element "saveSnapshotToPortfolioNotificationLink" becomes displayed
    When I click on the element "saveSnapshotToPortfolioNotificationLink"

    Then I expect that element "portfoliosUserName" becomes displayed
    And  I expect that element "portfoliosUserGitHubLink" becomes displayed
    And  I expect that element "portfoliosChangePersonalOverviewBtn" becomes displayed
    And  I refresh the page
#  https://semalab.atlassian.net/browse/EAST-1459
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

    When I click on the element "trophyBtn"
    Then I expect that element "snapshotLibraryTab" becomes displayed
    When I click on the element "snapshotLibraryTab"
    And  I pause for 3000ms
    And  I expect that element "snapshotListThreeDotsBtns" becomes displayed
    When I remove all elements "snapshotListTitles" with button "snapshotListDeleteBtn" under "snapshotListThreeDotsBtns" with confirmation "snapshotConfirmationDeleteBtn" till "0"
    And  I expect that element "snapshotListTitles" becomes not displayed

  @PTA71_5
  Scenario: Snapshot can be saved for code stats tags
    When I open the site "/dashboard"
    Then I expect that element "trophyBtn" becomes displayed
    When I click on the element "trophyBtn"
    Then I expect that element "portfolioLibraryTab" becomes displayed
    And  I expect that element "addNewPortfolioBtn" becomes displayed
    When I click on the element "addNewPortfolioBtn"
    And  I pause for 3000ms
    And  I refresh the page
    Then I expect that element "portfolioListThreeDotsBtns" becomes displayed
    And  I remove all elements "portfolioListNames" with button "portfolioListDeleteBtn" under "portfolioListThreeDotsBtns" with confirmation "portfoliosDeleteSnapshotConfirmBtn" till "1"
    Then I expect that element "portfolioListNames" does appear exactly "1" times
    And  I expect that element "portfolioListThreeDotsBtns" becomes displayed

    When I click on the element "reposTab"
    And  I pause for 3000ms
    Then I expect that element "reposContainer" becomes displayed
    And  I expect that element "1stReposCard" becomes displayed
    When I click on the element "1stReposCard"
    And  I pause for 2000ms
    And  I click on the element "1stReposCard" if visible
    Then I expect that element "codeStatsTabBtn" becomes displayed
    When I click on the element "codeStatsTabBtn"
    Then I expect that element "dateRangeFilter" becomes displayed
    When I click on the element "dateRangeFilter"
    Then I expect that element "last14DaysDateRange" becomes displayed
    When I click on the element "last14DaysDateRange"
    And  I pause for 1000ms
    And  I click on the element "dateRangeFilter"
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
    And  I pause for 1000ms
    And  I click on the element "saveSnapshotAddToPortfolio"
    And  I pause for 1000ms
    And  I press "ArrowDown"
    And  I press "Enter"
    Then I expect that element "saveSnapshotAddToPortfolio" not matches the text "None"
    And  I expect that element "saveSnapshotSaveBtn" becomes displayed
    When I click on the element "saveSnapshotSaveBtn"
    Then I expect that element "saveSnapshotModal" becomes not displayed
    And  I expect that element "saveSnapshotToPortfolioNotificationText" matches the text "Snapshot was added to your portfolio."
    And  I expect that element "saveSnapshotToPortfolioNotificationLink" becomes displayed
    When I click on the element "saveSnapshotToPortfolioNotificationLink"

    Then I expect that element "portfoliosUserName" becomes displayed
    And  I expect that element "portfoliosUserGitHubLink" becomes displayed
    And  I expect that element "portfoliosChangePersonalOverviewBtn" becomes displayed

    When I refresh the page
#  https://semalab.atlassian.net/browse/EAST-1459
    Then I expect that element "portfoliosSnapshotsBoard" becomes displayed
    And  I expect that new item "portfoliosSnapshotName" is added to portfolio
    And  I expect that element "portfoliosSnapshotVerticalDescription" becomes displayed
    And  I expect that element "portfoliosSnapshotVerticalDescription" matches the text "codeTags - snapshot description"

    When I click on the element "trophyBtn"
    Then I expect that element "snapshotLibraryTab" becomes displayed
    When I click on the element "snapshotLibraryTab"
    And  I pause for 3000ms
    And  I expect that element "snapshotListThreeDotsBtns" becomes displayed
    When I remove all elements "snapshotListTitles" with button "snapshotListDeleteBtn" under "snapshotListThreeDotsBtns" with confirmation "snapshotConfirmationDeleteBtn" till "0"
    And  I expect that element "snapshotListTitles" becomes not displayed

  @PTA71_4
  Scenario: Snapshot can be saved for code stats summaries
    When I open the site "/dashboard"
    Then I expect that element "trophyBtn" becomes displayed
    When I click on the element "trophyBtn"

    Then I expect that element "portfolioLibraryTab" becomes displayed
    And  I expect that element "addNewPortfolioBtn" becomes displayed
    When I click on the element "addNewPortfolioBtn"
    And  I pause for 3000ms
    And  I refresh the page
    Then I expect that element "portfolioListThreeDotsBtns" becomes displayed
    And  I remove all elements "portfolioListNames" with button "portfolioListDeleteBtn" under "portfolioListThreeDotsBtns" with confirmation "portfoliosDeleteSnapshotConfirmBtn" till "1"
    Then I expect that element "portfolioListNames" does appear exactly "1" times
    And  I expect that element "portfolioListThreeDotsBtns" becomes displayed

    When I click on the element "reposTab"
    And  I pause for 3000ms
    Then I expect that element "reposContainer" becomes displayed
    And  I expect that element "1stReposCard" becomes displayed
    When I click on the element "1stReposCard"
    And  I pause for 2000ms
    And  I click on the element "1stReposCard" if visible
    Then I expect that element "codeStatsTabBtn" becomes displayed
    When I click on the element "codeStatsTabBtn"
    Then I expect that element "dateRangeFilter" becomes displayed
    When I click on the element "dateRangeFilter"
    Then I expect that element "last30DaysDateRange" becomes displayed
    When I click on the element "last30DaysDateRange"

    Then I expect that element "dateRangeFilter" becomes displayed
    When I click on the element "dateRangeFilter"
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
    And  I pause for 1000ms
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

    When I refresh the page
#  https://semalab.atlassian.net/browse/EAST-1459
    Then I expect that element "portfoliosSnapshotsBoard" becomes displayed
    And  I expect that new item "portfoliosSnapshotName" is added to portfolio
    And  I expect that element "portfoliosSnapshotVerticalDescription" becomes displayed
    And  I expect that element "portfoliosSnapshotVerticalDescription" matches the text "codeStats - snapshot description"

    When I click on the element "trophyBtn"
    Then I expect that element "snapshotLibraryTab" becomes displayed
    When I click on the element "snapshotLibraryTab"
    And  I pause for 3000ms
    And  I expect that element "snapshotListThreeDotsBtns" becomes displayed
    When I remove all elements "snapshotListTitles" with button "snapshotListDeleteBtn" under "snapshotListThreeDotsBtns" with confirmation "snapshotConfirmationDeleteBtn" till "0"
    And  I expect that element "snapshotListTitles" becomes not displayed

  @PTA71_6
  Scenario: Snapshot can be edited in portfolios
    When I open the site "/dashboard"
    Then I expect that element "trophyBtn" becomes displayed
    When I click on the element "trophyBtn"
    Then I expect that element "snapshotLibraryTab" becomes displayed
    When I click on the element "snapshotLibraryTab"
    And  I pause for 3000ms
    When I remove all elements "snapshotListTitles" with button "snapshotListDeleteBtn" under "snapshotListThreeDotsBtns" with confirmation "snapshotConfirmationDeleteBtn" till "0"
    And  I expect that element "snapshotListTitles" becomes not displayed

    Then I expect that element "portfolioLibraryTab" becomes displayed
    When I click on the element "portfolioLibraryTab"
    Then I expect that element "addNewPortfolioBtn" becomes displayed
    When I click on the element "addNewPortfolioBtn"
    Then I expect that element "portfolioListNames" becomes displayed
    And  I pause for 2000ms

    When I click on the element "reposTab"
    And  I pause for 3000ms
    Then I expect that element "reposContainer" becomes displayed
    And  I expect that element "1stReposCard" becomes displayed
    When I click on the element "1stReposCard"
    And  I pause for 2000ms
    And  I click on the element "1stReposCard" if visible
    Then I expect that element "dateRangeFilter" becomes displayed
    When I click on the element "dateRangeFilter"
    Then I expect that element "last30DaysDateRange" becomes displayed
    When I click on the element "last30DaysDateRange"
    Then I expect that element "dateRangeFilter" becomes displayed
    When I click on the element "dateRangeFilter"
    Then I expect that element "snapshotBtn" becomes displayed

    When I click on the element "snapshotBtn"
    Then I expect that element "saveSnapshotTitleInput" becomes displayed
    And  I expect that element "saveSnapshotAddToPortfolio" becomes displayed

    When I set "activity logs" with timestamp to the inputfield "saveSnapshotTitleInput"
    And  I click on the element "saveSnapshotDescriptionInput"
    And  I add "activity logs - snapshot description" to the inputfield "saveSnapshotDescriptionInput"
    And  I pause for 1000ms
    And  I click on the element "saveSnapshotAddToPortfolio"
    And  I pause for 1000ms
    And  I press "ArrowDown"
    And  I press "Enter"
    Then I expect that element "saveSnapshotAddToPortfolio" not matches the text "None"
    When I click on the element "saveSnapshotSaveBtn"
    And  I expect that element "saveSnapshotToPortfolioNotificationText" matches the text "Snapshot was added to your portfolio."
    And  I expect that element "saveSnapshotToPortfolioNotificationLink" becomes displayed
    When I click on the element "saveSnapshotToPortfolioNotificationLink"
    Then I expect that element "portfoliosUserName" becomes displayed
    When I refresh the page
#  https://semalab.atlassian.net/browse/EAST-1459
    Then I expect that element "portfoliosSnapshotThreeDotsMenuBtn" becomes displayed
    When I click on the element "portfoliosSnapshotThreeDotsMenuBtn"
    Then I expect that element "portfoliosSnapshotEditBtn" becomes displayed

    When I click on the element "portfoliosSnapshotEditBtn"
    Then I expect that element "saveSnapshotTitleInput" becomes displayed

    When I clear the inputfield "saveSnapshotTitleInput"
    And  I set "snapshot name updated" to the inputfield "saveSnapshotTitleInput"
    And  I click on the element "editSnapshotSaveBtn"

    Then I expect that element "saveSnapshotTitleInput" becomes not displayed
#  https://semalab.atlassian.net/browse/EAST-1461
    And  I expect that element "portfoliosSnapshotName" matches the text "snapshot name updated"

  @PTA95 @smoke
  Scenario: Portfolio Manager elements are displayed correctly
    When I open the site "/dashboard"
    Then I expect that element "trophyBtn" becomes displayed
    When I click on the element "trophyBtn"

    Then I expect that element "portfolioLibraryTab" becomes displayed
    And  I expect that element "addNewPortfolioBtn" becomes displayed
    When I click on the element "addNewPortfolioBtn"
    And  I pause for 3000ms
    And  I refresh the page
    Then I expect that element "portfolioListThreeDotsBtns" becomes displayed
    And  I remove all elements "portfolioListNames" with button "portfolioListDeleteBtn" under "portfolioListThreeDotsBtns" with confirmation "portfoliosDeleteSnapshotConfirmBtn" till "1"
    Then I expect that element "portfolioListNames" does appear exactly "1" times
    And  I expect that element "portfolioListThreeDotsBtns" becomes displayed

    Then I expect that element "portfolioListNames" becomes displayed
    And  I expect that element "portfolioListDates" becomes displayed
    And  I expect that element "portfolioListVisibility" becomes displayed
    And  I expect that element "portfolioListShareBtns" becomes displayed
    And  I expect that element "portfolioListThreeDotsBtns" becomes displayed
    When I click on the element "addNewPortfolioBtn"
    And  I click on the element "portfolioListThreeDotsBtns"
    Then I expect that element "portfolioListDuplicateBtn" becomes displayed

  @PTA95_2 @smoke
  Scenario: Snapshot Manager elements are displayed correctly
    When I open the site "/dashboard"
    When I click on the element "reposTab"
    And  I pause for 3000ms
    Then I expect that element "reposContainer" becomes displayed
    And  I expect that element "1stReposCard" becomes displayed
    When I click on the element "1stReposCard"
    And  I pause for 2000ms
    And  I click on the element "1stReposCard" if visible
    Then I expect that element "dateRangeFilter" becomes displayed
    When I click on the element "dateRangeFilter"
    Then I expect that element "last30DaysDateRange" becomes displayed
    When I click on the element "last30DaysDateRange"
    And  I click on the element "dateRangeFilter"
    Then I expect that element "snapshotBtn" becomes displayed

    When I click on the element "snapshotBtn"
    Then I expect that element "saveSnapshotTitleInput" becomes displayed

    When I set "snapshot 1" to the inputfield "saveSnapshotTitleInput"
    And  I click on the element "saveSnapshotDescriptionInput"
    And  I add "snapshot from portfolio" to the inputfield "saveSnapshotDescriptionInput"
    And  I pause for 1000ms
    Then I expect that element "saveSnapshotAddToPortfolio" matches the text "None"
    And  I expect that element "saveSnapshotSaveBtn" becomes displayed
    When I click on the element "saveSnapshotSaveBtn"

    Then I expect that element "trophyBtn" becomes displayed
    When I click on the element "trophyBtn"
    Then I expect that element "snapshotLibraryTab" becomes displayed

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
    When I open the site "/dashboard"
    Then I expect that element "trophyBtn" becomes displayed
    When I click on the element "trophyBtn"
    Then I expect that element "portfolioLibraryTab" becomes displayed
    And  I expect that element "addNewPortfolioBtn" becomes displayed
    When I click on the element "addNewPortfolioBtn"
    And  I click on the element "addNewPortfolioBtn"
    And  I pause for 3000ms
    Then I expect that element "portfolioListThreeDotsBtns" becomes displayed
    And  I remove all elements "portfolioListNames" with button "portfolioListDeleteBtn" under "portfolioListThreeDotsBtns" with confirmation "portfoliosDeleteSnapshotConfirmBtn" till "1"
    Then I expect that element "portfolioListNames" does appear exactly "1" times
    And  I expect that element "portfolioListThreeDotsBtns" becomes displayed

    When I click on the element "portfolioListThreeDotsBtns"
    Then I expect that element "portfolioListDuplicateBtn" becomes displayed
    And  I expect that element "portfolioListDeleteBtn" becomes not displayed

  @PTA94
  Scenario: Portfolios elements can be duplicated in portfolio management
    When I open the site "/dashboard"
    Then I expect that element "trophyBtn" becomes displayed
    When I click on the element "trophyBtn"

    Then I expect that element "portfolioLibraryTab" becomes displayed
    And  I expect that element "addNewPortfolioBtn" becomes displayed
    When I click on the element "addNewPortfolioBtn"
    And  I pause for 3000ms
    Then I expect that element "portfolioListThreeDotsBtns" becomes displayed
    And  I remove all elements "portfolioListNames" with button "portfolioListDeleteBtn" under "portfolioListThreeDotsBtns" with confirmation "portfoliosDeleteSnapshotConfirmBtn" till "1"
    Then I expect that element "portfolioListNames" does appear exactly "1" times
    And  I expect that element "portfolioListThreeDotsBtns" becomes displayed

    When I click on the element "reposTab"
    And  I pause for 3000ms
    Then I expect that element "reposContainer" becomes displayed
    And  I expect that element "1stReposCard" becomes displayed
    When I click on the element "1stReposCard"
    And  I pause for 2000ms
    And  I click on the element "1stReposCard" if visible
    Then I expect that element "dateRangeFilter" becomes displayed
    When I click on the element "dateRangeFilter"
    Then I expect that element "last30DaysDateRange" becomes displayed
    When I click on the element "last30DaysDateRange"
    And  I click on the element "dateRangeFilter"
    Then I expect that element "snapshotBtn" becomes displayed

    When I click on the element "snapshotBtn"
    Then I expect that element "saveSnapshotTitleInput" becomes displayed
    And  I expect that element "saveSnapshotDescriptionInput" becomes displayed

    When I set "activity logs" with timestamp to the inputfield "saveSnapshotTitleInput"
    And  I click on the element "saveSnapshotDescriptionInput"
    And  I add "activity logs - snapshot description" to the inputfield "saveSnapshotDescriptionInput"
    And  I pause for 1000ms
    And  I click on the element "saveSnapshotAddToPortfolio"
    And  I pause for 1000ms
    And  I press "ArrowDown"
    And  I press "Enter"
    Then I expect that element "saveSnapshotAddToPortfolio" not matches the text "None"
    When I click on the element "saveSnapshotSaveBtn"
    And  I expect that element "saveSnapshotToPortfolioNotificationText" matches the text "Snapshot was added to your portfolio."
    And  I expect that element "saveSnapshotToPortfolioNotificationLink" becomes displayed
    When I click on the element "saveSnapshotToPortfolioNotificationLink"
    Then I expect that element "portfoliosUserName" becomes displayed
    When I refresh the page
#  https://semalab.atlassian.net/browse/EAST-1459
    Then I expect that element "portfoliosSnapshotsBoard" becomes displayed
    And  I expect that new item "portfoliosSnapshotName" is added to portfolio
    And  I expect that element "portfoliosSnapshotDescription" becomes displayed
    And  I expect that element "portfoliosSnapshotDescription" matches the text "activity logs - snapshot description"

    Then I expect that element "trophyBtn" becomes displayed
    When I click on the element "trophyBtn"

    Then I expect that element "portfolioListNames" becomes displayed
    And  I expect that element "addNewPortfolioBtn" becomes displayed
    And  I pause for 3000ms
    When I save the text of element "portfolioListNames"
    Then I expect that element "portfolioListThreeDotsBtns" becomes displayed
    And  I click on the element "portfolioListThreeDotsBtns"
    And  I pause for 2000ms
    Then I expect that element "portfolioListDuplicateBtn" becomes displayed
    When I click on the element "portfolioListDuplicateBtn"
    And  I pause for 4000ms
    Then I expect that element "portfolioListNames" does appear exactly "2" times
    And  I expect that "2nd" element "portfolioListNames" matches the saved variable with text "_Copy"
    When I click on the "2nd" element "portfolioListNames"
    Then I expect that element "portfoliosSnapshotsBoard" becomes displayed
#    And  I expect that element "portfoliosSnapshotDescription" becomes displayed
#    And  I expect that element "portfoliosSnapshotDescription" matches the text "activity logs - snapshot description"
#    https://semalab.atlassian.net/browse/EAST-1405

  @PTA100 @smoke
  Scenario: All snapshots can be removed from the list
    When I open the site "/dashboard"

    When I click on the element "reposTab"
    And  I pause for 3000ms
    Then I expect that element "reposContainer" becomes displayed
    And  I expect that element "1stReposCard" becomes displayed
    When I click on the element "1stReposCard"
    And  I pause for 2000ms
    And  I click on the element "1stReposCard" if visible
    Then I expect that element "dateRangeFilter" becomes displayed
    When I click on the element "dateRangeFilter"
    Then I expect that element "last30DaysDateRange" becomes displayed
    When I click on the element "last30DaysDateRange"
    And  I click on the element "dateRangeFilter"
    Then I expect that element "snapshotBtn" becomes displayed

    When I click on the element "snapshotBtn"
    Then I expect that element "saveSnapshotTitleInput" becomes displayed
    And  I expect that element "saveSnapshotDescriptionInput" becomes displayed

    When I set "activity logs" with timestamp to the inputfield "saveSnapshotTitleInput"
    And  I click on the element "saveSnapshotDescriptionInput"
    And  I add "activity logs - snapshot description" to the inputfield "saveSnapshotDescriptionInput"
    And  I pause for 1000ms
    When I click on the element "saveSnapshotSaveBtn"

    Then I expect that element "trophyBtn" becomes displayed
    When I click on the element "trophyBtn"

    Then I expect that element "snapshotLibraryTab" becomes displayed
    When I click on the element "snapshotLibraryTab"
    And  I pause for 3000ms
    And  I expect that element "snapshotListThreeDotsBtns" becomes displayed
    When I remove all elements "snapshotListTitles" with button "snapshotListDeleteBtn" under "snapshotListThreeDotsBtns" with confirmation "snapshotConfirmationDeleteBtn" till "0"
    And  I expect that element "snapshotListTitles" becomes not displayed

  @PTA100_2
  Scenario: Snapshots can be removed from the portfolio
    When I open the site "/dashboard"

    Then I expect that element "trophyBtn" becomes displayed
    When I click on the element "trophyBtn"

    Then I expect that element "portfolioLibraryTab" becomes displayed
    And  I expect that element "addNewPortfolioBtn" becomes displayed
    When I click on the element "addNewPortfolioBtn"
    And  I pause for 2000ms
    And  I refresh the page
    Then I expect that element "portfolioListThreeDotsBtns" becomes displayed
    And  I remove all elements "portfolioListNames" with button "portfolioListDeleteBtn" under "portfolioListThreeDotsBtns" with confirmation "portfoliosDeleteSnapshotConfirmBtn" till "1"
    Then I expect that element "portfolioListNames" does appear exactly "1" times
    And  I expect that element "portfolioListThreeDotsBtns" becomes displayed

    When I click on the element "reposTab"
    And  I pause for 3000ms
    Then I expect that element "reposContainer" becomes displayed
    And  I expect that element "1stReposCard" becomes displayed
    When I click on the element "1stReposCard"
    And  I pause for 2000ms
    And  I click on the element "1stReposCard" if visible
    Then I expect that element "dateRangeFilter" becomes displayed
    When I click on the element "dateRangeFilter"
    Then I expect that element "last30DaysDateRange" becomes displayed
    When I click on the element "last30DaysDateRange"
    And  I click on the element "dateRangeFilter"
    Then I expect that element "snapshotBtn" becomes displayed

    When I click on the element "snapshotBtn"
    Then I expect that element "saveSnapshotTitleInput" becomes displayed

    When I set "activity logs" with timestamp to the inputfield "saveSnapshotTitleInput"
    And  I click on the element "saveSnapshotDescriptionInput"
    And  I add "activity logs - snapshot description" to the inputfield "saveSnapshotDescriptionInput"
    And  I pause for 1000ms
    And  I click on the element "saveSnapshotAddToPortfolio"
    And  I pause for 1000ms
    And  I press "ArrowDown"
    And  I press "Enter"
    Then I expect that element "saveSnapshotAddToPortfolio" not matches the text "None"
    And  I expect that element "saveSnapshotSaveBtn" becomes displayed
    When I click on the element "saveSnapshotSaveBtn"
    Then I expect that element "saveSnapshotModal" becomes not displayed
    And  I expect that element "saveSnapshotToPortfolioNotificationText" matches the text "Snapshot was added to your portfolio."
    And  I expect that element "saveSnapshotToPortfolioNotificationLink" becomes displayed
    When I click on the element "saveSnapshotToPortfolioNotificationLink"
    Then I expect that element "portfoliosUserName" becomes displayed

    When I refresh the page
#  https://semalab.atlassian.net/browse/EAST-1459

    Then I expect that element "portfoliosSnapshotThreeDotsMenuBtn" becomes displayed
    When I click on the element "portfoliosSnapshotThreeDotsMenuBtn"
    Then I expect that element "portfoliosSnapshotDeleteBtn" becomes displayed

    When I click on the element "portfoliosSnapshotDeleteBtn"
    Then I expect that element "portfoliosDeleteSnapshotConfirmBtn" becomes displayed
    When I click on the element "portfoliosDeleteSnapshotConfirmBtn"
    Then I expect that element "portfoliosSnapshotsBoard" becomes not displayed

    Then I expect that element "trophyBtn" becomes displayed
    When I click on the element "trophyBtn"

    Then I expect that element "snapshotLibraryTab" becomes displayed
    When I click on the element "snapshotLibraryTab"
    And  I pause for 3000ms
    And  I expect that element "snapshotListThreeDotsBtns" becomes displayed
    When I remove all elements "snapshotListTitles" with button "snapshotListDeleteBtn" under "snapshotListThreeDotsBtns" with confirmation "snapshotConfirmationDeleteBtn" till "0"
    And  I expect that element "snapshotListTitles" becomes not displayed

  @PTA97
  Scenario: Snapshots can be added to portfolio from the portfolio
    When I open the site "/dashboard"

    Then I expect that element "trophyBtn" becomes displayed
    When I click on the element "trophyBtn"

    Then I expect that element "snapshotLibraryTab" becomes displayed
    When I click on the element "snapshotLibraryTab"
    And  I pause for 3000ms
    When I remove all elements "snapshotListTitles" with button "snapshotListDeleteBtn" under "snapshotListThreeDotsBtns" with confirmation "snapshotConfirmationDeleteBtn" till "0"
    And  I expect that element "snapshotListTitles" becomes not displayed

    Then I expect that element "portfolioLibraryTab" becomes displayed
    When I click on the element "portfolioLibraryTab"
    Then I expect that element "addNewPortfolioBtn" becomes displayed
    When I click on the element "addNewPortfolioBtn"
    And  I pause for 2000ms
    And  I refresh the page
    Then I expect that element "portfolioListThreeDotsBtns" becomes displayed
    And  I remove all elements "portfolioListNames" with button "portfolioListDeleteBtn" under "portfolioListThreeDotsBtns" with confirmation "portfoliosDeleteSnapshotConfirmBtn" till "1"
    Then I expect that element "portfolioListNames" does appear exactly "1" times
    And  I expect that element "portfolioListThreeDotsBtns" becomes displayed

    When I click on the element "reposTab"
    And  I pause for 3000ms
    Then I expect that element "reposContainer" becomes displayed
    And  I expect that element "1stReposCard" becomes displayed
    When I click on the element "1stReposCard"
    And  I pause for 2000ms
    And  I click on the element "1stReposCard" if visible
    Then I expect that element "dateRangeFilter" becomes displayed
    When I click on the element "dateRangeFilter"
    Then I expect that element "last30DaysDateRange" becomes displayed
    When I click on the element "last30DaysDateRange"
    And  I click on the element "dateRangeFilter"
    Then I expect that element "snapshotBtn" becomes displayed

    When I click on the element "snapshotBtn"
    Then I expect that element "saveSnapshotTitleInput" becomes displayed

    When I set "snapshot 1" to the inputfield "saveSnapshotTitleInput"
    And  I click on the element "saveSnapshotDescriptionInput"
    And  I add "snapshot from portfolio" to the inputfield "saveSnapshotDescriptionInput"
    And  I pause for 1000ms
    Then I expect that element "saveSnapshotAddToPortfolio" matches the text "None"
    And  I expect that element "saveSnapshotSaveBtn" becomes displayed
    When I click on the element "saveSnapshotSaveBtn"

    When I click on the element "snapshotBtn"
    Then I expect that element "saveSnapshotTitleInput" becomes displayed

    When I set "snapshot 2" to the inputfield "saveSnapshotTitleInput"
    And  I click on the element "saveSnapshotDescriptionInput"
    And  I add "snapshot from portfolio 2" to the inputfield "saveSnapshotDescriptionInput"
    And  I pause for 1000ms
    Then I expect that element "saveSnapshotAddToPortfolio" matches the text "None"
    And  I expect that element "saveSnapshotSaveBtn" becomes displayed
    When I click on the element "saveSnapshotSaveBtn"
    Then I expect that element "saveSnapshotToPortfolioNotificationText" matches the text "Snapshot was saved to the Snapshot Library."
    And  I pause for 5000ms
#    test data created

    Then I expect that element "trophyBtn" becomes displayed
    When I click on the element "trophyBtn"

    Then I expect that element "portfolioListNames" becomes displayed
    When I click on the element "portfolioListNames"
    Then I expect that element "portfoliosAddSnapshotBtn" becomes displayed
    When I click on the element "portfoliosAddSnapshotBtn"
    Then I expect that element "portfoliosAddSnapshotModalTitles" becomes displayed
    And  I expect that element "portfoliosAddSnapshotModalCheckBoxes" becomes displayed
    And  I expect that element "portfoliosAddSnapshotModalDates" becomes displayed
    And  I expect that element "portfoliosAddSnapshotModalConfirmBtn" becomes displayed
    And  I expect that element "portfoliosAddSnapshotModalCancelBtn" becomes displayed
    And  I expect that element "portfoliosAddSnapshotModalConfirmBtn" matches the text "Add 0 Snapshots"
    And  I expect that element "portfoliosAddSnapshotModalConfirmBtn" is not enabled
    And  I expect that element "portfoliosAddSnapshotModalTitles" does appear exactly "2" times

    When I click on the element "portfoliosAddSnapshotModalCheckBoxes"
    Then I expect that element "portfoliosAddSnapshotModalConfirmBtn" matches the text "Add 1 Snapshots"
    And  I expect that element "portfoliosAddSnapshotModalConfirmBtn" is enabled

    When I click on the element "portfoliosAddSnapshotModalConfirmBtn"
#    Then I expect that element "portfoliosAddSnapshotModal" becomes not displayed
#    And  I expect that element "saveSnapshotToPortfolioNotificationText" matches the text "Snapshots were added to this portfolio"

    And I pause for 10000ms
    When I refresh the page
#    https://semalab.atlassian.net/browse/EAST-1467

    Then I expect that element "portfoliosSnapshotsBoard" becomes displayed
    And  I expect that element "portfoliosSnapshotDescription" becomes displayed

    When I click on the element "portfoliosAddSnapshotBtn"
    Then I expect that element "portfoliosAddSnapshotModalTitles" becomes displayed
    And  I expect that element "portfoliosAddSnapshotModalConfirmBtn" matches the text "Add 0 Snapshots"
    And  I expect that element "portfoliosAddSnapshotModalConfirmBtn" is not enabled
    And  I expect that element "portfoliosAddSnapshotModalTitles" does appear exactly "1" times
    And  I expect that element "portfoliosAddSnapshotModalCancelBtn" becomes displayed

    When I click on the element "portfoliosAddSnapshotModalCancelBtn"
    Then I expect that element "portfoliosAddSnapshotModal" becomes not displayed
    And  I expect that element "portfoliosAddSnapshotModalTitles" becomes not displayed

  @PTA97_2
  Scenario: Snapshots can be added to portfolio with 1 snapshot in it from this portfolio
    When I open the site "/dashboard"

    Then I expect that element "trophyBtn" becomes displayed
    When I click on the element "trophyBtn"

    Then I expect that element "snapshotLibraryTab" becomes displayed
    When I click on the element "snapshotLibraryTab"
    And  I pause for 3000ms
    When I remove all elements "snapshotListTitles" with button "snapshotListDeleteBtn" under "snapshotListThreeDotsBtns" with confirmation "snapshotConfirmationDeleteBtn" till "0"
    And  I expect that element "snapshotListTitles" becomes not displayed

    Then I expect that element "portfolioLibraryTab" becomes displayed
    When I click on the element "portfolioLibraryTab"
    Then I expect that element "addNewPortfolioBtn" becomes displayed
    When I click on the element "addNewPortfolioBtn"
    And  I pause for 2000ms
    And  I refresh the page
    Then I expect that element "portfolioListThreeDotsBtns" becomes displayed
    And  I remove all elements "portfolioListNames" with button "portfolioListDeleteBtn" under "portfolioListThreeDotsBtns" with confirmation "portfoliosDeleteSnapshotConfirmBtn" till "1"
    Then I expect that element "portfolioListNames" does appear exactly "1" times
    And  I expect that element "portfolioListThreeDotsBtns" becomes displayed

    When I click on the element "reposTab"
    And  I pause for 3000ms
    Then I expect that element "reposContainer" becomes displayed
    And  I expect that element "1stReposCard" becomes displayed
    When I click on the element "1stReposCard"
    And  I pause for 2000ms
    And  I click on the element "1stReposCard" if visible
    Then I expect that element "dateRangeFilter" becomes displayed
    When I click on the element "dateRangeFilter"
    Then I expect that element "last30DaysDateRange" becomes displayed
    When I click on the element "last30DaysDateRange"
    And  I click on the element "dateRangeFilter"
    Then I expect that element "snapshotBtn" becomes displayed

    When I click on the element "snapshotBtn"
    Then I expect that element "saveSnapshotTitleInput" becomes displayed

    When I set "snapshot 1" to the inputfield "saveSnapshotTitleInput"
    And  I click on the element "saveSnapshotDescriptionInput"
    And  I add "snapshot from portfolio" to the inputfield "saveSnapshotDescriptionInput"
    And  I pause for 1000ms
    And  I click on the element "saveSnapshotAddToPortfolio"
    And  I pause for 1000ms
    And  I press "ArrowDown"
    And  I press "Enter"
    Then I expect that element "saveSnapshotAddToPortfolio" not matches the text "None"
    And  I expect that element "saveSnapshotSaveBtn" becomes displayed
    When I click on the element "saveSnapshotSaveBtn"

    When I click on the element "snapshotBtn"
    Then I expect that element "saveSnapshotTitleInput" becomes displayed

    When I set "snapshot 2" to the inputfield "saveSnapshotTitleInput"
    And  I click on the element "saveSnapshotDescriptionInput"
    And  I add "snapshot from portfolio 2" to the inputfield "saveSnapshotDescriptionInput"
    And  I pause for 1000ms
    Then I expect that element "saveSnapshotAddToPortfolio" matches the text "None"
    And  I expect that element "saveSnapshotSaveBtn" becomes displayed
    When I click on the element "saveSnapshotSaveBtn"
    Then I expect that element "saveSnapshotToPortfolioNotificationText" matches the text "Snapshot was saved to the Snapshot Library."
    And  I pause for 5000ms
#    test data created

    Then I expect that element "trophyBtn" becomes displayed
    When I click on the element "trophyBtn"

    Then I expect that element "portfolioListNames" becomes displayed
    When I click on the element "portfolioListNames"
    Then I expect that element "portfoliosAddSnapshotBtn" becomes displayed

    Then I expect that element "portfoliosSnapshotsBoard" becomes displayed
    And  I expect that element "portfoliosSnapshotName" becomes displayed
    And  I expect that element "portfoliosSnapshotName" matches the text "snapshot 1"

    When I click on the element "portfoliosAddSnapshotBtn"
    Then I expect that element "portfoliosAddSnapshotModalTitles" becomes displayed
    And  I expect that element "portfoliosAddSnapshotModalConfirmBtn" matches the text "Add 0 Snapshots"
    And  I expect that element "portfoliosAddSnapshotModalConfirmBtn" is not enabled
    And  I expect that element "portfoliosAddSnapshotModalTitles" does appear exactly "1" times

    When I click on the element "portfoliosAddSnapshotModalCheckBoxes"
    Then I expect that element "portfoliosAddSnapshotModalConfirmBtn" matches the text "Add 1 Snapshots"
    And  I expect that element "portfoliosAddSnapshotModalConfirmBtn" is enabled

    When I click on the element "portfoliosAddSnapshotModalConfirmBtn"
#    Then I expect that element "portfoliosAddSnapshotModal" becomes not displayed
#    And  I expect that element "saveSnapshotToPortfolioNotificationText" matches the text "Snapshots were added to this portfolio"

    And I pause for 10000ms
    When I refresh the page
#    https://semalab.atlassian.net/browse/EAST-1467

    Then I expect that element "portfoliosSnapshotName" becomes displayed
    And  I expect that element "portfoliosSnapshotName" does appear exactly "2" times

    When I click on the element "portfoliosAddSnapshotBtn"
    Then I expect that element "portfoliosAddSnapshotModal" becomes displayed
    And  I expect that element "portfoliosAddSnapshotModalTitles" becomes not displayed
    And  I expect that element "portfoliosAddSnapshotModalConfirmBtn" matches the text "Add 0 Snapshots"
    And  I expect that element "portfoliosAddSnapshotModalConfirmBtn" is not enabled

#  @PTA97_3
#  Scenario: Snapshots can be added to portfolio from snapshot library
#    When I open the site "/dashboard"
#
#    Then I expect that element "trophyBtn" becomes displayed
#    When I click on the element "trophyBtn"
#
#    Then I expect that element "snapshotLibraryTab" becomes displayed
#    When I click on the element "snapshotLibraryTab"
#    And  I pause for 3000ms
#    When I remove all elements "snapshotListTitles" with button "snapshotListDeleteBtn" under "snapshotListThreeDotsBtns" with confirmation "snapshotConfirmationDeleteBtn" till "0"
#    And  I expect that element "snapshotListTitles" becomes not displayed
#
#    Then I expect that element "portfolioLibraryTab" becomes displayed
#    When I click on the element "portfolioLibraryTab"
#    Then I expect that element "addNewPortfolioBtn" becomes displayed
#    When I click on the element "addNewPortfolioBtn"
#    And  I pause for 2000ms
#    And  I refresh the page
#    Then I expect that element "portfolioListThreeDotsBtns" becomes displayed
#    And  I remove all elements "portfolioListNames" with button "portfolioListDeleteBtn" under "portfolioListThreeDotsBtns" with confirmation "portfoliosDeleteSnapshotConfirmBtn" till "1"
#    Then I expect that element "portfolioListNames" does appear exactly "1" times
#    And  I expect that element "portfolioListThreeDotsBtns" becomes displayed
#
#    When I click on the element "reposTab"
#    And  I pause for 3000ms
#    Then I expect that element "reposContainer" becomes displayed
#    And  I expect that element "1stReposCard" becomes displayed
#    When I click on the element "1stReposCard"
#    And  I pause for 2000ms
#    And  I click on the element "1stReposCard" if visible
#    Then I expect that element "dateRangeFilter" becomes displayed
#    When I click on the element "dateRangeFilter"
#    Then I expect that element "last30DaysDateRange" becomes displayed
#    When I click on the element "last30DaysDateRange"
#    And  I click on the element "dateRangeFilter"
#    Then I expect that element "snapshotBtn" becomes displayed
#
#    When I click on the element "snapshotBtn"
#    Then I expect that element "saveSnapshotTitleInput" becomes displayed
#
#    When I set "snapshot 1" to the inputfield "saveSnapshotTitleInput"
#    And  I click on the element "saveSnapshotDescriptionInput"
#    And  I add "snapshot from portfolio" to the inputfield "saveSnapshotDescriptionInput"
#    And  I pause for 1000ms
#    Then I expect that element "saveSnapshotAddToPortfolio" matches the text "None"
#    And  I expect that element "saveSnapshotSaveBtn" becomes displayed
#    When I click on the element "saveSnapshotSaveBtn"
#
#    When I click on the element "snapshotBtn"
#    Then I expect that element "saveSnapshotTitleInput" becomes displayed
#
#    When I set "snapshot 2" to the inputfield "saveSnapshotTitleInput"
#    And  I click on the element "saveSnapshotDescriptionInput"
#    And  I add "snapshot from portfolio 2" to the inputfield "saveSnapshotDescriptionInput"
#    And  I pause for 1000ms
#    Then I expect that element "saveSnapshotAddToPortfolio" matches the text "None"
#    And  I expect that element "saveSnapshotSaveBtn" becomes displayed
#    When I click on the element "saveSnapshotSaveBtn"
#    Then I expect that element "saveSnapshotToPortfolioNotificationText" matches the text "Snapshot was saved to the Snapshot Library."
#    And  I pause for 5000ms
##    test data created
#
#    Then I expect that element "trophyBtn" becomes displayed
#    When I click on the element "trophyBtn"
#    Then I expect that element "snapshotLibraryTab" becomes displayed
#    When I click on the element "snapshotLibraryTab"
#    And  I pause for 3000ms
#
#    And  I expect that element "snapshotLibAddToPortfolioBtn" becomes displayed
#    When I click on the element "snapshotLibAddToPortfolioBtn"
#    Then I expect that element "snapshotLibAddToPortfolioModalPortfolios" becomes displayed
#    And  I expect that element "snapshotLibAddToPortfolioModalDate" becomes displayed
#    And  I expect that element "snapshotLibAddToPortfolioModalVisibility" becomes displayed
#    And  I expect that element "snapshotLibAddToPortfolioModalCheckBoxes" becomes displayed
#    And  I expect that element "snapshotLibAddToPortfolioModalCancelBtn" becomes displayed
#    And  I expect that element "snapshotLibAddToPortfolioModalPortfolios" does appear exactly "2" times
#    And  I expect that element "snapshotLibAddToPortfolioModalSubmitBtn" becomes displayed
#    And  I expect that element "snapshotLibAddToPortfolioModalSubmitBtn" is not enabled
#
#    When I click on the element "snapshotLibAddToPortfolioModalCheckBoxes"
#    Then I expect that element "snapshotLibAddToPortfolioModalSubmitBtn" is enabled
#    And  I expect that element "snapshotLibAddToPortfolioModalSelectedPortfolios" becomes displayed
#    When I click on the element "snapshotLibAddToPortfolioModalSubmitBtn"
#    Then I expect that element "snapshotLibAddToPortfolioModalPortfolios" becomes not displayed
#    And  I expect that element "snapshotLibAddToPortfolioModal" becomes not displayed
#    And  I expect that element "saveSnapshotToPortfolioNotificationText" matches the text "Snapshot was added Snapshot was added succesfully."
#    And  I expect that element "saveSnapshotToPortfolioNotificationLink" becomes displayed
#    When I click on the element "saveSnapshotToPortfolioNotificationLink"
#
#    Then I expect that element "portfoliosUserName" becomes displayed
#    When I refresh the page
#    Then I expect that element "portfoliosSnapshotsBoard" becomes displayed
#    And  I expect that element "portfoliosSnapshotDescription" becomes displayed
#    And  I expect that element "portfoliosSnapshotDescription" matches the text "snapshot from portfolio"
#
#
#    When I click on the element "trophyBtn"
#    Then I expect that element "snapshotLibraryTab" becomes displayed
#    When I click on the element "snapshotLibraryTab"
#    And  I pause for 3000ms
#
#    todo continue after discussion


#  NEW TEST FOR DUPLICATING
#  https://semalab.atlassian.net/browse/EAST-1412


#  ---------
#  @PTA94_2     #https://semalab.atlassian.net/browse/EAST-1405
#  Scenario: Portfolios elements can be duplicated from inside
#    Then I expect that element "trophyBtn" becomes displayed
#    When I click on the element "trophyBtn"
#
#    Then I expect that element "portfolioLibraryTab" becomes displayed
#    And  I expect that element "addNewPortfolioBtn" becomes displayed
#    When I click on the element "addNewPortfolioBtn"
#    And  I pause for 3000ms
#    Then I expect that element "portfolioListThreeDotsBtns" becomes displayed
#    And  I remove all elements "portfolioListNames" with button "portfolioListDeleteBtn" under "portfolioListThreeDotsBtns" with confirmation "portfoliosDeleteSnapshotConfirmBtn"
#    Then I expect that element "portfolioListNames" does appear exactly "1" times
#    And  I expect that element "portfolioListThreeDotsBtns" becomes displayed
#
#    When I click on the element "reposTab"
#    Then I expect that element "reposContainer" becomes displayed
#    And  I pause for 3000ms
#    And  I expect that element "1stReposCard" becomes displayed
#    And  I pause for 1000ms
#    When I click on the element "1stReposCard"
#    And  I pause for 1000ms
#    Then I expect that element "dateRangeFilter" becomes displayed
#    When I click on the element "dateRangeFilter"
#    Then I expect that element "allTimeDateRange" becomes displayed
#    When I click on the element "allTimeDateRange"
#    And  I click on the element "dateRangeFilter"
#    Then I expect that element "snapshotBtn" becomes displayed
#
#    When I click on the element "snapshotBtn"
#    Then I expect that element "saveSnapshotTitleInput" becomes displayed
#    And  I expect that element "saveSnapshotDescriptionInput" becomes displayed
#
#    When I set "activity logs" with timestamp to the inputfield "saveSnapshotTitleInput"
#    And  I click on the element "saveSnapshotDescriptionInput"
#    And  I add "activity logs - snapshot description" to the inputfield "saveSnapshotDescriptionInput"
#    And  I click on the element "saveSnapshotAddToPortfolio"
#    And  I pause for 1000ms
#    And  I press "ArrowDown"
#    And  I press "Enter"
#    Then I expect that element "saveSnapshotAddToPortfolio" not matches the text "None"
#    When I click on the element "saveSnapshotSaveBtn"
#    And  I expect that element "saveSnapshotToPortfolioNotificationText" matches the text "Snapshot was added to your portfolio."
#    And  I expect that element "saveSnapshotToPortfolioNotificationLink" becomes displayed
#    When I click on the element "saveSnapshotToPortfolioNotificationLink"
#
#    Then I expect that element "portfoliosSnapshotsBoard" becomes displayed
#    And  I expect that new item "portfoliosSnapshotName" is added to portfolio
#    And  I expect that element "portfoliosSnapshotDescription" becomes displayed
#    And  I expect that element "portfoliosSnapshotDescription" matches the text "activity logs - snapshot description"
#
#    Then I expect that element "trophyBtn" becomes displayed
#    When I click on the element "trophyBtn"
#
#    Then I expect that element "portfolioListNames" becomes displayed
#    And  I expect that element "addNewPortfolioBtn" becomes displayed
#    And  I expect that element "portfolioListThreeDotsBtns" becomes displayed
#    When I save the text of element "portfolioListNames"
#    And  I pause for 3000ms
#    And  I click on the element "portfolioListThreeDotsBtns"
#    Then I expect that element "portfolioListDuplicateBtn" becomes displayed
#    When I click on the element "portfolioListDuplicateBtn"
#    And  I pause for 20000ms
#    Then I expect that element "portfolioListNames" does appear exactly "2" times
#    And  I expect that "2nd" element "portfolioListNames" matches the saved variable with text "_Copy"
#    When I click on the "2nd" element "portfolioListNames"
#    Then I expect that element "portfoliosSnapshotsBoard" becomes displayed
#    And  I expect that element "portfoliosSnapshotDescription" becomes displayed
#    And  I expect that element "portfoliosSnapshotDescription" matches the text "activity logs - snapshot description"


  @PTA112
  Scenario: Public Portfolios can be shared by the button
    When I open the site "/dashboard"
    Then I expect that element "trophyBtn" becomes displayed
    When I click on the element "trophyBtn"

    Then I expect that element "portfolioLibraryTab" becomes displayed
    When I click on the element "portfolioLibraryTab"
    Then I expect that element "addNewPortfolioBtn" becomes displayed
    When I click on the element "addNewPortfolioBtn"
    And  I pause for 2000ms
    And  I refresh the page
    Then I expect that element "portfolioListThreeDotsBtns" becomes displayed
    When I remove all elements "portfolioListNames" with button "portfolioListDeleteBtn" under "portfolioListThreeDotsBtns" with confirmation "portfoliosDeleteSnapshotConfirmBtn" till "1"
    Then I expect that element "portfolioListNames" does appear exactly "1" times
    And  I expect that element "portfolioListThreeDotsBtns" becomes displayed
    And  I expect that element "portfolioListVisibility" becomes displayed
    And  I expect that element "portfolioListVisibility" matches the text "private"
    And  I expect that element "portfolioListShareBtns" becomes displayed
    And  I pause for 1000ms

    When I hover over element "portfolioListShareBtns"
    Then I expect that element "portfolioListShareTooltip" becomes displayed
    And  I expect that element "portfolioListShareTooltip" not matches the text "Click to copy to clipboard"
    When I click on the element "portfolioListShareBtns"
    And  I hover over element "portfolioListShareBtns"
    Then I expect that element "portfolioListShareTooltip" not matches the text "Copied to clipboard"

  @PTA112_2
  Scenario: Privat Portfolios can not be shared by the button
    When I open the site "/dashboard"
    Then I expect that element "trophyBtn" becomes displayed
    When I click on the element "trophyBtn"

    Then I expect that element "portfolioLibraryTab" becomes displayed
    When I click on the element "portfolioLibraryTab"
    Then I expect that element "addNewPortfolioBtn" becomes displayed
    When I click on the element "addNewPortfolioBtn"
    And  I pause for 2000ms
    And  I refresh the page
    Then I expect that element "portfolioListThreeDotsBtns" becomes displayed
    When I remove all elements "portfolioListNames" with button "portfolioListDeleteBtn" under "portfolioListThreeDotsBtns" with confirmation "portfoliosDeleteSnapshotConfirmBtn" till "1"
    Then I expect that element "portfolioListNames" does appear exactly "1" times
    And  I expect that element "portfolioListThreeDotsBtns" becomes displayed
    And  I expect that element "portfolioListVisibility" becomes displayed
    And  I expect that element "portfolioListVisibility" matches the text "private"
    And  I expect that element "portfolioListShareBtns" becomes displayed
    And  I pause for 1000ms
    When I click on the element "portfolioListNames"
    Then I expect that element "portfoliosPublicPrivatSwitch" becomes displayed
    When I click on the element "portfoliosPublicPrivatSwitch"
    And  I pause for 1000ms
    And  I click on the element "trophyBtn"
    Then I expect that element "portfolioListNames" does appear exactly "1" times
    And  I expect that element "portfolioListThreeDotsBtns" becomes displayed
    And  I expect that element "portfolioListVisibility" becomes displayed
    And  I expect that element "portfolioListVisibility" matches the text "public"
    And  I pause for 1000ms
    And  I expect that element "portfolioListShareBtns" becomes displayed

    When I hover over element "portfolioListShareBtns"
    Then I expect that element "portfolioListShareTooltip" becomes displayed
    And  I expect that element "portfolioListShareTooltip" matches the text "Click to copy to clipboard"
    When I click on the element "portfolioListShareBtns"
    And  I pause for 10000ms
    And  I hover over element "portfolioListNames"
    And  I hover over element "portfolioListShareBtns"
    Then I expect that element "portfolioListShareTooltip" becomes displayed
    And  I expect that element "portfolioListShareTooltip" matches the text "Copied to clipboard"

  @PTA115 @smoke
  Scenario: Portfolios can be renamed
    When I open the site "/dashboard"
    Then I expect that element "trophyBtn" becomes displayed
    When I click on the element "trophyBtn"

    Then I expect that element "portfolioLibraryTab" becomes displayed
    And  I expect that element "addNewPortfolioBtn" becomes displayed
    When I click on the element "addNewPortfolioBtn"
    And  I pause for 3000ms
    Then I expect that element "portfolioListThreeDotsBtns" becomes displayed
    And  I remove all elements "portfolioListNames" with button "portfolioListDeleteBtn" under "portfolioListThreeDotsBtns" with confirmation "portfoliosDeleteSnapshotConfirmBtn" till "1"
    Then I expect that element "portfolioListNames" does appear exactly "1" times
    And  I expect that element "portfolioListThreeDotsBtns" becomes displayed

    When I click on the element "portfolioListNames"
    Then I expect that element "portfoliosName" becomes displayed
    And  I expect that element "portfoliosEditNameBtn" becomes displayed
    And  I expect that element "portfoliosInputName" becomes not displayed

    When I click on the element "portfoliosEditNameBtn"
    Then I expect that element "portfoliosInputName" becomes displayed

    When I click on the element "portfoliosInputName"
    And  I pause for 1000ms
    And  I clear the inputfield "portfoliosInputName"
    And  I pause for 1000ms
    And  I set "portfolio changed" to the inputfield "portfoliosInputName"
    And  I click on the element "portfoliosUserName"
    Then I expect that element "portfoliosName" matches the text "portfolio changed"

    Then I expect that element "trophyBtn" becomes displayed
    When I click on the element "trophyBtn"
    Then I expect that element "portfolioListNames" becomes displayed
    And  I expect that element "portfolioListNames" matches the text "portfolio changed"

  @PTA98
  Scenario: Snapshot can be updated in snapshot library
    When I open the site "/dashboard"
    Then I expect that element "trophyBtn" becomes displayed
    When I click on the element "trophyBtn"
    Then I expect that element "snapshotLibraryTab" becomes displayed
    When I click on the element "snapshotLibraryTab"
    And  I pause for 3000ms
    When I remove all elements "snapshotListTitles" with button "snapshotListDeleteBtn" under "snapshotListThreeDotsBtns" with confirmation "snapshotConfirmationDeleteBtn" till "0"
    And  I expect that element "snapshotListTitles" becomes not displayed

    When I click on the element "reposTab"
    And  I pause for 3000ms
    Then I expect that element "reposContainer" becomes displayed
    And  I expect that element "1stReposCard" becomes displayed
    When I click on the element "1stReposCard"
    And  I pause for 2000ms
    And  I click on the element "1stReposCard" if visible
    Then I expect that element "dateRangeFilter" becomes displayed
    When I click on the element "dateRangeFilter"
    Then I expect that element "last30DaysDateRange" becomes displayed
    When I click on the element "last30DaysDateRange"
    And  I pause for 1000ms
    And  I click on the element "dateRangeFilter"
    Then I expect that element "snapshotBtn" becomes displayed

    When I click on the element "snapshotBtn"
    Then I expect that element "saveSnapshotTitleInput" becomes displayed

    When I set "activity logs" with timestamp to the inputfield "saveSnapshotTitleInput"
    And  I click on the element "saveSnapshotDescriptionInput"
    And  I add "activity logs - snapshot description" to the inputfield "saveSnapshotDescriptionInput"
    And  I pause for 1000ms
    Then I expect that element "saveSnapshotAddToPortfolio" matches the text "None"
    And  I expect that element "saveSnapshotSaveBtn" becomes displayed
    When I click on the element "saveSnapshotSaveBtn"

    Then I expect that element "trophyBtn" becomes displayed
    When I click on the element "trophyBtn"
    Then I expect that element "snapshotLibraryTab" becomes displayed
    When I click on the element "snapshotLibraryTab"
    Then I expect that element "snapshotListTitles" becomes displayed
    And  I expect that element "snapshotListThreeDotsBtns" becomes displayed
    
    When I click on the element "snapshotListThreeDotsBtns"
    Then I expect that element "snapshotListEditBtn" becomes displayed
    When I click on the element "snapshotListEditBtn"
    Then I expect that element "saveSnapshotTitleInput" becomes displayed

    When I clear the inputfield "saveSnapshotTitleInput"
    And  I set "snapshot name updated" to the inputfield "saveSnapshotTitleInput"
    And  I click on the element "editSnapshotSaveBtn"

    Then I expect that element "saveSnapshotTitleInput" becomes not displayed
    And  I expect that element "snapshotListTitles" matches the text "snapshot name updated"
    And  I expect that element "snapshotListTitles" does appear exactly "1" times

  @PTA71 @smoke
  Scenario: Portfolios elements are displayed correctly for portfolio without snapshots
    When I open the site "/dashboard"
    Then I expect that element "trophyBtn" becomes displayed
    When I click on the element "trophyBtn"

    Then I expect that element "portfolioLibraryTab" becomes displayed
    And  I expect that element "addNewPortfolioBtn" becomes displayed
    When I click on the element "addNewPortfolioBtn"
    And  I pause for 3000ms
    Then I expect that element "portfolioListThreeDotsBtns" becomes displayed
    And  I remove all elements "portfolioListNames" with button "portfolioListDeleteBtn" under "portfolioListThreeDotsBtns" with confirmation "portfoliosDeleteSnapshotConfirmBtn" till "1"
    Then I expect that element "portfolioListNames" does appear exactly "1" times
    And  I expect that element "portfolioListThreeDotsBtns" becomes displayed

    Then I expect that element "portfolioListNames" becomes displayed
    And  I pause for 2000ms
    When I click on the "1st" element "portfolioListNames"
    And  I pause for 2000ms
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
    And  I expect that element "portfoliosChangePersonalOverviewBtn" becomes displayed

    When I click on the element "portfoliosChangePersonalOverviewBtn"
    Then I expect that element "portfoliosEditPersonalOverviewCancelBtn" becomes displayed

    When I click on the element "portfoliosEditPersonalOverviewCancelBtn"
    Then I expect that element "portfoliosEditPersonalOverviewInput" becomes not displayed

    When I click on the element "portfoliosUserGitHubLink"
    And  I pause for 3000ms
    And  I switch to opened tab "https://github.com/SemaQAAutomationAdmin"
    Then I expect that the absolute url is "github.com/SemaQAAutomationAdmin"

  @PTA99
  Scenario: Snapshot can be duplicated in snapshot library
    When I open the site "/dashboard"
    Then I expect that element "trophyBtn" becomes displayed
    When I click on the element "trophyBtn"
    Then I expect that element "snapshotLibraryTab" becomes displayed
    When I click on the element "snapshotLibraryTab"
    And  I pause for 3000ms
    When I remove all elements "snapshotListTitles" with button "snapshotListDeleteBtn" under "snapshotListThreeDotsBtns" with confirmation "snapshotConfirmationDeleteBtn" till "0"
    And  I expect that element "snapshotListTitles" becomes not displayed

    When I click on the element "reposTab"
    And  I pause for 3000ms
    Then I expect that element "reposContainer" becomes displayed
    And  I expect that element "1stReposCard" becomes displayed
    When I click on the element "1stReposCard"
    And  I pause for 2000ms
    And  I click on the element "1stReposCard" if visible
    Then I expect that element "dateRangeFilter" becomes displayed
    When I click on the element "dateRangeFilter"
    Then I expect that element "last30DaysDateRange" becomes displayed
    When I click on the element "last30DaysDateRange"
    And  I pause for 1000ms
    And  I click on the element "dateRangeFilter"
    Then I expect that element "snapshotBtn" becomes displayed

    When I click on the element "snapshotBtn"
    Then I expect that element "saveSnapshotTitleInput" becomes displayed

    When I set "activity logs" with timestamp to the inputfield "saveSnapshotTitleInput"
    And  I click on the element "saveSnapshotDescriptionInput"
    And  I add "activity logs - snapshot description" to the inputfield "saveSnapshotDescriptionInput"
    And  I pause for 1000ms
    Then I expect that element "saveSnapshotAddToPortfolio" matches the text "None"
    And  I expect that element "saveSnapshotSaveBtn" becomes displayed
    When I click on the element "saveSnapshotSaveBtn"
    Then I expect that element "saveSnapshotToPortfolioNotificationText" becomes not displayed

    Then I expect that element "trophyBtn" becomes displayed
    When I click on the element "trophyBtn"
    Then I expect that element "snapshotLibraryTab" becomes displayed
    When I click on the element "snapshotLibraryTab"
    Then I expect that element "snapshotListTitles" becomes displayed
    And  I expect that element "snapshotListTitles" does appear exactly "1" times
    And  I expect that element "snapshotListThreeDotsBtns" becomes displayed

    When I click on the element "snapshotListThreeDotsBtns"
    Then I expect that element "snapshotListDuplicateBtn" becomes displayed
    When I click on the element "snapshotListDuplicateBtn"
    Then I expect that element "saveSnapshotToPortfolioNotificationText" becomes displayed
    And  I expect that element "saveSnapshotToPortfolioNotificationText" matches the text "Snapshot was successfully duplicated"
    And  I expect that element "snapshotListTitles" does appear exactly "2" times