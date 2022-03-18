import clsx from 'clsx';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { InputField } from 'adonis';
import toaster from 'toasted-notes';
import * as yup from 'yup';
import TagsInput from '../../../components/tagsInput';
import Helmet, { TeamCreateHelmet } from '../../../components/utils/Helmet';
import withLayout from '../../../components/layout';
import { teamsOperations } from '../../../state/features/teams';
import {
  AlertFilledIcon,
  AlertOutlineIcon,
  CheckFilledIcon,
  CheckOnlineIcon,
  CloseIcon,
  LoadingBlueIcon,
} from '../../../components/Icons';
import { getAll } from '../../../state/utils/api';
import { PATHS, SEMA_CORPORATE_TEAM_NAME, SEMA_APP_URL, TAB, PROFILE_VIEW_MODE } from '../../../utils/constants';

const { createTeam, fetchTeamsOfUser } = teamsOperations;
const URL_STATUS = {
  ALLOCATED: 'allocated',
  AVAIlABLE: 'available',
};
const schema = yup.object().shape({
  name: yup
    .string()
    .nullable()
    .required('Team name is required'),
  description: yup
    .string()
    .nullable()
    .required('Team description is required'),
})

const TeamEditPage = () => {
  const [urlChecks, setUrlChecks] = useState({
    [SEMA_CORPORATE_TEAM_NAME]: URL_STATUS.ALLOCATED,
  });
  const { control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      url: '',
      description: '',
      members: [],
    },
    resolver: yupResolver(schema),
  })
  const url = watch('url');
  const router = useRouter();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.authState);
  const { teamsState } = useSelector((state) => state);
  const showNotification = (team) => {
    const isError = !team;
    toaster.notify(({ onClose }) => (
      <div className={clsx('message  shadow mt-60', isError ? 'is-red-500' : 'is-success')}>
        <div className="message-body has-background-white is-flex">
          {isError ?
            <AlertFilledIcon size="small" /> :
            <CheckFilledIcon size="small" />
          }
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
              {isError ? 'Error' : 'You\'ve successfully created the team'}
            </div>
          </div>
        </div>
      </div>
    ), {
      position: 'top-right',
      duration: 4000,
    });
  };
  const [isLoading, setLoading] = useState(false);
  const isAllocatedUrl = urlChecks[url] === URL_STATUS.ALLOCATED;
  const isAvailableUrl = urlChecks[url] === URL_STATUS.AVAIlABLE;
  const isCreateDisabled = isLoading || isAllocatedUrl;
  const [isUrlCheckLoading, setUrlCheckLoading] = useState(false);
  const onCancel = async () => {
    await router.back();
  };
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (url) {
        const isUrlAvailable = !urlChecks[url] && await checkUrl();
        if (!isUrlAvailable) {
          setLoading(false);
          return
        }
      }
      const team = await dispatch(createTeam({
        ...data,
        members: data.members.map((member) => member.label),
      }, token));
      if (teamsState.error) {
        showNotification(null);
      }
      if (team) {
        showNotification(team);
        await dispatch(fetchTeamsOfUser(token));
        await router.push(`${PATHS.TEAMS._}/${team.url}${PATHS.SETTINGS}?tab=${TAB.info}`);
      }
    } catch (e) {
      showNotification(null);
    } finally {
      setLoading(false);
    }
  }
  const checkUrl = async (e) => {
    e?.preventDefault();
    if (!url) {
      return
    }
    setUrlCheckLoading(true)
    try {
      const { data } = await getAll(`/api/proxy/teams/check-url/${url}`, {}, token);
      setUrlChecks(state => ({
        ...state,
        [url]: data.isAvailable ? URL_STATUS.AVAIlABLE : URL_STATUS.ALLOCATED,
      }))
      return data.isAvailable;
    } finally {
      setUrlCheckLoading(false)
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
                  title="Team name"
                  isRequired
                  error={errors?.name?.message}
                />
              )}
            />
          </div>
          <div className="mb-15">
            <label className="label is-size-6">Team Url</label>
            <div className="is-flex">
              <div className="is-full-width">
                <Controller
                  control={control}
                  name="url"
                  render={({ field }) => (
                    <InputField
                      {...field}
                      onChange={(url) => field.onChange(url.toLowerCase())}
                      error={isAllocatedUrl && "This URL is not available. Try a different url."}
                    />
                  )}
                />
                <span className="is-size-8 has-text-weight-semibold">
                  {SEMA_APP_URL}/teams/{url}
                </span>
              </div>
              <button className="ml-16 button" onClick={checkUrl}>
                <div
                  className={clsx(
                    "is-flex is-align-items-center",
                    isAllocatedUrl && "has-text-red-500",
                    isAvailableUrl && "has-text-green-500"
                  )}
                >
                  {isUrlCheckLoading ? (
                    <LoadingBlueIcon className="mr-8" size="small" />
                  ) : (
                    (isAllocatedUrl && <AlertOutlineIcon className="mr-8" size="small" />) ||
                    (isAvailableUrl && <CheckOnlineIcon className="mr-8" size="small" />)
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
                <InputField
                  title="Description"
                  isRequired
                  isMultiLine
                  error={errors?.description?.message}
                  {...field}
                />
              )}
            />
          </div>
          <div className="mt-40">
            <p className="has-text-weight-semibold has-text-black-950 is-size-4 mb-15">
              Invite members
            </p>
            <p className="is-size-7">
              You can add multiple team members by adding commas
            </p>
            <div className="mt-20 mb-50">
              <label className="label is-size-6">Invite Users by Email</label>
              <Controller
                control={control}
                name="members"
                render={({ field }) => (
                  <TagsInput {...field} />
                )}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default withLayout(TeamEditPage);
