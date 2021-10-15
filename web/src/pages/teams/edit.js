import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import Helmet, { TeamCreateHelmet } from '../../components/utils/Helmet';
import withLayout from '../../components/layout';
import { teamsOperations } from '../../state/features/teams';

const { createTeam } = teamsOperations;

const TeamEditPage = () => {
  const [team, setTeam] = useState({
    name: '',
    description: '',
    members: '',
  });
  const router = useRouter();
  const dispatch = useDispatch();

  const { auth } = useSelector((state) => ({
    auth: state.authState,
  }));

  const { token } = auth;

  const onSave = async () => {
    await dispatch(createTeam(team, token));
    await router.push('/teams');
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
    <div className="has-background-gray-9 hero">
      <Helmet {...TeamCreateHelmet} />
      <div className="hero-body pb-300">
        <div className="is-flex px-10 mb-25 is-justify-content-space-between is-align-items-center">
          <div className="is-flex is-flex-wrap-wrap is-align-items-center">
            <p className="has-text-weight-semibold has-text-deep-black is-size-4 mr-10">
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
              <FontAwesomeIcon icon={faCheck} className="mr-10" />
              Save
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
              onChange={(e) => mutate({ name: e.target.value })}
            />
          </div>
          <div className="mb-15">
            <label className="label is-size-7">Description</label>
            <textarea
              className="textarea has-background-white mb-10"
              placeholder="Description"
              value={team.description}
              onChange={(e) => mutate({ description: e.target.value })}
            />
          </div>
          <div className="mt-40">
            <p className="has-text-weight-semibold has-text-deep-black is-size-4 mb-15">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default withLayout(TeamEditPage);
