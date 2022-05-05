@team_management @regression
Feature: Team management

#    @PTA80 @smoke  ##https://semalab.atlassian.net/browse/WEST-1319
#    Scenario: Sema member can create new team
#        Then I expect that element "userLogo" becomes displayed
#        When I click on the element "userLogo"
#        Then I expect that element "createTeamBtn" becomes displayed
#        When I click on the element "createTeamBtn"
#
#        Then I expect that element "createTeamNameInput" becomes displayed
#        And  I expect that element "createTeamURLInput" becomes displayed
#        And  I expect that element "createTeamURLCheckBtn" becomes displayed
#        And  I expect that element "createTeamDescriptionInput" becomes displayed
#        And  I expect that element "createTeamCancelBtn" becomes displayed
#        And  I expect that element "createTeamCreateBtn" becomes displayed
#
#        When I set "Test team" with timestamp to the inputfield "createTeamNameInput"
#        And  I set "testTeam" to the inputfield "createTeamURLInput"
#        And  I set "test description" to the inputfield "createTeamDescriptionInput"
#        And  I click on the element "createTeamCancelBtn"
#
#        Then I expect that element "createTeamNameInput" becomes not displayed
#        And  I expect that element "userLogo" becomes displayed
#        When I click on the element "userLogo"
#        Then I expect that element "createTeamBtn" becomes displayed
#        When I click on the element "createTeamBtn"
#
#        Then I expect that element "createTeamNameInput" not matches the text "Test team"
#        And  I expect that element "createTeamURLInput" not matches the text "testTeam"
#        And  I expect that element "createTeamDescriptionInput" not matches the text "test description"
#
#        When I set "Test team" with timestamp to the inputfield "createTeamNameInput"
#        And  I set "test description" to the inputfield "createTeamDescriptionInput"
#        And  I set "testTeam" with timestamp to the inputfield "createTeamURLInput"
#        And  I click on the element "createTeamCreateBtn"
#
#        Then I expect that element "createTeamCreateBtn" becomes not displayed
#        And  I expect that the team url is correct
#        And  I expect that element "teamMetricsBoard" becomes displayed
#        And  I expect that element "teamMembersList" becomes displayed

    @PTA77  @smoke
    Scenario: Dashboard elements are displayed for Sema Corporate Team account
        Then I expect that element "userLogo" becomes displayed
        When I click on the element "userLogo"
        Then I expect that element "semaCorporateTeamLogo" becomes displayed
        When I click on the element "semaCorporateTeamLogo"

        Then I expect that element "teamMetricsBoard" becomes displayed
        And  I expect that element "teamSemaCodeReviews" becomes displayed
        And  I expect that element "teamSemaComments" becomes displayed
        And  I expect that element "teamSemaCommenters" becomes displayed
        And  I expect that element "teamSemaUsers" becomes displayed
        And  I expect that element "teamMembersList" becomes displayed
        And  I expect that element "viewAllTeamMembersBtn" becomes displayed
        And  I expect that element "dashboardInviteNewMembersBtn" becomes displayed
        And  I expect that element "teamRecentReposBoard" becomes displayed
        And  I expect that element "teamRecentReposCards" becomes displayed
        And  I expect that element "teamViewAllReposBtn" becomes displayed
        And  I expect that element "updateYourTeamSnippetsBtn" becomes displayed

    @PTA81
    Scenario: Invite new members to the team from the Dashboard
        Then I expect that element "userLogo" becomes displayed
        When I click on the element "userLogo"
        Then I expect that element "semaCorporateTeamLogo" becomes displayed
        When I click on the element "semaCorporateTeamLogo"
        Then I expect that element "dashboardInviteNewMembersBtn" becomes displayed
        When I click on the element "dashboardInviteNewMembersBtn"
        Then I expect that element "inviteNewTeamMemberInput" becomes displayed
        And  I expect that element "roleNewTeamMemberInput" becomes displayed
#        And  I expect that element "copyInvitationLinkBtn" becomes displayed
        And  I expect that element "cancelInvitationNewTeamMemberBtn" becomes displayed
        And  I expect that element "inviteNewTeamMemberBtn" becomes displayed

        When I click on the element "inviteNewTeamMemberInput"
        And  I set "qateam+autotest1@semasoftware.com" to the inputfield "inviteNewTeamMemberInput"
        And  I click on the element "roleNewTeamMemberElement"
        And  I set "Member" to the inputfield "roleNewTeamMemberInput"
        And  I press "Enter"
        And  I click on the element "cancelInvitationNewTeamMemberBtn"

        Then I expect that element "inviteNewTeamMemberInput" becomes not displayed
        And  I expect that element "dashboardInviteNewMembersBtn" becomes displayed

        When I click on the element "dashboardInviteNewMembersBtn"
        And  I set "qateam+autotest1@semasoftware.com" to the inputfield "inviteNewTeamMemberInput"
        And  I click on the element "roleNewTeamMemberElement"
        And  I set "Member" to the inputfield "roleNewTeamMemberInput"
        And  I press "Enter"
        And  I click on the element "inviteNewTeamMemberBtn"

        Then I expect that element "invitationsSentNotificationText" becomes displayed
        And  I expect that element "invitationsSentNotificationCloseBtn" becomes displayed
        
        When I click on the element "invitationsSentNotificationCloseBtn"
        Then I expect that element "teamManagementTab" becomes displayed

    @PTA81_2
    Scenario: Invite new members to the team from the Team Management
        Then I expect that element "userLogo" becomes displayed
        When I click on the element "userLogo"
        Then I expect that element "semaCorporateTeamLogo" becomes displayed
        When I click on the element "semaCorporateTeamLogo"
        Then I expect that element "viewAllTeamMembersBtn" becomes displayed
        
        When I click on the element "viewAllTeamMembersBtn"
        Then I expect that element "teamManagementInviteNewMemberBtn" becomes displayed
        When I click on the element "teamManagementInviteNewMemberBtn"
        Then I expect that element "inviteNewTeamMemberInput" becomes displayed
        And  I set "qateam+autotest1@semasoftware.com" to the inputfield "inviteNewTeamMemberInput"
        And  I click on the element "roleNewTeamMemberElement"
        And  I set "Member" to the inputfield "roleNewTeamMemberInput"
        And  I press "Enter"
        And  I click on the element "inviteNewTeamMemberBtn"

        Then I expect that element "invitationsSentNotificationText" becomes displayed
        And  I expect that element "invitationsSentNotificationCloseBtn" becomes displayed

        When I click on the element "invitationsSentNotificationCloseBtn"
        Then I expect that element "teamManagementTab" becomes displayed
        And  I expect that element "teamMembersTable" becomes displayed

    @PTA82  @smoke
    Scenario: Team member role can be changed in the Team Management tab
        Then I expect that element "userLogo" becomes displayed
        When I click on the element "userLogo"
        Then I expect that element "semaCorporateTeamLogo" becomes displayed
        When I click on the element "semaCorporateTeamLogo"
        Then I expect that element "viewAllTeamMembersBtn" becomes displayed
        When I click on the element "viewAllTeamMembersBtn"
        Then I expect that element "teamMembersTableEmail" becomes displayed
        And  I expect that element "teamMembersTableRole" becomes displayed
        And  I expect that element "teamMembersTableActionBtn" becomes displayed

        When I change the role for "sema.test.code.author@gmail.com" to "Member"
        Then I expect that element "changeRoleConfirmBtn" becomes displayed
        And  I expect that element "changeRoleCancelBtn" becomes displayed
        And  I expect that element "changeRoleConfirmationUserName" becomes displayed
        And  I expect that element "changeRoleConfirmationUserRole" becomes displayed
        And  I expect that element "changeRoleConfirmationUserName" matches the text "Sema Test Code Author"
        And  I expect that element "changeRoleConfirmationUserRole" matches the text "Member"

        When I click on the element "changeRoleCancelBtn"
        Then I expect that element "changeRoleConfirmBtn" becomes not displayed
        And  I expect that element "changeRoleCancelBtn" becomes not displayed
        And  I expect that element "changeRoleConfirmationUserName" becomes not displayed
        And  I expect that element "changeRoleConfirmationUserRole" becomes not displayed

        When I change the role for "sema.test.code.author@gmail.com" to "Member"
        Then I expect that element "changeRoleConfirmationUserName" matches the text "Sema Test Code Author"
        And  I expect that element "changeRoleConfirmationUserRole" matches the text "Member"
        When I click on the element "changeRoleConfirmBtn"
        Then I expect that the role for user "sema.test.code.author@gmail.com" is updated to "Member"

        When I change the role for "sema.test.code.author@gmail.com" to "Library Editor"
        Then I expect that element "changeRoleConfirmationUserName" matches the text "Sema Test Code Author"
        And  I expect that element "changeRoleConfirmationUserRole" matches the text "Library Editor"
        When I click on the element "changeRoleConfirmBtn"
        Then I expect that the role for user "sema.test.code.author@gmail.com" is updated to "Library Editor"

    @PTA82_2
    Scenario: Team member role can be changed to to each of roles in the Team Management tab
        Then I expect that element "userLogo" becomes displayed
        When I click on the element "userLogo"
        Then I expect that element "semaCorporateTeamLogo" becomes displayed
        When I click on the element "semaCorporateTeamLogo"
        Then I expect that element "viewAllTeamMembersBtn" becomes displayed

        When I click on the element "viewAllTeamMembersBtn"
        And  I expect that element "teamMembersTableRole" becomes displayed

        When I change the role for "sema.test.code.author@gmail.com" to "Member"
        Then I expect that element "changeRoleConfirmationUserName" matches the text "Sema Test Code Author"
        And  I expect that element "changeRoleConfirmationUserRole" matches the text "Member"
        When I click on the element "changeRoleConfirmBtn"
        Then I expect that the role for user "sema.test.code.author@gmail.com" is updated to "Member"

        When I change the role for "sema.test.code.author@gmail.com" to "Admin"
        Then I expect that element "changeRoleConfirmationUserName" matches the text "Sema Test Code Author"
        And  I expect that element "changeRoleConfirmationUserRole" matches the text "Admin"
        When I click on the element "changeRoleConfirmBtn"
        Then I expect that the role for user "sema.test.code.author@gmail.com" is updated to "Admin"

        When I change the role for "sema.test.code.author@gmail.com" to "Library Editor"
        Then I expect that element "changeRoleConfirmationUserName" matches the text "Sema Test Code Author"
        And  I expect that element "changeRoleConfirmationUserRole" matches the text "Library Editor"
        When I click on the element "changeRoleConfirmBtn"
        Then I expect that the role for user "sema.test.code.author@gmail.com" is updated to "Library Editor"

#    @PTA84     https://semalab.atlassian.net/browse/WEST-1362
#    Scenario: Team profile data can be updated
#        Then I expect that element "userLogo" becomes displayed
#        When I click on the element "userLogo"
#        Then I expect that element "semaCorporateTeamGearBtn" becomes displayed
#        When I click on the element "semaCorporateTeamGearBtn"
#        Then I expect that element "editTeamProfileBtn" becomes displayed
#        When I click on the element "editTeamProfileBtn"
#        Then I expect that element "editTeamNameInput" becomes displayed
#        And  I expect that element "editTeamURLInput" becomes displayed
#        And  I expect that element "editTeamURLCheckBtn" becomes displayed
#        And  I expect that element "editTeamDescriptionInput" becomes displayed
#        And  I expect that element "editTeamCancelBtn" becomes displayed
#        And  I expect that element "editTeamSaveBtn" becomes displayed
#        And  I expect that element "uploadProfilePictureBtn" becomes displayed
#
#        When I clear the inputfield "editTeamNameInput"
#        And  I clear the inputfield "editTeamURLInput"
#        And  I clear the inputfield "editTeamDescriptionInput"
#
#        And  I set "edited team name" to the inputfield "editTeamNameInput"
#        And  I set "edited team description" to the inputfield "editTeamDescriptionInput"
#        And  I set "edited team url" to the inputfield "editTeamURLInput"
#        And  I click on the element "editTeamSaveBtn"
#        Then I expect that element "teamMembersTable" becomes displayed
#        And  I expect that element "changeTeamProfileNotification" becomes displayed
#        And  I expect that element "teamName" becomes displayed
#        And  I expect that element "teamDescription" becomes displayed
#        And  I expect that element "teamName" matches the text "edited team name"
#        And  I expect that element "teamDescription" matches the text "edited team description"
##        And  I expect that the url is "<string>"
#
#        When  I click on the element "editTeamSaveBtn"
#        And  I set "Sema Corporate Team" to the inputfield "editTeamNameInput"
#        And  I set "The awesome team for Sema and all its crew." to the inputfield "editTeamDescriptionInput"
#        And  I click on the element "editTeamSaveBtn"
#        Then I expect that element "teamMembersTable" becomes displayed
#        And  I expect that element "teamName" becomes displayed
#        And  I expect that element "teamName" matches the text "Sema Corporate Team"

    @PTA84_2
    Scenario: Team management can be opened with gear button
        Then I expect that element "userLogo" becomes displayed
        When I click on the element "userLogo"
        Then I expect that element "semaCorporateTeamGearBtn" becomes displayed
        When I click on the element "semaCorporateTeamGearBtn"
        And  I expect that element "teamMembersTableEmail" becomes displayed
        And  I expect that element "teamMembersTableRole" becomes displayed
        And  I expect that element "teamMembersTableActionBtn" becomes displayed
        And  I expect that element "teamLabelsManagementTab" becomes displayed
        And  I expect that element "teamManagementInviteNewMemberBtn" becomes displayed
        And  I expect that element "editTeamProfileBtn" becomes displayed

#    @PTA84_3    https://semalab.atlassian.net/browse/WEST-1362
#    Scenario: Error message validation for editing team profile data
#        Then I expect that element "userLogo" becomes displayed
#        When I click on the element "userLogo"
#        Then I expect that element "semaCorporateTeamGearBtn" becomes displayed
#        When I click on the element "semaCorporateTeamGearBtn"
#        Then I expect that element "editTeamProfileBtn" becomes displayed
#        When I click on the element "editTeamProfileBtn"
#        Then I expect that element "editTeamNameInput" becomes displayed
#        When I clear the inputfield "editTeamNameInput"
#        And  I clear the inputfield "editTeamURLInput"
#        And  I clear the inputfield "editTeamDescriptionInput"
#        And  I click on the element "editTeamSaveBtn"
#        Then I expect that element "editTeamNameInputError" becomes displayed
#        And  I expect that element "editTeamDescriptionInputError" becomes displayed
#        And  I expect that element "editTeamNameInputError" matches the text "Team name is required"
#        And  I expect that element "editTeamDescriptionInputError" matches the text "Team description is required"