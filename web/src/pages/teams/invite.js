import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import Helmet, { TeamCreateHelmet } from '../../components/utils/Helmet';
import withLayout from '../../components/layout';
import { teamsOperations } from '../../state/features/teams';
import styles from './teams.module.scss';
import clsx from 'clsx';
import Checkbox from '@/components/checkbox';

const { createTeam } = teamsOperations;

const TeamInvitePage = () => {
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
              onClick={onSave}
            >
              <FontAwesomeIcon icon={faCheck} className="mr-10" />
              Save
            </button>
          </div>
        </div>
        <div className="px-10">
          <div className={clsx('py-10 px-20', styles.notification)}>
            <FontAwesomeIcon icon={faInfoCircle} color="#2D74B9" className="mr-10" />
            You can add multiple team members with same permission
          </div>
          <div>
            <div className="my-25">
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
          <div>
            <div className="mb-15">Manage permissions</div>
            <div>
              <div className="field switch-input" aria-hidden>
                <input
                  id="check-suggested"
                  type="checkbox"
                  className="switch is-rounded"
                />
                <label htmlFor="check-suggested">
                  Add Suggested Comments to Team profile
                </label>
              </div>
              <div className="field switch-input" aria-hidden>
                <input
                  id="check-guide"
                  type="checkbox"
                  className="switch is-rounded"
                />
                <label htmlFor="check-guide">
                  Add Community Guides to Team profile
                </label>
              </div>
              <div className="field switch-input" aria-hidden>
                <input
                  id="check-library"
                  type="checkbox"
                  className="switch is-rounded"
                />
                <label htmlFor="check-library">
                  Library Admin
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withLayout(TeamInvitePage);
