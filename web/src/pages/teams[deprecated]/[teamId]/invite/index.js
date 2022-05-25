import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import Helmet, { TeamInviteHelmet } from '../../../../components/utils/Helmet';
import withLayout from '../../../../components/layout';
import styles from './teamInvite.module.scss';
import { ArrowDropdownIcon, ArrowLeftIcon, CheckOnlineIcon, InviteIcon, LinkIcon } from '../../../../components/Icons';
import { PATHS, TAB } from '../../../../utils/constants';
import { rolesOperations } from '../../../../state/features/roles';
import { organizationsOperations } from '../../../../state/features/organizations[new]';
import { fetchUsers } from '../../../../state/features/users/actions';
import { parseEmails } from '../../../../utils';
import useAuthEffect from '../../../../hooks/useAuthEffect';
import InviteSentConfirmModal from '../../../../components/team/InviteSentConfirmModal';
import EmailsInput from "../../../../components/team/EmailsInput";
import { invitationsOperations } from '../../../../state/features/invitations';
import { isEmpty } from "lodash";

const { fetchRoles } = rolesOperations;
const { inviteTeamUsers, validateTeamInvitationEmails } = organizationsOperations;
const { trackSendInvite } = invitationsOperations;
import TagsInput from '../../../../components/tagsInput';

const TeamInvitePage = () => {
  const router = useRouter();
  const { query: { teamId } } = router;
  const [copyTooltip, toggleCopyTooltip] = useState(false);
  const dispatch = useDispatch();
  const {
    register, handleSubmit, formState: { errors }, watch, setValue,
  } = useForm();
  const [modalOpen, setModalOpen] = useState(false);

  const { authState, rolesState, usersState, teamsState } = useSelector((state) => ({
    authState: state.authState,
    teamsState: state.teamsState,
    rolesState: state.rolesState,
    usersState: state.usersState
  }));

  const { user, token } = authState;
  const { roles } = rolesState;
  const { users } = usersState;
  const { invalidEmails } = teamsState;
  const { _id: userId, firstName = '', lastName = '', username: senderEmail, organizations = [], inviteCount = 0 } = user;
  const fullName = !isEmpty(firstName) || !isEmpty(lastName) ? `${firstName} ${lastName}` : null;

  const rolesOptions = useMemo(() => roles.map((item) => ({
    value: item._id,
    label: item.name,
  })), [roles]);

  useAuthEffect(() => {
    dispatch(fetchRoles(token));
    dispatch(fetchUsers({ listAll: true }, token));
  }, [dispatch]);

  const onSave = async (data) => {
    const { emails, role } = data;
    if (emails && emails.length) {
      const userIds = emails ? emails.map((item) => item.label) : [];

      if (!userIds.length || !role) return;

      // fire segment event for all invited users
      userIds.forEach((userEmail) => {
        trackSendInvite(userEmail, fullName, senderEmail, 'team');
      })

      // adding normal users to Sema Corporate Team
      await dispatch(inviteTeamUsers(teamId, {
        users: userIds,
        role: role ? role.value : '',
      }, token));
    }

    setModalOpen(true);
  };

  const handleClose = async () => {
    await router.push(`${PATHS.ORGANIZATIONS._}/${teamId}${PATHS.SETTINGS}?tab=${TAB.management}`);
  };

  const onCancel = async () => {
    await router.back();
  };

  const checkForSelectedTeam = () => {
    if (!authState.selectedTeam || !authState.selectedTeam.team) {
      return router.push(PATHS.DASHBOARD);
    }
  }

  const copyInviteLink = async (e) => {
    const { origin } = window.location
    await navigator.clipboard.writeText(`${origin}${PATHS.ORGANIZATIONS._}/invite/${teamId}`);
    toggleCopyTooltip(true);
    setTimeout(() => toggleCopyTooltip(false), 3000);
  }

  useEffect(() => {
    checkForSelectedTeam();
  }, []);

  const DropdownIndicator = () => (
    <div className="is-flex is-align-items-center text-gray-700 mr-5">
      <ArrowDropdownIcon />
    </div>
  );

  const IndicatorSeparator = () => null;

  const handleChangeEmails = (values, event) => {
    if(values && values.length === 0) {
      setValue('emails', []);
    } else {
      let newEmails = [];
      const lastValue = values.pop();
      if (lastValue) {
        newEmails = [...values, ...parseEmails(lastValue.value).map((item) => ({ label: item, value: item }))];
        setValue('emails', newEmails);
      }

      dispatch(validateTeamInvitationEmails(teamId, {
        users: newEmails && newEmails.length > 0 ? newEmails.map(item => item.label) : []
      }, token));
    }
  };

  const blockedEmailsError = useMemo(() => {
    const blockedEmails = invalidEmails.filter(item => item?.reason === 'blocked').map(item => item.email);
    return blockedEmails && blockedEmails.length > 0
      ? `The following user account(s) are not able to be added to this team: ${blockedEmails.join(', ')}. \n Contact support@semasoftware.com for more info`
      : null;
  }, [invalidEmails]);

  const existingEmailsError = useMemo(() => {
    const existingEmails = invalidEmails.filter(item => item?.reason === 'existing').map(item => item.email);
    return existingEmails && existingEmails.length > 0
      ? `The following user account(s) are already in this team: ${existingEmails.join(', ')}.`
      : null;
  }, [invalidEmails]);

  return (
    <div className="has-background-gray-100 hero">
      <Helmet {...TeamInviteHelmet} />
      <div className="hero-body pb-300">
        <div className="is-flex is-align-items-center px-30 mb-40">
          <a href={PATHS.ORGANIZATIONS.SETTINGS(teamId)} className="has-text-black-950 is-flex is-align-items-center">
            <ArrowLeftIcon />
            <span className="ml-10 has-text-gray-500">Team Management</span>
          </a>
          <div className="has-text-black-950 mx-5">/</div>
          <div className="has-text-black-950 mr-5">Invite new members</div>
          <InviteIcon size="small" />
        </div>
        <div className="is-flex px-10 mb-25 is-justify-content-space-between is-align-items-center">
          <div className="is-flex is-flex-wrap-wrap is-align-items-center">
            <p className="has-text-weight-semibold has-text-black-950 is-size-4 mr-10">
              Invite new members
            </p>
          </div>
          <div className="is-flex">
            <button
              className="button is-small is-outlined is-primary border-radius-4px mr-10"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="button is-small is-primary border-radius-4px"
              type="button"
              onClick={handleSubmit(onSave)}
            >
              <CheckOnlineIcon size="small" />
              <span className="ml-8">
                Invite
              </span>
            </button>
          </div>
        </div>
        <div className="px-10 is-flex is-flex-direction-column">
          <div className={clsx('mb-25', styles['form-input'])}>
            <div className="has-text-weight-semibold is-size-7 mb-5">Invite Users by Email</div>
            <TagsInput
              {...register(
                'emails',
                {
                  required: 'User emails are required',
                },
              )}
              value={watch('emails')}
              placeholder="Choose Email"
              onChange={handleChangeEmails}
              error={errors.emails?.message || blockedEmailsError || existingEmailsError}
            />
            {errors.emails && (<p className="has-text-error is-size-8 is-italized mt-5">{errors.emails.message}</p>)}
            {blockedEmailsError && (
              <p className="has-text-error is-size-8 is-italized mt-5">
                {blockedEmailsError}
              </p>
            )}
            {existingEmailsError && (
              <p className="has-text-error is-size-8 is-italized mt-5">
                {existingEmailsError}
              </p>
            )}
          </div>
          <div className={clsx(styles['form-input'])}>
            <div className="has-text-weight-semibold is-size-7 mb-5">Role</div>
            <Select
              {...register(
                'role',
                {
                  required: 'User role is required',
                },
              )}
              options={rolesOptions}
              value={watch('role')}
              placeholder="Choose Role"
              onChange={(value) => setValue('role', value)}
              components={{
                DropdownIndicator,
                IndicatorSeparator,
              }}
            />
            {errors.role && (<p className="has-text-danger is-size-8 is-italized mt-5">{errors.role.message}</p>)}
          </div>
          <div className='is-divider' />
          {/* // TODO: should be disabled until new invitations logic */}
          {/* <div className={clsx(styles['copy-invite'])}> */}
          {/*   {copyTooltip && <div className='tooltip is-tooltip-active sema-tooltip' data-tooltip='Copied!' />} */}
          {/*   <button className={clsx('button is-primary is-outlined')} onClick={copyInviteLink}> */}
          {/*     <LinkIcon size="small" className={clsx('mr-5')} /> */}
          {/*     Copy Invitation Link */}
          {/*   </button> */}
          {/* </div> */}
        </div>
      </div>
      <InviteSentConfirmModal onClose={handleClose} open={modalOpen} />
    </div>
  );
};

export default withLayout(TeamInvitePage);
