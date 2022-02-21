@dashboard
Feature: Dashboard options

  @admin  @PTA25
  Scenario: User profile elements are displayed
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

    @admin  @PTA24
    Scenario: Contact support button sends request
        Then I expect that element "footerSupportBtn" becomes displayed
        When I click on the button "footerSupportBtn"
        Then I expect that element "supportSection" becomes displayed
        And  I expect that the url is "/support"
        And  I expect that the title is "Help and Support"
        And  I expect that element "contactSupportBtn" becomes displayed

        When I click on the element "contactSupportBtn"
        Then I expect that element "supportModal" becomes displayed
        And  I expect that element "supportModalTitleInput" becomes displayed
        And  I expect that element "supportModalTypeSelect" becomes displayed
        And  I expect that option "Support" is selected in the dropdown "supportModalTypeSelect"
        And  I expect that element "supportModalDetailInput" becomes displayed
        And  I expect that element "supportModalEmailInput" becomes displayed
        And  I expect that element "supportModalCancelBtn" becomes displayed
        And  I expect that element "supportModalSubmitBtn" becomes displayed

        When I click on the element "supportModalCancelBtn"
        Then I expect that element "supportModal" becomes not displayed

        When I click on the element "contactSupportBtn"
        Then I expect that element "supportModalTitleInput" becomes displayed
        When I set "test stage support" with timestamp to the inputfield "supportModalTitleInput"
        And  I click on the element "supportModalSubmitBtn"
        Then I expect that element "supportModal" becomes not displayed

    @admin  @PTA24_2
    Scenario: Error messages works on contact support modal
        Then I expect that element "footerSupportBtn" becomes displayed
        When I click on the button "footerSupportBtn"
        And  I expect that element "contactSupportBtn" becomes displayed

        When I click on the element "contactSupportBtn"
        And  I expect that element "supportModalEmailInput" becomes displayed
        And  I click on the element "supportModalEmailInput"
        And  I clear the inputfield "supportModalEmailInput"
        When I click on the element "supportModalSubmitBtn"
        Then I expect that element "supportModalTitleError" becomes displayed
        And  I expect that element "supportModalTitleError" matches the text "Title is required"
        Then I expect that element "supportModalEmailError" becomes displayed
        And  I expect that element "supportModalEmailError" matches the text "Email is required"

        When I set "invalidEmail" to the inputfield "supportModalEmailInput"
        Then I expect that element "supportModalEmailError" becomes displayed
        And  I expect that element "supportModalEmailError" matches the text "Entered value does not match email format"

        When I click on the element "supportModalEmailInput"
        And  I clear the inputfield "supportModalEmailInput"
        And  I set "invalidEmail@gmail.com" with timestamp to the inputfield "supportModalEmailInput"
        And  I set "test title" with timestamp to the inputfield "supportModalTitleInput"
        Then I expect that element "supportModalTitleError" becomes not displayed
        And  I expect that element "supportModalEmailError" becomes not displayed

    @admin  @PTA34
    Scenario: Footer action Release Notes leads to info page
        Then I expect that element "footerReleaseNoteBtn" becomes displayed
        When I click on the button "footerReleaseNoteBtn"
        And  I expect that the url is "/release-notes"
        And  I expect that the title is "Release Notes"
        And  I expect that element "releaseNoteList" becomes displayed

    @admin  @PTA35
    Scenario: Footer action Terms and Conditions leads to info page
        Then I expect that element "footerTermsAndConditionsBtn" becomes displayed
        When I click on the button "footerTermsAndConditionsBtn"
        And  I expect that the url is "/terms-and-conditions"
        And  I expect that the title is "Terms and Conditions"
        And  I expect that element "termsAndConditionSection" becomes displayed

    @admin  @PTA37
    Scenario: Footer action Send Feedback leads to info page
        Then I expect that element "footerSendFeedbackBtn" becomes displayed
        When I click on the button "footerSendFeedbackBtn"
        Then I expect that element "supportModal" becomes displayed
        And  I expect that element "supportModalTitleInput" becomes displayed
        And  I expect that element "supportModalTypeSelect" becomes displayed
        And  I expect that option "Feedback" is selected in the dropdown "supportModalTypeSelect"
        And  I expect that element "supportModalDetailInput" becomes displayed
        And  I expect that element "supportModalEmailInput" becomes displayed
        And  I expect that element "supportModalCancelBtn" becomes displayed
        And  I expect that element "supportModalSubmitBtn" becomes displayed

    @admin  @PTA38
    Scenario: Footer action Idea Board leads to info page
        Then I expect that element "footerIdeaBoardBtn" becomes displayed
        When I click on the button "footerIdeaBoardBtn"
        And  I expect that the absolute url is "sema.uservoice.com/forums/934797-sema"
        And  I expect that element "createIdeaInput" becomes displayed

    @admin  @PTA39
    Scenario: Footer Email button opens the support modal
        Then I expect that element "emailBtn" becomes displayed
        When I click on the button "emailBtn"
        Then I expect that element "supportModal" becomes displayed
        And  I expect that element "supportModalTitleInput" becomes displayed
        And  I expect that element "supportModalTypeSelect" becomes displayed
        And  I expect that option "Support" is selected in the dropdown "supportModalTypeSelect"
        And  I expect that element "supportModalDetailInput" becomes displayed
        And  I expect that element "supportModalEmailInput" becomes displayed
        And  I expect that element "supportModalCancelBtn" becomes displayed
        And  I expect that element "supportModalSubmitBtn" becomes displayed

    @admin  @PTA40
    Scenario: Footer Idea Board button opens the board in a new tab
        Then I expect that element "ideaBoardBtn" becomes displayed
        When I click on the button "ideaBoardBtn"
        And  I pause for 2000ms
        And  I switch to opened tab
        And  I expect that the absolute url is "sema.uservoice.com/forums/934797-sema"
        And  I expect that element "createIdeaInput" becomes displayed

    @admin  @PTA41
    Scenario: Footer's social media links are present on a buttons
#        Then I expect that element "footerIdeaBoardBtn" becomes displayed
#        When I click on the button "footerIdeaBoardBtn"
#        And  I expect that the absolute url is "sema.uservoice.com/forums/934797-sema"
#        And  I expect that element "createIdeaInput" becomes displayed