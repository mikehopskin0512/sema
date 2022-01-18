import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import Helmet, { TeamInviteHelmet } from '../../../components/utils/Helmet';
import withLayout from '../../../components/layout';
import withSelectedTeam from '../../../components/auth/withSelectedTeam';
import styles from './teamInvite.module.scss';
import { useForm } from 'react-hook-form';
import { ArrowLeftIcon, CheckOnlineIcon } from '../../../components/Icons';
import { PATHS, SEMA_CORPORATE_TEAM_ID, TAB } from '../../../utils/constants';
import { rolesOperations } from '../../../state/features/roles';
import { teamsOperations } from '../../../state/features/teams';
import { fetchUsers } from '../../../state/features/users/actions';
import { filterNonSemaUsers } from '../../../utils';
import useAuthEffect from '../../../hooks/useAuthEffect';

const { fetchRoles } = rolesOperations;
const { inviteTeamUsers } = teamsOperations;

const TeamInvitePage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    register, handleSubmit, formState: { errors }, watch, setValue
  } = useForm();

  const { authState, rolesState, usersState } = useSelector((state) => ({
    authState: state.authState,
    teamsState: state.teamsState,
    rolesState: state.rolesState,
    usersState: state.usersState
  }));

  const { token } = authState;
  const { roles } = rolesState;
  const { users } = usersState;

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
      const userIds = emails ? emails.map((item) => item.value) : [];

      if (!userIds.length || !role) return;

      // adding normal users to Sema Corporate Team
      await dispatch(inviteTeamUsers(SEMA_CORPORATE_TEAM_ID, {
        users: userIds,
        role: role ? role.value : '',
      }, token));
    }

    await router.push(`${PATHS.TEAM._}/${SEMA_CORPORATE_TEAM_ID}${PATHS.SETTINGS}?tab=${TAB.management}`);
  };

  const onCancel = async () => {
    await router.back();
  };

  const userOptions = useMemo(() => filterNonSemaUsers(users).map((item) => ({
    value: item._id,
    label: item.username,
  })), [users]);

  const checkForSelectedTeam = () => {
    if (!authState.selectedTeam || !authState.selectedTeam.team) {
      return router.push(PATHS.DASHBOARD);
    }
  }

  useEffect(() => {
    checkForSelectedTeam();
  }, []);

  return (
    <div className="has-background-gray-100 hero">
      <Helmet {...TeamInviteHelmet} />
      <div className="hero-body pb-300">
        <div className="is-flex is-align-items-center px-30 mb-40">
          <a href={`${PATHS.TEAM._}/${SEMA_CORPORATE_TEAM_ID}`} className="has-text-black-950 is-flex is-align-items-center">
            <ArrowLeftIcon />
            <span className="ml-10 has-text-gray-500">Team Organization</span>
          </a>
          <div className="has-text-black-950 mx-5">/</div>
          <div className="has-text-black-950">Invite new members</div>
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
                Save
              </span>
            </button>
          </div>
        </div>
        <div className="px-10 is-flex is-flex-direction-column">
          <div className={clsx('mb-25', styles['form-input'])}>
            <div>Choose User</div>
            <Select
              {...register(
                'emails',
                {
                  required: 'User emails are required',
                },
              )}
              options={userOptions}
              value={watch('emails')}
              placeholder="Choose Email"
              onChange={(values) => setValue('emails', values)}
              isMulti
              isSearchable
            />
            {errors.emails && (<p className="has-text-danger is-size-8 is-italized mt-5">{errors.emails.message}</p>)}
          </div>
          <div className={clsx(styles['form-input'])}>
            <div>Role</div>
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
            />
            {errors.role && (<p className="has-text-danger is-size-8 is-italized mt-5">{errors.role.message}</p>)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withLayout(TeamInvitePage);
