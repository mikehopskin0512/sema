import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import toaster from 'toasted-notes';
import Helmet, { TeamCreateHelmet } from '../../../components/utils/Helmet';
import withLayout from '../../../components/layout';
import { teamsOperations } from '../../../state/features/teams';
import { CheckFilledIcon, CheckOnlineIcon, CloseIcon } from '../../../components/Icons';
import { PATHS } from '../../../utils/constants' ;

const { createTeam } = teamsOperations;

const TeamEditPage = () => {
  const [team, setTeam] = useState({
    name: '',
    description: '',
    members: '',
  });
  const [errors, setErrors] = useState({
    name: null,
    description: null
  });
  const router = useRouter();
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.authState);

  const onSave = async () => {
    // validation
    if (!team.name || !team.description) {
      setErrors({
        name: !team.name ? 'Team name is required' : null,
        description: !team.description ? 'Team description is required' : null
      });
      return;
    }

    const data = await dispatch(createTeam(team, token));
    const { _id: teamId } = data;

    toaster.notify(({ onClose }) => (
      <div className="message is-success shadow mt-60">
        <div className="message-body has-background-white is-flex">
          <CheckFilledIcon size="small" />
          <div>
            <div className="is-flex is-justify-content-space-between mb-15">
              <span className="is-line-height-1 has-text-weight-semibold has-text-black ml-8">Team Created</span>
              <div onClick={onClose}>
                <CloseIcon size="small" />
              </div>
            </div>
            <div className="has-text-black">
              You've successfully created the team
            </div>
            <div>
              <span className="has-text-black has-text-weight-semibold">{ data.name }.</span>
              <a href={`${PATHS.TEAM._}/${teamId}`} className="has-text-primary ml-10" aria-hidden="true">Go to the team page</a>
            </div>
          </div>
        </div>
      </div>
    ), {
      position: 'top-right',
      duration: 4000,
    });

    await router.push(`${PATHS.TEAM._}/${teamId}`);
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
      <Helmet {...TeamCreateHelmet} />
      <div className="hero-body pb-100">
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
              className="button is-small is-primary border-radius-4px"
              type="button"
              onClick={onSave}
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
            <label className="label is-size-7">Team name</label>
            <input
              className="input has-background-white"
              type="text"
              placeholder="Team name"
              value={team.name}
              onChange={(e) => {
                mutate({name: e.target.value});
                setErrors({ name: null, description: errors.description });
              }}
              required={true}
            />
            { errors.name && <p className="has-text-danger is-size-7 is-italic">{errors.name}</p> }
          </div>
          <div className="mb-15">
            <label className="label is-size-7">Description</label>
            <textarea
              className="textarea has-background-white mb-10"
              placeholder="Description"
              value={team.description}
              onChange={(e) => {
                mutate({description: e.target.value});
                setErrors({ name: errors.name, description: null });
              }}
              required={true}
            />
            { errors.description && <p className="has-text-danger is-size-7 is-italic">{errors.description}</p> }
          </div>
          {/* TODO: This feature is for adding multiple users on the team */}
          {/* <div className="mt-40">
            <p className="has-text-weight-semibold has-text-black-950 is-size-4 mb-15">
              Invite members
            </p>
            <p className="is-size-7">
              You can add multiple team members by adding comas
            </p>
            <div className="mt-20 mb-50">
              <label className="label is-size-7">E-mail</label>
              <input
                className="input has-background-white"
                type="text"
                placeholder="example@gmail.com"
                value={team.members}
                onChange={(e) => mutate({ members: e.target.value })}
              />
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default withLayout(TeamEditPage);