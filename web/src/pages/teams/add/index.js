import clsx from 'clsx';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { InputField } from 'adonis';
import { isEmpty } from 'lodash';
import toaster from 'toasted-notes';
import * as yup from 'yup';
import TagsInput from '../../../components/tagsInput';
import Helmet, { TeamCreateHelmet } from '../../../components/utils/Helmet';
import withLayout from '../../../components/layout';
import { teamsOperations } from '../../../state/features/teams';
import { authOperations } from '../../../state/features/auth';
import {
  AlertFilledIcon,
  AlertOutlineIcon,
  CheckFilledIcon,
  CheckOnlineIcon,
  CloseIcon,
  LoadingBlueIcon,
} from '../../../components/Icons';
import { getAll } from '../../../state/utils/api';
import { PATHS, SEMA_CORPORATE_TEAM_NAME } from '../../../utils/constants';
import styles from './add.module.scss';

const { createTeam, fetchTeamsOfUser } = teamsOperations;
const { setSelectedTeam } = authOperations;
const URL_STATUS = {
  ALLOCATED: 'allocated',
  AVAILABLE: 'available',
};
const schema = yup.object().shape({
  name: yup.string().nullable().required('Team name is required'),
  description: yup.string().nullable(),
  url: yup.string().required('URL is required'),
});

function TeamEditPage() {
  const [urlChecks, setUrlChecks] = useState({
    [SEMA_CORPORATE_TEAM_NAME]: URL_STATUS.ALLOCATED,
    urlChecked: false,
  });
  const router = useRouter();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: router.query.name,
      url: '',
      description: '',
      members: [],
    },
    resolver: yupResolver(schema),
  });
  const url = watch('url');
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.authState);
  const { teamsState } = useSelector((state) => state);
  const showNotification = (team) => {
    const isError = !team;
    toaster.notify(
      ({ onClose }) => (
        <div
          className={clsx(
            'message  shadow mt-60',
            isError ? 'is-red-500' : 'is-success'
          )}
        >
          <div className="message-body has-background-white is-flex">
            {isError ? (
              <AlertFilledIcon size="small" />
            ) : (
              <CheckFilledIcon size="small" />
            )}
            <div>
              <div className="is-flex is-justify-content-space-between mb-15">
                <span className="is-line-height-1 has-text-weight-semibold has-text-black ml-8">
                  {isError ? 'Team is not created' : 'Team Created'}
                </span>
                <div onClick={onClose}>
                  <CloseIcon size="small" />
                </div>
              </div>
              <div className="has-text-black">
                {isError ? 'Error' : "You've successfully created the team"}
              </div>
            </div>
          </div>
        </div>
      ),
      {
        position: 'top-right',
        duration: 4000,
      }
    );
  };
  const [isLoading, setLoading] = useState(false);
  const isAllocatedUrl = urlChecks[url] === URL_STATUS.ALLOCATED;
  const isAvailableUrl = urlChecks[url] === URL_STATUS.AVAILABLE;
  const isCreateDisabled = isLoading || isAllocatedUrl;
  const [isUrlCheckLoading, setUrlCheckLoading] = useState(false);
  const onCancel = async () => {
    await router.back();
  };
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (url) {
        if (!urlChecks.urlChecked) {
          const isUrlAvailable = !urlChecks[url] && (await checkUrl());
          if (!isUrlAvailable) {
            setLoading(false);
            return;
          }
        }
      }
      const team = await dispatch(
        createTeam(
          {
            ...data,
            members: data.members.map((member) => member.label),
          },
          token
        )
      );
      if (!isEmpty(teamsState.error)) {
        showNotification(null);
      }
      if (team) {
        showNotification(team);
        switchToTeam(team);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      showNotification(null);
    } finally {
      setLoading(false);
    }
  };
  const switchToTeam = async (team) => {
    const roles = await dispatch(fetchTeamsOfUser(token));
    const activeTeam = roles.find((role) => role.team._id === team._id);
    dispatch(setSelectedTeam(activeTeam));
    router.push(`${PATHS.TEAMS._}/${team._id}${PATHS.DASHBOARD}`);
  };
  const checkUrl = async (e) => {
    e?.preventDefault();
    if (!url) {
      return null;
    }
    setUrlCheckLoading(true);
    try {
      const { data } = await getAll(
        `/api/proxy/teams/check-url/${url}`,
        {},
        token
      );
      setUrlChecks((state) => ({
        ...state,
        [url]: data.isAvailable ? URL_STATUS.AVAILABLE : URL_STATUS.ALLOCATED,
        urlChecked: true,
      }));
      return data.isAvailable;
    } finally {
      setUrlCheckLoading(false);
    }
  };

  return (
    <div className="has-background-gray-200 hero">
      <Helmet {...TeamCreateHelmet} />
      <form className="hero-body pb-100" onSubmit={handleSubmit(onSubmit)}>
        <div className="is-flex px-10 mb-25 is-justify-content-space-between is-align-items-center">
          <div className="is-flex is-flex-wrap-wrap is-align-items-center">
            <p className="has-text-weight-semibold has-text-black-950 is-size-4 mr-10">
              Create a Team
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
              disabled={isCreateDisabled}
              className="button is-small is-primary border-radius-4px"
              type="submit"
            >
              <CheckOnlineIcon size="small" />
              <span className="ml-8">Create</span>
            </button>
          </div>
        </div>
        <div className="px-10">
          <div className="mb-15">
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <InputField
                  {...field}
                  title="Team Name"
                  isRequired
                  error={errors?.name?.message}
                />
              )}
            />
          </div>
          <div className="mb-15">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label className="label is-size-6">
              Team URL <span className="has-text-error">*</span>
            </label>
            <div className="is-flex">
              <div className="is-full-width">
                <Controller
                  control={control}
                  name="url"
                  render={({ field }) => (
                    <div className={clsx('is-flex')}>
                      <InputField
                        value="app.semasoftware.com/teams/"
                        disabled
                        error={
                          (isAllocatedUrl &&
                            'This URL is not available. Try a different url.') ||
                          errors?.url?.message
                        }
                        className={styles['initial-slug']}
                      />
                      <InputField
                        {...field}
                        isRequired
                        onChange={(teamUrl) => field.onChange(teamUrl.toLowerCase())}
                        error={
                          (isAllocatedUrl &&
                            'This URL is not available. Try a different url.') ||
                          errors?.url?.message
                        }
                        className={clsx(
                          'is-flex-grow-1',
                          styles.slug,
                          errors?.url?.message && styles['url-error']
                        )}
                      />
                    </div>
                  )}
                />
              </div>
              <button className="ml-16 button" onClick={checkUrl}>
                <div
                  className={clsx(
                    'is-flex is-align-items-center',
                    (isAllocatedUrl || errors?.url?.message) &&
                      'has-text-red-500',
                    isAvailableUrl && 'has-text-green-500'
                  )}
                >
                  {isUrlCheckLoading ? (
                    <LoadingBlueIcon className="mr-8" size="small" />
                  ) : (
                    ((isAllocatedUrl || errors?.url?.message) && (
                      <AlertOutlineIcon className="mr-8" size="small" />
                    )) ||
                    (isAvailableUrl && (
                      <CheckOnlineIcon className="mr-8" size="small" />
                    ))
                  )}
                  <span className="has-text-weight-semibold">Check</span>
                </div>
              </button>
            </div>
          </div>
          <div className="mb-15">
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <InputField title="Description" isMultiLine {...field} />
              )}
            />
          </div>
          <div className="mt-40">
            <p className="has-text-weight-semibold has-text-black-950 is-size-4 mb-15">
              Invite Members
            </p>
            <p className="is-size-7">
              You can add multiple team members by adding commas
            </p>
            <div className="mt-20 mb-50">
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label className="label is-size-6">Invite Users by Email</label>
              <Controller
                control={control}
                name="members"
                render={({ field }) => <TagsInput {...field} />}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default withLayout(TeamEditPage);
