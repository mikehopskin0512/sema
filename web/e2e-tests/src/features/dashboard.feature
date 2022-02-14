@dashboard
Feature: Dashboard options

  @admin  @PTA-25
  Scenario: Snippets collection can be turned on and turned off
    When I click on the element "snippetsTab"
    Then I expect that element "collectionArea" becomes displayed
    When I click on the element "firstInActiveCollectionToggle"
    Then I expect that element "firstInActiveCollectionName" becomes displayed
    When I save the name of collection "firstInActiveCollectionName"
    And  I click on the element "firstInActiveCollectionToggle"
    Then I expect that selected collection element "activeCollectionsNames" is enabled
    When I save the name of collection "firstActiveCollectionName"
    And  I click on the element "firstActiveCollectionToggle"
    Then I expect that selected collection element "inactiveCollectionsNames" is enabled