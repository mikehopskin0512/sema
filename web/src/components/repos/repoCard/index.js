import React, { useState } from 'react';
import clsx from 'clsx';
import usePermission from '../../../hooks/usePermission';
import DeleteRepoModal from '../repoCard/deleteRepoModal';
import { useDispatch, useSelector } from 'react-redux';
import { triggerAlert } from '../../../state/features/alerts/actions';
import { editTeamRepos, fetchTeamRepos } from '../../../state/features/teams/actions';
import { OptionsIcon } from '../../Icons';
import DropDownMenu from '../../dropDownMenu';
import styles from './repoCard.module.scss';
import RepoUsers from '../repoUsers';
import { PATHS } from '../../../utils/constants';

const statLabels = {
  smartCodeReviews: 'Smart Code Reviews',
  smartComments: 'Smart Comments',
  smartCommenters: 'Smart Commenters',
  semaUsers: 'Sema User',
};

const RepoCard = (props) => {
  const {
    name, externalId, _id: repoId, repoStats, users = [], column = 3
  } = props;
  const { token, selectedTeam } = useSelector((state) => state.authState)
  const dispatch = useDispatch();
  const onClickRepo = () => {
    // Change Redirect link when overview is done!
    window.location = `${PATHS.REPO}/${externalId}`;
  };
  const { isTeamAdmin } = usePermission();

  const renderStats = (label, value) => (
    <div className={clsx(
      'has-background-gray-100 border-radius-8px p-15 is-full-width is-flex is-flex-direction-column is-justify-content-space-between',
    )}>
      <p className={clsx('is-size-8 has-text-weight-semibold has-text-gray-700 is-uppercase', styles['stat-title'])}>{label}</p>
      <p className="is-size-4 has-text-weight-semibold has-text-black">{value}</p>
    </div>
  );
  const [isDeleteRepoModalOpen, setDeleteRepoModalOpen] = useState(false);
  const removeRepo = async (e) => {
    e.stopPropagation();
    const repos = selectedTeam.team.repos.filter(id => id !== repoId);
    try {
      await dispatch(editTeamRepos(selectedTeam.team._id, { repos }, token));
      setDeleteRepoModalOpen(false);
      dispatch(triggerAlert('Repo has been deleted', 'success'));
      dispatch(fetchTeamRepos(selectedTeam.team._id, token));
    } catch (e) {
      dispatch(triggerAlert('Unable to delete repo', 'error'));
    }
  };

  return (
    <div
      className={clsx('p-10 is-flex is-flex-grow-1 is-clickable', column === 3 && styles['card-width-3c'], column === 2 && styles['card-width-2c'])}
      onClick={onClickRepo}
      aria-hidden
    >
      <div className="box has-background-white is-full-width p-0 border-radius-2px is-flex is-flex-direction-column">
        <div className="has-background-gray-200 is-flex is-justify-content-space-between p-12 is-align-items-center">
          <p className="has-text-black-900 has-text-weight-semibold is-size-5">{name}</p>
          <RepoUsers users={users} />
        </div>
        <div className="is-flex-grow-1 is-flex is-flex-direction-column is-justify-content-space-between">
          <div className="px-12 is-flex is-justify-content-space-between is-flex-wrap-wrap">
            {Object.keys(statLabels).map((item, i) => (
              <div className={clsx('my-12 is-flex', styles.stat)} key={i}>
                {renderStats(statLabels[item], repoStats?.[item])}
              </div>
            ))}
          </div>
        </div>
        {isTeamAdmin && (
          <div className="has-background-gray-300 is-flex py-8 pr-12">
            <DropDownMenu
              options={[{ label: 'Remove from Team', onClick: () => setDeleteRepoModalOpen(true) }]}
              trigger={(
                <div className="is-clickable is-flex">
                  <OptionsIcon />
                </div>
              )}
            />
          </div>
        )}
      </div>
      {isTeamAdmin && (
        <DeleteRepoModal
          isOpen={isDeleteRepoModalOpen}
          onCancel={() => setDeleteRepoModalOpen(false)}
          onConfirm={removeRepo}
        />
      )}
    </div>
  );
};

// Repos model isn't currently updated in RepoType
// RepoCard.propTypes = RepoType;

export default RepoCard;
