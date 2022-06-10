@dashboard @regression
Feature: Dashboard options

    @PTA25 @smoke
    Scenario: User profile elements are displayed
        When I open the site "/dashboard"
        Then I expect that element "userLogo" becomes displayed
        And  I expect that element "userLogo" does appear exactly "1" times
        When I click on the element "userLogo"
        Then I expect that element "semaCorporateOrganizationLogo" becomes displayed
        And  I expect that element "semaCorporateOrganizationLogo" does appear exactly "1" times
        And  I expect that element "userLogo" does appear exactly "1" times
        #      And  I expect that element "semaSmartCodeReviewsLogo" becomes displayed
        #      And  I expect that element "semaSmartCodeReviewsLogo" does appear exactly "1" times

        And  I expect that element "createOrganizationBtn" becomes displayed
        And  I expect that element "createOrganizationBtn" does appear exactly "1" times
        And  I expect that element "accountBtn" becomes displayed
        And  I expect that element "accountBtn" does appear exactly "1" times

    @PTA24
    Scenario: Contact support button sends request
        When I open the site "/dashboard"
        Then I expect that element "reposContainer" becomes displayed
        When I wait on element "footerSupportBtn" for 10000ms to be displayed
        And  I click on the button "footerSupportBtn"
        And  I wait on element "supportSection" for 10000ms to be displayed
        And  I expect that the url is "/support"
        And  I expect that the title is "Help and Support"
        And  I wait on element "contactSupportBtn" for 10000ms to be displayed
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

    @PTA24_2 @smoke
    Scenario: Error messages works on contact support modal
        When I open the site "/dashboard"
        Then I expect that element "reposContainer" becomes displayed
        And  I wait on element "footerSupportBtn" for 10000ms to be displayed
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

    @PTA34
    Scenario: Footer action Release Notes leads to info page
        When I open the site "/dashboard"
        Then I expect that element "reposContainer" becomes displayed
        When I wait on element "footerReleaseNoteBtn" for 10000ms to be displayed
        And  I scroll to element "footerReleaseNoteBtn"
        And  I click on the button "footerReleaseNoteBtn"
        And  I expect that the url is "/release-notes"
        #TODO: Andryi please check this step
    #And  I expect that the title is "Release Notes"
    #And  I expect that element "releaseNoteList" becomes displayed

    @PTA35
    Scenario: Footer action Terms and Conditions leads to info page
        When I open the site "/dashboard"
        Then I expect that element "reposContainer" becomes displayed
        When I wait on element "footerTermsAndConditionsBtn" for 10000ms to be displayed
        And  I click on the button "footerTermsAndConditionsBtn"
        And  I expect that the url is "/terms-and-conditions"
        #TODO: Andryi please check this step
        #And  I expect that the title is "Terms and Conditions"
        #And  I expect that element "termsAndConditionSection" becomes displayed

    @PTA37
    Scenario: Footer action Send Feedback leads to info page
        When I open the site "/dashboard"
        Then I expect that element "reposContainer" becomes displayed
        When I wait on element "footerSendFeedbackBtn" for 10000ms to be displayed
        And  I click on the button "footerSendFeedbackBtn"
        Then I expect that element "supportModal" becomes displayed
        And  I expect that element "supportModalTitleInput" becomes displayed
        And  I expect that element "supportModalTypeSelect" becomes displayed
        And  I expect that option "Feedback" is selected in the dropdown "supportModalTypeSelect"
        And  I expect that element "supportModalDetailInput" becomes displayed
        And  I expect that element "supportModalEmailInput" becomes displayed
        And  I expect that element "supportModalCancelBtn" becomes displayed
        And  I expect that element "supportModalSubmitBtn" becomes displayed

#    @PTA38     #not needed anymore
#    Scenario: Footer action Idea Board leads to info page
#        When I open the site "/dashboard"
#        Then I expect that element "reposContainer" becomes displayed
#        When I wait on element "footerIdeaBoardBtn" for 10000ms to be displayed
#        And  I click on the button "footerIdeaBoardBtn"
#        #TODO: Andryi please check this step
        #And  I expect that the absolute url is "sema.uservoice.com/forums/934797-sema"
        #And  I expect that element "createIdeaInput" becomes displayed

    @PTA39
    Scenario: Footer Email button opens the support modal
        When I open the site "/dashboard"
        And  I wait on element "emailBtn" for 10000ms to be displayed
        When I click on the button "emailBtn"
        Then I expect that element "supportModal" becomes displayed
        And  I expect that element "supportModalTitleInput" becomes displayed
        And  I expect that element "supportModalTypeSelect" becomes displayed
        And  I expect that option "Support" is selected in the dropdown "supportModalTypeSelect"
        And  I expect that element "supportModalDetailInput" becomes displayed
        And  I expect that element "supportModalEmailInput" becomes displayed
        And  I expect that element "supportModalCancelBtn" becomes displayed
        And  I expect that element "supportModalSubmitBtn" becomes displayed

#    @PTA40  #not needed anymore
#    Scenario: Footer Idea Board button opens the board in a new tab
#        When I open the site "/dashboard"
#        Then I expect that element "ideaBoardBtn" becomes displayed
#        When I click on the button "ideaBoardBtn"
#        And  I pause for 200000ms
#        And  I switch to opened tab
#        And  I expect that the absolute url is "sema.uservoice.com/forums/934797-sema"
#        And  I expect that element "createIdeaInput" becomes displayed

    @PTA41 @smoke
    Scenario: Footer's social media links are present on a buttons
        When I open the site "/dashboard"
        And I scroll to element "footerLinkedInBtn"         
        And I expect that element "footerLinkedInBtn" becomes displayed
        #And I scroll to element "footerInstagramBtn"
        And I expect that element "footerInstagramBtn" becomes displayed
        #And I scroll to element "footerFacebookBtn"
        And I expect that element "footerFacebookBtn" becomes displayed
        #And I scroll to element "footerTwitterBtn"
        And I expect that element "footerTwitterBtn" becomes displayed