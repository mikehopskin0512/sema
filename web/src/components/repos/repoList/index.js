import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import usePermission from '../../../hooks/usePermission';
import RepoCard from '../repoCard';
import TeamReposList from '../../../components/teamReposList';
import RepoTable from '../repoTable';
import styles from './repoList.module.scss';
import { ListIcon, GridIcon, PlusIcon } from '../../Icons';

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

const RepoList = ({ type, repos = [] }) => {
  const [view, setView] = useState('grid');
  const [sort, setSort] = useState(filterOptions[0]);
  const [filteredRepos, setFilteredRepos] = useState([]);
  const { isTeamAdmin } = usePermission();
  const sortRepos = async () => {
    setFilteredRepos([]);
    if (!repos?.length) {
      return []
    }
    let sortedRepos = [];
    switch (sort.value) {
      case 'a-z':
        sortedRepos = repos.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0))
        break;
      case 'z-a':
        sortedRepos = repos.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? -1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? 1 : 0))
        break;
      case 'recentlyUpdated':
        sortedRepos = repos.sort((a, b) => (new Date(a.updatedAt) - new Date(b.updatedAt) > 1) ? -1 : ((new Date(b.updatedAt) - new Date(a.updatedAt) > 1) ? 1 : 0))
        break;
      case 'mostActive':
        sortedRepos = repos.sort((a, b) => {
          let totalStatsA = 0;
          let totalStatsB = 0;
          for (const [key, value] of Object.entries(a.stats)) {
            totalStatsA += value
          }
          for (const [key, value] of Object.entries(b.stats)) {
            totalStatsB += value
          }
          return ((totalStatsA > totalStatsB) ? -1 : (totalStatsB > totalStatsA) ? 1 : 0)
        })
        break;
      default:
        break;
    }
    setFilteredRepos(sortedRepos)
  };

  const renderCards = (repos) => {
    return repos.map((child, i) => (
      <RepoCard {...child} isFavorite={type === 'FAVORITES'} key={i} />
    ))
  }

  useEffect(() => {
      sortRepos();
  }, [sort, repos]);

  useEffect(() => {
    setFilteredRepos(repos);
    sortRepos();
  }, [])
  const [isRepoListOpen, setRepoListOpen] = useState(false);
  return (
    repos.length > 0 ? (
      <div className="mb-50">
        {isTeamAdmin() && (
          <TeamReposList
            isActive={isRepoListOpen}
            onClose={() => setRepoListOpen(false)}
          />
        )}
        <div className="is-flex is-justify-content-space-between">
          <div className="is-flex">
            <p className="is-inline-block has-text-black-950 has-text-weight-semibold is-size-4 mb-20 px-15">{LIST_TYPE[type]}</p>
            {
              type === 'REPOS' &&
              (<Select
                onChange={(v) => setSort(v)}
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
          { type !== 'REPOS' && (
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
