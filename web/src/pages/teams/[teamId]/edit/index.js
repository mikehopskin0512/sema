import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import toaster from 'toasted-notes';
import Helmet, { TeamUpdateHelmet } from '../../../../components/utils/Helmet';
import withLayout from '../../../../components/layout';
import { teamsOperations } from '../../../../state/features/teams';
import { ArrowLeftIcon, CheckFilledIcon, CheckOnlineIcon, CloseIcon, InviteIcon } from '../../../../components/Icons';
import { PATHS } from '../../../../utils/constants' ;
import withSelectedTeam from '../../../../components/auth/withSelectedTeam';
import UploadFile from '../../../../components/team/UploadFile';
import { uploadTeamAvatar } from "../../../../state/features/teams/actions";

const { editTeam, fetchTeamsOfUser } = teamsOperations;

const TeamEditPage = () => {
  const {
    query: { teamId },
  } = useRouter();
  const [team, setTeam] = useState({
    name: '',
    description: '',
    members: '',
    avatarUrl: '',
  });
  const [errors, setErrors] = useState({
    name: null,
    description: null,
    url: null,
    avatarUrl: null,
  });
  const [userRole, setUserRole] = useState({})
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
      const activeRole = _.find(teams.teams, function (o) {
        return o.team?._id === teamId
      });
      const activeTeam = {
        _id: teamId,
        name: activeRole?.team?.name,
        description: activeRole?.team?.description,
        avatarUrl: activeRole?.team?.avatarUrl,
      }
      if (activeRole) {
        setUserRole(activeRole)
        setTeam(activeTeam)
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

  const onUpdate = async () => {
    // validation
    if (!team.name || !team.description) {
      setErrors({
        name: !team.name ? 'Team name is required' : null,
        description: !team.description ? 'Team description is required' : null
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
              You've successfully updated the team
            </div>
            <div>
              <span className="has-text-black has-text-weight-semibold">{ team.name }.</span>
              <a href={`${PATHS.TEAM._}/${teamId}${PATHS.SETTINGS}`} className="has-text-primary ml-10" aria-hidden="true">Go to the team page</a>
            </div>
          </div>
        </div>
      </div>
    ), {
      position: 'top-right',
      duration: 4000,
    });

    mutate(team);
    await router.push(`${PATHS.TEAM._}/${teamId}${PATHS.SETTINGS}`);
  };

  const mutate = (obj) => {
    setTeam({
      ...team,
      ...obj,
    });
  };

  const onCancel = async () => {
    await router.back();
  };

  return (
    <div className="has-background-gray-200 hero">
      <Helmet {...TeamUpdateHelmet} />
      <div className="hero-body pb-100">
        <div className="is-flex is-align-items-center px-30 mb-40">
          <a href={PATHS.TEAM.SETTINGS(teamId)} className="has-text-black-950 is-flex is-align-items-center">
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
            <label className="label is-size-7 has-text-weight-semibold">Team Name</label>
            <input
              className="input has-background-white"
              type="text"
              placeholder="Team Name"
              value={team.name}
              onChange={(e) => {
                mutate({ name: e.target.value });
                setErrors({ ...errors, name: null });
              }}
              required={true}
            />
            { errors.name && <p className="has-text-danger is-size-7 is-italic">{errors.name}</p> }
          </div>
          <div className="mb-15">
            <label className="label is-size-7 has-text-weight-semibold">Team Url</label>
            <div className="is-flex">
              <input
                className="input has-background-white"
                type="text"
                placeholder="Team Url"
                value={team.url}
                onChange={(e) => {
                  mutate({ url: e.target.value });
                  setErrors({ ...errors, url: null });
                }}
                required={true}
              />

              <button className="button ml-10 px-25">Check</button>
            </div>
            { errors.url && <p className="has-text-danger is-size-7 is-italic">{errors.url}</p> }
          </div>
          <div className="mb-15">
            <label className="label is-size-7 has-text-weight-semibold">Description</label>
            <textarea
              className="textarea has-background-white mb-10"
              placeholder="Description"
              value={team.description}
              onChange={(e) => {
                mutate({ description: e.target.value });
                setErrors({ ...errors, description: null });
              }}
              required={true}
            />
            { errors.description && <p className="has-text-danger is-size-7 is-italic">{errors.description}</p> }
          </div>

          <div className="mb-15">
            <label className="label is-size-7 has-text-weight-semibold">Profile Picture</label>
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
};

export default withSelectedTeam(withLayout(TeamEditPage));
