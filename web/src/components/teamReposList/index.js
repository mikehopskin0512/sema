import clsx from 'clsx';
import React, { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import Checkbox from '../../components/checkbox';
import { fetchRepoDashboard } from '../../state/features/repositories/actions';
import { editTeamRepos, fetchTeamRepos } from '../../state/features/teams/actions';
import Loader from '../../components/Loader';
import Table from '../table';
import { alertOperations } from '../../state/features/alerts';

const TeamReposList = ({ isActive, onClose }) => {
  const { triggerAlert } = alertOperations;
  const dispatch = useDispatch();
  const { selectedTeam, user, token } = useSelector((state) => state.authState);
  const { repos } = useSelector((state) => state.teamsState);
  const {
    data: { repositories },
    isFetching: isFetchingAdminRepos
  } = useSelector((state) => state.repositoriesState);
  const [activeRepos, setActiveRepos] = useState(new Set(repos.map(repo => repo._id)));
  const isAllSelected = activeRepos.size === repositories.length;
  const { team } = selectedTeam;
  const toggleRepoIsActive = (repoId) => {
    const repos = new Set(activeRepos);
    if (repos.has(repoId)) {
      repos.delete(repoId);
    } else {
      repos.add(repoId);
    }
    setActiveRepos(repos);
  };
  const toggleAllSelections = () => {
    setActiveRepos(new Set(
      isAllSelected ? [] : repositories.map((repo) => repo._id),
    ));
  };
  useEffect(() => {
    if (!repositories.length) {
      const adminRepoExternalIds = user?.identities[0].repositories.map(repo => repo.id);
      dispatch(fetchRepoDashboard(adminRepoExternalIds, token))
    }
  }, [])
  const columns = useMemo(
    () => [
      {
        Header: 'Repo Name',
        accessor: 'repo',
        className: 'p-16 has-text-weight-bold',
        Cell: ({ cell: { value } }) => (
          <div className="is-flex">
            <Checkbox
              value={activeRepos.has(value.id)}
              onChange={() => toggleRepoIsActive(value.id)}
            />
            <span className="ml-8">{value.name}</span>
          </div>
        )
      },
      {
        Header: 'Date of last Comment',
        accessor: 'lastCommentDate',
        className: 'has-text-weight-bold',
      },
      {
        Header: 'Number of Sema comments',
        accessor: 'totalComments',
        className: 'has-text-weight-bold',
      },
    ],
    [activeRepos],
  );
  const data = useMemo(() => repositories.map(repo => ({
    repo: {
      name: repo.name,
      isActive: true,
      id: repo._id,
    },
    lastCommentDate: repo.updatedAt ? format(new Date(repo.updatedAt), 'yyyy-MM-dd') : '-',
    totalComments: repo.repoStats?.smartComments || '-',
  })), [repositories]);
  const addRepos = async () => {
    try {
      await dispatch(editTeamRepos(team._id, { repos: Array(...activeRepos) }, token));
      dispatch(fetchTeamRepos(team._id, token));
      dispatch(triggerAlert('Repos were added', 'success'));
      onClose();
    } catch (e) {
      dispatch(triggerAlert('Unable to add repos', 'error'));
    }
  };
  if (!team) {
    return null
  }
  return (
    <div className={clsx('modal', isActive && 'is-active')}>
      <div className="modal-background" />
      <div className="modal-content p-50" style={{ width: 950 }}>
        <div className="has-background-white p-50">
          <button className="modal-close is-large" aria-label="close" type="button" onClick={onClose} />
          <p className="is-size-4 has-text-weight-semibold is-size-3-mobile">
            Choose Repos to add to Team {team.name}
          </p>
          <div className="my-16 is-flex is-align-items-center">
            <Checkbox value={isAllSelected} onChange={toggleAllSelections} />
            <span className="ml-8">All repos</span>
          </div>
          {isFetchingAdminRepos ? (
            <Loader />
          ) : (
            <Table
              data={data}
              columns={columns}
            />
          )}
          <div className="field is-grouped mt-25 is-flex is-justify-content-space-between sema-is-align-items-center">
            <div className="is-flex is-align-items-center">
              Can't find your repo, please leave your first comment&nbsp;
              <a
                className="sema-has-text-weight-bold"
                href="https://github.com"
                target="_blank"
              >
                here
              </a>
            </div>
            <div className="control">
              <button onClick={onClose} className="button mr-16" type="button">Cancel</button>
              <button
                onClick={addRepos}
                className={'button is-primary is-pulled-right'}
              >
                Add {activeRepos.size}
                {activeRepos.size === 1 ? ' Repo' : ' Repos'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamReposList;
