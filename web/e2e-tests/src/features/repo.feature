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

      When I click on the element "repoCardViewBtn"
      Then I expect that element "reposCards" becomes displayed
      And  I expect that element "reposListRows" becomes not displayed

  @admin  @PTA52
  Scenario: Activity log elements are displayed for repo
      Then I expect that element "reposContainer" becomes displayed
      And  I expect that element "reposCards" becomes displayed
      When I click on the element "1stReposCard"
      And I pause for 30000ms
#      Then I expect that element "reposDropDownList" becomes displayed
      And  I expect that element "activityLogTabBtn" becomes displayed
      And  I expect that element "codeStatsTabBtn" becomes displayed
      And  I expect that element "dateRangeFilter" becomes displayed
      And  I expect that element "fromFilter" becomes displayed
      And  I expect that element "toFilter" becomes displayed
      And  I expect that element "summariesFilter" becomes displayed
      And  I expect that element "tagsFilter" becomes displayed
      And  I expect that element "pullRequestsFilter" becomes displayed
#      And  I expect that element "search" becomes displayed
      And  I expect that element "smartCodeReviewsIndicator" becomes displayed
      And  I expect that element "smartCommentsIndicator" becomes displayed
      And  I expect that element "smartCommentersIndicator" becomes displayed
#      And  I expect that element "semaUsersIndicator" becomes displayed
#      And  I expect that element "commentsList" becomes displayed
      And  I expect that element "snapshotBtn" becomes displayed