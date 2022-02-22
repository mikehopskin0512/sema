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
