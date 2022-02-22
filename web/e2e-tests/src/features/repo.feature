@repo
Feature: Repo

  @admin  @PTA25
  Scenario: My Repos can change card view to list view
      Then I expect that element "userLogo" becomes displayed
      And  I expect that element "userLogo" does appear exactly "1" times
      When I click on the element "userLogo"
      Then I expect that element "semaCorporateTeamLogo" becomes displayed
      And  I expect that element "semaCorporateTeamLogo" does appear exactly "1" times
      And  I expect that element "userLogo" does appear exactly "1" times
#
#      And  I expect that element "semaSmartCodeReviewsLogo" becomes displayed
#      And  I expect that element "semaSmartCodeReviewsLogo" does appear exactly "1" times

      And  I expect that element "createTeamBtn" becomes displayed
      And  I expect that element "createTeamBtn" does appear exactly "1" times

      And  I expect that element "accountBtn" becomes displayed
      And  I expect that element "accountBtn" does appear exactly "1" times