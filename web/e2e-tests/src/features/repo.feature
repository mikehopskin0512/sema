@repo
Feature: Repo

  @admin  @PTA48
  Scenario: My Repos can change card view to list view
      Then I expect that element "reposContainer" becomes displayed
      And  I expect that element "reposCards" becomes displayed
      And  I expect that element "reposListRows" becomes not displayed
      And  I expect that element "reposCards" becomes displayed
      And  I expect that element "repoListViewBtn" becomes displayed
      And  I expect that element "repoCardViewBtn" becomes displayed
      When I click on the element "repoListViewBtn"
      Then I expect that element "reposCards" becomes not displayed
      And  I expect that element "reposListRows" becomes displayed
#        And I pause for 30000ms
      When I click on the element "repoCardViewBtn"
      Then I expect that element "reposCards" becomes displayed
      And  I expect that element "reposListRows" becomes not displayed

  @admin  @PTA52
  Scenario: Activity log elements are displayed for repo
      Then I expect that element "reposContainer" becomes displayed
      And  I expect that element "reposCards" becomes displayed
      When I click on the element "1stReposCard"
#      Then I expect that element "reposDropDownList" becomes displayed
      And  I expect that element "activityLogTabBtn" becomes displayed
      And  I expect that element "codeStatsTabBtn" becomes displayed
      And  I expect that element "dateRangeFilter" becomes displayed
      And  I expect that element "fromFilter" becomes displayed
      And  I expect that element "toFilter" becomes displayed
      And  I expect that element "summariesFilter" becomes displayed
      And  I expect that element "tagsFilter" becomes displayed
      And  I expect that element "pullRequestsFilter" becomes displayed
      And  I expect that element "searchFilterBtn" becomes displayed
      And  I expect that element "searchFilterInput" becomes not displayed
      And  I expect that element "smartCodeReviewsIndicator" becomes displayed
      And  I expect that element "smartCommentsIndicator" becomes displayed
      And  I expect that element "smartCommentersIndicator" becomes displayed
      And  I expect that element "semaUsersIndicator" becomes displayed
#      And  I expect that element "commentsList" becomes displayed
      And  I expect that element "noCommentsList" becomes displayed
      And  I expect that element "snapshotBtn" becomes displayed

      And  I expect that element "codeStatsSummaries" becomes not displayed
      And  I expect that element "codeStatsTags" becomes not displayed
      And  I expect that element "codeStatsSummariesSnapshotBtn" becomes not displayed
      And  I expect that element "codeStatsTagsSnapshotBtn" becomes not displayed

      When I click on the element "searchFilterBtn"
      Then I expect that element "searchFilterInput" becomes displayed

    @admin  @PTA52_2
    Scenario: Activity log elements are displayed for repo with selected date range
        Then I expect that element "reposContainer" becomes displayed
        And  I expect that element "reposCards" becomes displayed
        When I click on the element "1stReposCard"
#        Then I expect that element "reposDropDownList" becomes displayed

#        When I click on the element "reposDropDownList"
#        And  I click on the element "repoDropDownOption1"
        Then I expect that element "dateRangeFilter" becomes displayed
        When I click on the element "dateRangeFilter"
        Then I expect that element "last7DaysDateRange" becomes displayed
        And  I expect that element "last14DaysDateRange" becomes displayed
        And  I expect that element "last30DaysDateRange" becomes displayed
        And  I expect that element "last3MonthsDateRange" becomes displayed
        And  I expect that element "last12MonthsDateRange" becomes displayed
        And  I expect that element "allTimeDateRange" becomes displayed

        When I click on the element "allTimeDateRange"
        And  I click on the element "dateRangeFilter"
        Then I expect that element "fromFilter" becomes displayed
        And  I expect that element "toFilter" becomes displayed
        And  I expect that element "summariesFilter" becomes displayed
        And  I expect that element "tagsFilter" becomes displayed
        And  I expect that element "pullRequestsFilter" becomes displayed
        And  I expect that element "searchFilterBtn" becomes displayed
        And  I expect that element "searchFilterInput" becomes not displayed
        And  I expect that element "smartCodeReviewsIndicator" becomes displayed
        And  I expect that element "smartCommentsIndicator" becomes displayed
        And  I expect that element "smartCommentersIndicator" becomes displayed
        And  I expect that element "semaUsersIndicator" becomes displayed
        And  I expect that element "commentsList" becomes displayed
        And  I expect that element "snapshotBtn" becomes displayed

        And  I expect that element "codeStatsSummaries" becomes not displayed
        And  I expect that element "codeStatsTags" becomes not displayed
        And  I expect that element "codeStatsSummariesSnapshotBtn" becomes not displayed
        And  I expect that element "codeStatsTagsSnapshotBtn" becomes not displayed

    @admin  @PTA53
    Scenario: Code stats elements are displayed for repo
        Then I expect that element "reposContainer" becomes displayed
        And  I expect that element "reposCards" becomes displayed
        When I click on the element "1stReposCard"
        Then I expect that element "codeStatsTabBtn" becomes displayed

        When I click on the element "codeStatsTabBtn"
        Then I expect that element "dateRangeFilter" becomes displayed
        And  I expect that element "fromFilter" becomes not displayed
        And  I expect that element "toFilter" becomes not displayed
        And  I expect that element "summariesFilter" becomes displayed
        And  I expect that element "tagsFilter" becomes displayed
        And  I expect that element "pullRequestsFilter" becomes displayed
        And  I expect that element "searchFilterBtn" becomes displayed
        And  I expect that element "searchFilterInput" becomes not displayed
        And  I expect that element "smartCodeReviewsIndicator" becomes displayed
        And  I expect that element "smartCommentsIndicator" becomes displayed
        And  I expect that element "smartCommentersIndicator" becomes displayed
        And  I expect that element "semaUsersIndicator" becomes displayed
        And  I expect that element "noCommentsList" becomes not displayed
        And  I expect that element "snapshotBtn" becomes not displayed

        And  I expect that element "codeStatsSummaries" becomes displayed
        And  I expect that element "codeStatsTags" becomes displayed
        And  I expect that element "codeStatsSummariesSnapshotBtn" becomes not displayed
        And  I expect that element "codeStatsTagsSnapshotBtn" becomes not displayed

        When I click on the element "searchFilterBtn"
        Then I expect that element "searchFilterInput" becomes displayed

    @admin  @PTA53_2
    Scenario: Code stats elements are displayed for repo with selected date range
        Then I expect that element "reposContainer" becomes displayed
        And  I expect that element "reposCards" becomes displayed
        When I click on the element "1stReposCard"
#        Then I expect that element "reposDropDownList" becomes displayed

#        When I click on the element "reposDropDownList"
#        And  I click on the element "repoDropDownOption1"
        Then I expect that element "codeStatsTabBtn" becomes displayed

        When I click on the element "codeStatsTabBtn"
        Then I expect that element "dateRangeFilter" becomes displayed
        When I click on the element "dateRangeFilter"
        Then I expect that element "last7DaysDateRange" becomes displayed
        And  I expect that element "last14DaysDateRange" becomes displayed
        And  I expect that element "last30DaysDateRange" becomes displayed
        And  I expect that element "last3MonthsDateRange" becomes displayed
        And  I expect that element "last12MonthsDateRange" becomes displayed
        And  I expect that element "allTimeDateRange" becomes displayed

        When I click on the element "allTimeDateRange"
        And  I click on the element "dateRangeFilter"
        And  I expect that element "summariesFilter" becomes displayed
        And  I expect that element "tagsFilter" becomes displayed
        And  I expect that element "pullRequestsFilter" becomes displayed
        And  I expect that element "searchFilterBtn" becomes displayed
        And  I expect that element "searchFilterInput" becomes not displayed

        And  I expect that element "smartCodeReviewsIndicator" becomes displayed
        And  I expect that element "smartCommentsIndicator" becomes displayed
        And  I expect that element "smartCommentersIndicator" becomes displayed
        And  I expect that element "semaUsersIndicator" becomes displayed

        And  I expect that element "codeStatsSummaries" becomes displayed
        And  I expect that element "codeStatsTags" becomes displayed
        And  I expect that element "codeStatsSummariesSnapshotBtn" becomes displayed
#        And  I expect that element "codeStatsTagsSnapshotBtn" becomes displayed