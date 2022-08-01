#@organization_management @regression
#Feature: Organization management
#
##    @PTA80 @smoke   not needed anymore    #https://semalab.atlassian.net/browse/WEST-1319
##    Scenario: Sema member can create new organization
##        Then I expect that element "companyDropdown" becomes displayed
##    When I click on the element "companyDropdown"
##    Then I expect that element "semaCorporateOrganizationLogo" becomes displayed
##    When I hover over element "semaCorporateOrganizationLogo"
##    Then I expect that element "highlightedTeam" becomes displayed
#    When I click on the element "highlightedTeam"
##
##        Then I expect that element "createOrganizationNameInput" becomes displayed
##        And  I expect that element "createOrganizationURLInput" becomes displayed
##        And  I expect that element "createOrganizationURLCheckBtn" becomes displayed
##        And  I expect that element "createOrganizationDescriptionInput" becomes displayed
##        And  I expect that element "createOrganizationCancelBtn" becomes displayed
##        And  I expect that element "createOrganizationCreateBtn" becomes displayed
##
##        When I set "Test Organization" with timestamp to the inputfield "createOrganizationNameInput"
##        And  I set "testOrganization" to the inputfield "createOrganizationURLInput"
##        And  I set "test description" to the inputfield "createOrganizationDescriptionInput"
##        And  I click on the element "createOrganizationCancelBtn"
##
##        Then I expect that element "createOrganizationNameInput" becomes not displayed
##        And  I expect that element "userLogo" becomes displayed
##        When I click on the element "userLogo"
##        Then I expect that element "createOrganizationBtn" becomes displayed
##        When I click on the element "createOrganizationBtn"
##
##        Then I expect that element "createOrganizationNameInput" not matches the text "Test Organization"
##        And  I expect that element "createOrganizationURLInput" not matches the text "testOrganization"
##        And  I expect that element "createOrganizationDescriptionInput" not matches the text "test description"
##
##        When I set "Test Organization" with timestamp to the inputfield "createOrganizationNameInput"
##        And  I set "test description" to the inputfield "createOrganizationDescriptionInput"
##        And  I set "testOrganization" with timestamp to the inputfield "createOrganizationURLInput"
##        And  I click on the element "createOrganizationCreateBtn"
##
##        Then I expect that element "createOrganizationCreateBtn" becomes not displayed
##        And  I expect that the organization url is correct
##        And  I expect that element "organizationMetricsBoard" becomes displayed
##        And  I expect that element "organizationMembersList" becomes displayed
#
#    @PTA77  @smoke
#    Scenario: Dashboard elements are displayed for Sema Corporate Organization account
#        Then I expect that element "companyDropdown" becomes displayed
#        When I click on the element "companyDropdown"
#        Then I expect that element "semaCorporateOrganizationLogo" becomes displayed
#        When I hover over element "semaCorporateOrganizationLogo"
#        Then I expect that element "highlightedTeam" becomes displayed
#    When I click on the element "highlightedTeam"
#        Then I expect that element "dashboard" becomes displayed
#        When I click on the element "dashboard"
#
##        Then I expect that element "organizationMetricsBoard" becomes displayed
##        And  I expect that element "organizationSemaCodeReviews" becomes displayed
##        And  I expect that element "organizationSemaComments" becomes displayed
##        And  I expect that element "organizationSemaCommenters" becomes displayed
##        And  I expect that element "organizationSemaUsers" becomes displayed
#        And  I expect that element "organizationMembersList" becomes displayed
#        And  I expect that element "viewAllOrganizationMembersBtn" becomes displayed
#        And  I expect that element "dashboardInviteNewMembersBtn" becomes displayed
#        And  I expect that element "organizationRecentReposBoard" becomes displayed
#        And  I expect that element "organizationRecentReposCards" becomes displayed
#        And  I expect that element "organizationViewAllReposBtn" becomes displayed
#        And  I expect that element "updateYourOrganizationSnippetsBtn" becomes displayed
#        And  I expect that element "tellMeMoreLinkBtn" becomes displayed
#
#    @PTA81
#    Scenario: Invite new members to the Organization from the Dashboard
#        Then I expect that element "companyDropdown" becomes displayed
#        When I click on the element "companyDropdown"
#        Then I expect that element "semaCorporateOrganizationLogo" becomes displayed
#        When I hover over element "semaCorporateOrganizationLogo"
#        Then I expect that element "highlightedTeam" becomes displayed
    #    When I click on the element "highlightedTeam"

#        Then I expect that element "dashboard" becomes displayed
#        When I click on the element "dashboard"
#        Then I expect that element "dashboardInviteNewMembersBtn" becomes displayed
#        When I click on the element "dashboardInviteNewMembersBtn"
#        Then I expect that element "inviteNewOrganizationMemberInput" becomes displayed
#        And  I expect that element "roleNewOrganizationMemberInput" becomes displayed
##        And  I expect that element "copyInvitationLinkBtn" becomes displayed
#        And  I expect that element "cancelInvitationNewOrganizationMemberBtn" becomes displayed
#        And  I expect that element "inviteNewOrganizationMemberBtn" becomes displayed
#
#        When I click on the element "inviteNewOrganizationMemberInput"
#        And  I set "qateam+autotest1@semasoftware.com" to the inputfield "inviteNewOrganizationMemberInput"
#        And  I click on the element "roleNewOrganizationMemberElement"
#        And  I set "Member" to the inputfield "roleNewOrganizationMemberInput"
#        And  I press "Enter"
#        And  I click on the element "cancelInvitationNewOrganizationMemberBtn"
#
#        Then I expect that element "inviteNewOrganizationMemberInput" becomes not displayed
#        And  I expect that element "dashboardInviteNewMembersBtn" becomes displayed
#
#        When I click on the element "dashboardInviteNewMembersBtn"
#        And  I set "qateam+autotest1@semasoftware.com" to the inputfield "inviteNewOrganizationMemberInput"
#        And  I click on the element "roleNewOrganizationMemberElement"
#        And  I set "Member" to the inputfield "roleNewOrganizationMemberInput"
#        And  I press "Enter"
#        And  I click on the element "inviteNewOrganizationMemberBtn"
#
#        Then I expect that element "invitationsSentNotificationText" becomes displayed
#        And  I expect that element "invitationsSentNotificationCloseBtn" becomes displayed
#
#        When I click on the element "invitationsSentNotificationCloseBtn"
#        Then I expect that element "organizationManagementTab" becomes displayed
#
##    @PTA81_2    not needed anymore
##    Scenario: Invite new members to the organization from the Organization Management
##        Then I expect that element "companyDropdown" becomes displayed
##        When I click on the element "companyDropdown"
##        Then I expect that element "semaCorporateOrganizationLogo" becomes displayed
##        When I hover over element "semaCorporateOrganizationLogo"
##        Then I expect that element "highlightedTeam" becomes displayed
    #    When I click on the element "highlightedTeam"

##        Then I expect that element "dashboard" becomes displayed
##        When I click on the element "dashboard"
##        Then I expect that element "viewAllOrganizationMembersBtn" becomes displayed
##
##        When I click on the element "viewAllOrganizationMembersBtn"
##        Then I expect that element "organizationManagementInviteNewMemberBtn" becomes displayed
##        When I click on the element "organizationManagementInviteNewMemberBtn"
##        Then I expect that element "inviteNewOrganizationMemberInput" becomes displayed
##        And  I set "qateam+autotest1@semasoftware.com" to the inputfield "inviteNewOrganizationMemberInput"
##        And  I click on the element "roleNewOrganizationMemberElement"
##        And  I set "Member" to the inputfield "roleNewOrganizationMemberInput"
##        And  I press "Enter"
##        And  I click on the element "inviteNewOrganizationMemberBtn"
##
##        Then I expect that element "invitationsSentNotificationText" becomes displayed
##        And  I expect that element "invitationsSentNotificationCloseBtn" becomes displayed
##
##        When I click on the element "invitationsSentNotificationCloseBtn"
##        Then I expect that element "organizationManagementTab" becomes displayed
##        And  I expect that element "organizationMembersTable" becomes displayed
#
#    @PTA82  @smoke
#    Scenario: Organization member role can be changed in the Organization Management tab
#        Then I expect that element "companyDropdown" becomes displayed
#        When I click on the element "companyDropdown"
#        Then I expect that element "semaCorporateOrganizationLogo" becomes displayed
#        When I hover over element "semaCorporateOrganizationLogo"
#        Then I expect that element "highlightedTeam" becomes displayed
    #    When I click on the element "highlightedTeam"

#        Then I expect that element "dashboard" becomes displayed
#        When I click on the element "dashboard"
#        Then I expect that element "viewAllOrganizationMembersBtn" becomes displayed
#        When I click on the element "viewAllOrganizationMembersBtn"
#
#        And  I pause for 3000ms
#        Then I expect that element "organizationMembersTableEmail" becomes displayed
#        And  I expect that element "organizationMembersTableRole" becomes displayed
#        And  I expect that element "organizationMembersTableActionBtn" becomes displayed
#
#        When I change the role for "sema.test.code.author@gmail.com" to "Member"
#        Then I expect that element "changeRoleConfirmBtn" becomes displayed
#        And  I expect that element "changeRoleCancelBtn" becomes displayed
#        And  I expect that element "changeRoleConfirmationUserName" becomes displayed
#        And  I expect that element "changeRoleConfirmationUserRole" becomes displayed
#        And  I expect that element "changeRoleConfirmationUserName" matches the text "Sema Test Code Author"
#        And  I expect that element "changeRoleConfirmationUserRole" matches the text "Member"
#
#        When I click on the element "changeRoleCancelBtn"
#        Then I expect that element "changeRoleConfirmBtn" becomes not displayed
#        And  I expect that element "changeRoleCancelBtn" becomes not displayed
#        And  I expect that element "changeRoleConfirmationUserName" becomes not displayed
#        And  I expect that element "changeRoleConfirmationUserRole" becomes not displayed
#
#        When I change the role for "sema.test.code.author@gmail.com" to "Member"
#        Then I expect that element "changeRoleConfirmationUserName" matches the text "Sema Test Code Author"
#        And  I expect that element "changeRoleConfirmationUserRole" matches the text "Member"
#        When I click on the element "changeRoleConfirmBtn"
#        Then I expect that the role for user "sema.test.code.author@gmail.com" is updated to "Member"
#
#        When I change the role for "sema.test.code.author@gmail.com" to "Library Editor"
#        Then I expect that element "changeRoleConfirmationUserName" matches the text "Sema Test Code Author"
#        And  I expect that element "changeRoleConfirmationUserRole" matches the text "Library Editor"
#        When I click on the element "changeRoleConfirmBtn"
#        Then I expect that the role for user "sema.test.code.author@gmail.com" is updated to "Library Editor"
#
#    @PTA82_2
#    Scenario: Organization member role can be changed to to each of roles in the Organization Management tab
#        Then I expect that element "companyDropdown" becomes displayed
#        When I click on the element "companyDropdown"
#        Then I expect that element "semaCorporateOrganizationLogo" becomes displayed
#        When I hover over element "semaCorporateOrganizationLogo"
#        Then I expect that element "highlightedTeam" becomes displayed
    #    When I click on the element "highlightedTeam"

#        Then I expect that element "dashboard" becomes displayed
#        When I click on the element "dashboard"
#        Then I expect that element "viewAllOrganizationMembersBtn" becomes displayed
#
#        When I click on the element "viewAllOrganizationMembersBtn"
#        And  I pause for 3000ms
#        Then I expect that element "organizationMembersTableRole" becomes displayed
#
#        When I change the role for "sema.test.code.author@gmail.com" to "Member"
#        Then I expect that element "changeRoleConfirmationUserName" matches the text "Sema Test Code Author"
#        And  I expect that element "changeRoleConfirmationUserRole" matches the text "Member"
#        When I click on the element "changeRoleConfirmBtn"
#        Then I expect that the role for user "sema.test.code.author@gmail.com" is updated to "Member"
#
#        When I change the role for "sema.test.code.author@gmail.com" to "Admin"
#        Then I expect that element "changeRoleConfirmationUserName" matches the text "Sema Test Code Author"
#        And  I expect that element "changeRoleConfirmationUserRole" matches the text "Admin"
#        When I click on the element "changeRoleConfirmBtn"
#        Then I expect that the role for user "sema.test.code.author@gmail.com" is updated to "Admin"
#
#        When I change the role for "sema.test.code.author@gmail.com" to "Library Editor"
#        Then I expect that element "changeRoleConfirmationUserName" matches the text "Sema Test Code Author"
#        And  I expect that element "changeRoleConfirmationUserRole" matches the text "Library Editor"
#        When I click on the element "changeRoleConfirmBtn"
#        Then I expect that the role for user "sema.test.code.author@gmail.com" is updated to "Library Editor"
#
##    @PTA84    not needed anymore https://semalab.atlassian.net/browse/WEST-1362
##    Scenario: Organization profile data can be updated
##        Then I expect that element "userLogo" becomes displayed
##        When I click on the element "userLogo"
##        Then I expect that element "semaCorporateOrganizationGearBtn" becomes displayed
##        When I click on the element "semaCorporateOrganizationGearBtn"
##        Then I expect that element "editOrganizationProfileBtn" becomes displayed
##        When I click on the element "editOrganizationProfileBtn"
##        Then I expect that element "editOrganizationNameInput" becomes displayed
##        And  I expect that element "editOrganizationURLInput" becomes displayed
##        And  I expect that element "editOrganizationURLCheckBtn" becomes displayed
##        And  I expect that element "editOrganizationDescriptionInput" becomes displayed
##        And  I expect that element "editOrganizationCancelBtn" becomes displayed
##        And  I expect that element "editOrganizationSaveBtn" becomes displayed
##        And  I expect that element "uploadProfilePictureBtn" becomes displayed
##
##        When I clear the inputfield "editOrganizationNameInput"
##        And  I clear the inputfield "editOrganizationURLInput"
##        And  I clear the inputfield "editOrganizationDescriptionInput"
##
##        And  I set "edited team name" to the inputfield "editOrganizationNameInput"
##        And  I set "edited team description" to the inputfield "editOrganizationDescriptionInput"
##        And  I set "edited team url" to the inputfield "editOrganizationURLInput"
##        And  I click on the element "editOrganizationSaveBtn"
##        Then I expect that element "organizationMembersTable" becomes displayed
##        And  I expect that element "changeOrganizationProfileNotification" becomes displayed
##        And  I expect that element "organizationName" becomes displayed
##        And  I expect that element "organizationDescription" becomes displayed
##        And  I expect that element "organizationName" matches the text "edited team name"
##        And  I expect that element "organizationDescription" matches the text "edited team description"
###        And  I expect that the url is "<string>"
##
##        When  I click on the element "editorganizationSaveBtn"
##        And  I set "Sema Corporate Team" to the inputfield "editorganizationNameInput"
##        And  I set "The awesome team for Sema and all its crew." to the inputfield "editorganizationDescriptionInput"
##        And  I click on the element "editorganizationSaveBtn"
##        Then I expect that element "organizationMembersTable" becomes displayed
##        And  I expect that element "organizationName" becomes displayed
##        And  I expect that element "organizationName" matches the text "Sema Corporate Team"
#
##    @PTA84_2   not needed anymore
##    Scenario: Organization management can be opened with gear button
##        Then I expect that element "userLogo" becomes displayed
##        When I click on the element "userLogo"
##        Then I expect that element "semaCorporateOrganizationGearBtn" becomes displayed
##        When I click on the element "semaCorporateOrganizationGearBtn"
##        And  I expect that element "organizationMembersTable" becomes displayed
##        And  I expect that element "organizationMembersTableEmail" becomes displayed
##        And  I expect that element "organizationMembersTableRole" becomes displayed
##        And  I expect that element "organizationMembersTableActionBtn" becomes displayed
##        And  I expect that element "organizationLabelsManagementTab" becomes displayed
##        And  I expect that element "organizationManagementInviteNewMemberBtn" becomes displayed
##        And  I expect that element "organizationManagementCopyInvitationLinkBtn" becomes displayed
##        And  I expect that element "editOrganizationProfileBtn" becomes displayed
#
##    @PTA84_3   not needed anymore https://semalab.atlassian.net/browse/WEST-1362
##    Scenario: Error message validation for editing Organization profile data
##        Then I expect that element "userLogo" becomes displayed
##        When I click on the element "userLogo"
##        Then I expect that element "semaCorporateOrganizationGearBtn" becomes displayed
##        When I click on the element "semaCorporateOrganizationGearBtn"
##        Then I expect that element "editOrganizationProfileBtn" becomes displayed
##        When I click on the element "editOrganizationProfileBtn"
##        Then I expect that element "editOrganizationNameInput" becomes displayed
##        When I clear the inputfield "editOrganizationNameInput"
##        And  I clear the inputfield "editOrganizationURLInput"
##        And  I clear the inputfield "editOrganizationDescriptionInput"
##        And  I click on the element "editOrganizationSaveBtn"
##        Then I expect that element "editOrganizationNameInputError" becomes displayed
##        And  I expect that element "editOrganizationDescriptionInputError" becomes displayed
##        And  I expect that element "editOrganizationNameInputError" matches the text "Team name is required"
##        And  I expect that element "editOrganizationDescriptionInputError" matches the text "Team description is required"