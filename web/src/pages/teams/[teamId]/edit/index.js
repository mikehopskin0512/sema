import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import toaster from 'toasted-notes';
import { InputField } from 'adonis';
import clsx from 'clsx';
import _ from 'lodash';
import checkAvailableUrl from '../../../../utils/checkAvailableUrl';
import Helmet, { TeamUpdateHelmet } from '../../../../components/utils/Helmet';
import withLayout from '../../../../components/layout';
import { teamsOperations } from '../../../../state/features/teams';
import { ArrowLeftIcon, CheckFilledIcon, CheckOnlineIcon, CloseIcon, InviteIcon, LoadingBlueIcon, AlertOutlineIcon } from '../../../../components/Icons';
import { PATHS, SEMA_CORPORATE_TEAM_NAME } from '../../../../utils/constants' ;
import withSelectedTeam from '../../../../components/auth/withSelectedTeam';
import UploadFile from '../../../../components/team/UploadFile';
import { uploadTeamAvatar } from "../../../../state/features/teams/actions";
import styles from './teamEdit.module.scss';

const { editTeam, fetchTeamsOfUser } = teamsOperations;

function TeamEditPage() {
  const {
    query: { teamId },
  } = useRouter();
  const [team, setTeam] = useState({
    name: '',
    description: '',
    members: '',
    avatarUrl: '',
    url: null,
  });
  const [errors, setErrors] = useState({
    name: null,
    url: null,
    avatarUrl: null,
  });
  const URL_STATUS = {
    ALLOCATED: 'allocated',
    AVAILABLE: 'available',
  };
  // eslint-disable-next-line no-unused-vars
  const [userRole, setUserRole] = useState({})
  const [isUrlCheckLoading, setUrlCheckLoading] = useState(false);
  const [urlChecks, setUrlChecks] = useState({
    [SEMA_CORPORATE_TEAM_NAME]: URL_STATUS.ALLOCATED,
    urlChecked: false,
  });
  const [originalTeamUrl, setOriginalTeamUrl] = useState(null);
  const isAllocatedUrl = urlChecks[team.url] === URL_STATUS.ALLOCATED;
  const isAvailableUrl = urlChecks[team.url] === URL_STATUS.AVAILABLE;
  const router = useRouter();
  const dispatch = useDispatch();

  const { auth, teams } = useSelector(
    (state) => ({
      auth: state.authState,
      teams: state.teamsState
    }),
  );
  const { token } = auth

  useEffect(() => {
    if (teams.teams.length) {
      const activeRole = _.find(teams.teams, (o) => o.team?._id === teamId);
      const activeTeam = {
        _id: teamId,
        name: activeRole?.team?.name,
        description: activeRole?.team?.description,
        avatarUrl: activeRole?.team?.avatarUrl,
        url: activeRole?.team?.url,
      }
      if (activeRole) {
        setUserRole(activeRole)
        setTeam(activeTeam)
        setOriginalTeamUrl(activeTeam.url);
      }
    }
  }, [teams]);

  useEffect(() => {
    dispatch(fetchTeamsOfUser(token));
  }, []);

  const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);

    dispatch(uploadTeamAvatar(teamId, formData, token));
  };

  const mutate = (obj) => {
    setTeam({
      ...team,
      ...obj,
    });
  };

  const checkUrl = async (e) => {
    e?.preventDefault();
    setUrlCheckLoading(true);
    try {
      const data = await checkAvailableUrl(team.url, token);
      setUrlChecks((state) => ({
        ...state,
        [team.url]: data.isAvailable ? URL_STATUS.AVAILABLE : URL_STATUS.ALLOCATED,
        urlChecked: true,
      }));
      return data.isAvailable;
    } catch (error) {
      return setErrors({
        ...errors,
        url: 'URL is required',
      });
    } finally {
      setUrlCheckLoading(false);
    }
  };

  const onUpdate = async () => {
    const isUrlChanged = team.url && originalTeamUrl !== team.url;
    if (isUrlChanged) {
      if (!urlChecks.urlChecked) {
        const isUrlAvailable = !urlChecks[team.url] && (await checkUrl());
        if (!isUrlAvailable) {
          return;
        }
      }
    }
    if (!team.name || !team.url) {
      setErrors({
        name: !team.name ? 'Team name is required' : null,
        url: !team.url ? 'URL is required' : null,
      });
      return;
    }

    const { avatarUrl, ...teamData } = team;

    if (avatarUrl) {
      await uploadAvatar(avatarUrl);
    }

    await dispatch(editTeam(teamData, token));

    toaster.notify(({ onClose }) => (
      <div className="message is-success shadow mt-60">
        <div className="message-body has-background-white is-flex">
          <CheckFilledIcon size="small" />
          <div>
            <div className="is-flex is-justify-content-space-between mb-15">
              <span className="is-line-height-1 has-text-weight-semibold has-text-black ml-8">Team Updated</span>
              <div onClick={onClose}>
                <CloseIcon size="small" />
              </div>
            </div>
            <div className="has-text-black">
              You’ve successfully updated the team
            </div>
            <div>
              <span className="has-text-black has-text-weight-semibold">{ team.name }.</span>
              <a href={`${PATHS.TEAMS._}/${teamId}${PATHS.SETTINGS}`} className="has-text-primary ml-10" aria-hidden="true">Go to the team page</a>
            </div>
          </div>
        </div>
      </div>
    ), {
      position: 'top-right',
      duration: 4000,
    });

    mutate(team);
    await router.push(`${PATHS.TEAMS._}/${teamId}${PATHS.SETTINGS}`);
  };

  const onCancel = async () => {
    await router.back();
  };

  return (
    <div className="has-background-gray-200 hero">
      <Helmet {...TeamUpdateHelmet} />
      <div className="hero-body pb-100">
        <div className="is-flex is-align-items-center px-30 mb-40">
          <a href={PATHS.TEAMS.SETTINGS(teamId)} className="has-text-black-950 is-flex is-align-items-center">
            <ArrowLeftIcon />
            <span className="ml-10 has-text-gray-600">Team Management</span>
          </a>
          <div className="has-text-black-950 mx-5">/</div>
          <div className="has-text-black-950 mr-5">Edit Team Profile</div>
          <InviteIcon size="small" />
        </div>

        <div className="is-flex px-10 mb-25 is-justify-content-space-between is-align-items-center">
          <div className="is-flex is-flex-wrap-wrap is-align-items-center">
            <p className="has-text-weight-semibold has-text-black-950 is-size-4 mr-10">
              Edit Team Profile
            </p>
          </div>
          <div className="is-flex">
            <button
              className="button is-small is-outlined is-primary has-background-white has-text-primary border-radius-4px mr-10"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="button is-small is-primary border-radius-4px"
              type="button"
              onClick={onUpdate}
            >
              <CheckOnlineIcon size="small" />
              <span className="ml-8">
                Save
              </span>
            </button>
          </div>
        </div>
        <div className="px-10">
          <div className="mb-15">
            <span className="label is-size-6">
              Team Name <span className="has-text-error">*</span>
            </span>
            <InputField
                id="team-name"
                isRequired
                value={team.name}
                onChange={(teamName) => {
                  mutate({ name: teamName });
                  setErrors({ ...errors, name: null });
                }}
                error={ errors?.name }
                className='is-flex-grow-1'
              />
          </div>
          <div className="mb-15">
            <span className="label is-size-6">
              Team URL <span className="has-text-error">*</span>
            </span>
            <div className="is-flex">
              <InputField
                className={`${styles['initial-slug']}`}
                type="text"
                placeholder="app.semasoftware.com/teams/"
                error={ errors?.url}
                disabled
              />
              <InputField
                isRequired
                value={team.url}
                onChange={(teamUrl) => {
                  mutate({ url: teamUrl });
                  setErrors({ ...errors, url: null });
                }}
                error={ errors?.url }
                className={clsx(
                  'is-flex-grow-1',
                  styles.slug,
                  errors?.url && styles['url-error']
                )}
              />
              <button className="ml-16 button" 
                onClick={checkUrl}
                disabled={originalTeamUrl === team.url}
              >
                <div
                  className={clsx(
                    'is-flex is-align-items-center',
                    (isAllocatedUrl || errors?.url) &&
                      'has-text-red-500',
                    isAvailableUrl && 'has-text-green-500'
                  )}
                >
                  {isUrlCheckLoading ? (
                    <LoadingBlueIcon className="mr-8" size="small" />
                  ) : (
                    ((isAllocatedUrl || errors?.url) && (
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
            <span className="label is-size-6">
              Description
            </span>
            <textarea
              className="textarea has-background-white mb-10"
              placeholder="Description"
              value={team.description}
              onChange={(e) => {
                mutate({ description: e.target.value });
              }}
              required
            />
          </div>
          <div className="mb-15">
            <span className="label is-size-6">
              Profile Picture
            </span>
            <UploadFile
              onChange={(file) => {
                mutate({ avatarUrl: file });
                setErrors({ ...errors, avatarUrl: null });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default withSelectedTeam(withLayout(TeamEditPage));
