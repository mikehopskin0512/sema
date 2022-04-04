import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import usePermission from '../../../hooks/usePermission';
import RepoCard from '../repoCard';
import TeamReposList from '../../../components/teamReposList';
import RepoTable from '../repoTable';
import styles from './repoList.module.scss';
import { GridIcon, ListIcon, PlusIcon, SearchIcon } from '../../Icons';
import { triggerAlert } from '../../../state/features/alerts/actions';
import { fetchTeamRepos } from '../../../state/features/teams/actions';
import { updateTeamRepositories } from '../../../state/features/teams/operations';
import InputField from '../../../components/inputs/InputField';

const LIST_TYPE = {
  FAVORITES: 'Favorite Repos',
  MY_REPOS: 'My Repos',
  REPOS: 'Repos',
};

const filterOptions = [
  { value: 'a-z', label: 'Alphabetically, A - Z' },
  { value: 'z-a', label: 'Alphabetically, Z - A' },
  { value: 'recentlyUpdated', label: 'Recently Updated' },
  { value: 'mostActive', label: 'Most Active' },
]

const RepoList = ({
  type,
  repos = [],
  onSearchChange,
  search,
  withSearch,
}) => {
  const dispatch = useDispatch();
  const { token, selectedTeam } = useSelector((state) => state.authState);

  const [view, setView] = useState('grid');
  const [sort, setSort] = useState(filterOptions[0]);
  const [filteredRepos, setFilteredRepos] = useState([]);
  const { isTeamAdmin } = usePermission();

  const removeRepo = async (repoId) => {
    try {
      const newRepos = repos.filter(repo => repo?._id !== repoId).map(repo => repo._id);
      await dispatch(updateTeamRepositories(selectedTeam.team._id, { repos: newRepos }, token));
      dispatch(triggerAlert('Repo has been deleted', 'success'));
      dispatch(fetchTeamRepos(selectedTeam.team._id, token));
    } catch (e) {
      dispatch(triggerAlert('Unable to delete repo', 'error'));
    }
  }

  const sortRepos = async () => {
    setFilteredRepos([]);
    if (!repos?.length) {
      return []
    }
    const sortedRepos = [...repos];
    const getSortValue = (a, b) => a !== b ? (a > b ? 1 : -1) : 0;
    switch (sort.value) {
    case 'a-z':
      sortedRepos.sort((a, b) => getSortValue(a.name?.toLowerCase(), b.name?.toLowerCase()))
      break;
    case 'z-a':
      sortedRepos.sort((a, b) => getSortValue(b.name?.toLowerCase(), a.name?.toLowerCase()))
      break;
    case 'recentlyUpdated':
      sortedRepos.sort((a, b) => getSortValue(new Date(b.updatedAt), new Date(a.updatedAt)))
      break;
    case 'mostActive':
      sortedRepos.sort((a, b) => {
        let totalStatsA = 0;
        let totalStatsB = 0;
        for (const [key, value] of Object.entries(a.repoStats)) {
          totalStatsA += value
        }
        for (const [key, value] of Object.entries(b.repoStats)) {
          totalStatsB += value
        }
        return getSortValue(totalStatsA, totalStatsB);
      })
      break;
    default:
      break;
    }
    setFilteredRepos(sortedRepos)
  };

  const renderCards = (repos) => {
    return repos.map((child, i) => (
      <RepoCard {...child} isTeamView={type !== 'MY_REPOS'} isFavorite={type === 'FAVORITES'} key={i} onRemoveRepo={removeRepo}/>
    ))
  }

  useEffect(() => {
    sortRepos();
  }, [sort, repos]);

  const [isRepoListOpen, setRepoListOpen] = useState(false);
  return (
    (repos.length > 0 || withSearch) ? (
      <div className='mb-50'>
        {isTeamAdmin() && (
          <TeamReposList
            isActive={isRepoListOpen}
            onClose={() => setRepoListOpen(false)}
          />
        )}
        <div className="is-flex is-justify-content-space-between">
          <div className="is-flex">
            <p className="is-inline-block has-text-black-950 has-text-weight-semibold is-size-4 mb-20 px-10">{LIST_TYPE[type]}</p>
            {
              type === 'REPOS' &&
              (<Select
                onChange={setSort}
                value={sort}
                className={clsx("ml-20 is-inline-block", styles['filter-select'])}
                defaultValue={filterOptions[0]}
                isDisabled={false}
                styles={{
                  width: '200px'
                }}
                options={filterOptions}
              />)
            }
            {isTeamAdmin() && (
              <button
                type="button"
                className="ml-16 button is-primary"
                onClick={() => setRepoListOpen(true)}
              >
                <PlusIcon size="small" />
                <span className="ml-8">Add a Repo</span>
              </button>
            )}
          </div>
          {type !== 'REPOS' && (
            <div className="is-flex">
              <button className={clsx("button border-radius-0 is-small", view === 'list' ? 'is-primary' : '')} onClick={() => setView('list')}>
                <ListIcon />
              </button>
              <button className={clsx("button border-radius-0 is-small", view === 'grid' ? 'is-primary' : '')} onClick={() => setView('grid')}>
                <GridIcon />
              </button>
            </div>
          )}
        </div>
        {withSearch && (
          <div className='pl-10'>
            <InputField placeholder='Search' iconLeft={<SearchIcon />} value={search} onChange={onSearchChange} />
          </div>
        )}
        {view === 'grid' ? (
          <div className="is-flex is-flex-wrap-wrap is-align-content-stretch">
            {renderCards(filteredRepos)}
          </div>
        ) : null}
        {view === 'list' ? (
          <RepoTable data={filteredRepos} />
        ) : null}
      </div>
    ) : null
  )
};

RepoList.defaultProps = {
  repos: [],
};

RepoList.propTypes = {
  type: PropTypes.string.isRequired,
  // Repos model isn't currently updated in RepoType
  // repos: PropTypes.arrayOf(
  //  PropTypes.exact(RepoType),
  //),
};

export default RepoList;
