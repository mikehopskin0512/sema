import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import usePermission from '../../../hooks/usePermission';
import RepoCard from '../repoCard';
import TeamReposList from '../../../components/teamReposList';
import RepoTable from '../repoTable';
import styles from './repoList.module.scss';
import { ListIcon, GridIcon, PlusIcon, FilterBarsIcon, SearchIcon } from '../../Icons';
import { triggerAlert } from '../../../state/features/alerts/actions';
import { fetchTeamRepos } from '../../../state/features/teams/actions';
import { updateTeamRepositories } from '../../../state/features/teams/operations';
import DropDownMenu from '../../../components/dropDownMenu';
import { getCommentsCountLastMonth } from '../../../utils/codeStats';
import InputField from '../../../components/inputs/InputField';
import { blue700 } from '../../../../styles/_colors.module.scss';

const LIST_TYPE = {
  FAVORITES: 'Favorite Repos',
  MY_REPOS: 'My Repos',
  REPOS: 'Repos',
};

const filterOptions = [
  { value: 'a-z', label: 'A - Z', placeholder: 'A - Z' },
  { value: 'z-a', label: 'Z - A', placeholder: 'Z - A' },
  { value: 'dateAdded', label: 'Date Added', placeholder: 'Date Added' },
  { value: 'mostRecent', label: 'Most Recent Sema Comment', placeholder: 'Recent comment' },
  { value: 'mostActive', label: 'Most Active', placeholder: 'Most Active' },
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
  const [sort, setSort] = useState({});
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
      case 'dateAdded':
        sortedRepos.sort((a, b) => getSortValue(new Date(b.createdAt), new Date(a.createdAt)))
        break;
      case 'mostRecent':
        sortedRepos.sort((a, b) => {
          const [lastItemA] = a.repoStats.reactions.slice(-1)
          const [lastItemB] = b.repoStats.reactions.slice(-1)
          if (!lastItemA) {
            return 0
          }
          return getSortValue(new Date(lastItemB.createdAt), new Date(lastItemA.createdAt))
        })
        break;
      case 'mostActive':
        sortedRepos.sort((a, b) => {
          const totalCommentsA = getCommentsCountLastMonth(a)
          const totalCommentsB = getCommentsCountLastMonth(b)
          return getSortValue(totalCommentsB, totalCommentsA);
        })
        break;
      default:
        break;
    }
    setFilteredRepos(sortedRepos)
  };

  const renderCards = (repos) => {
    return repos.map((child, i) => (
      <RepoCard {...child} isTeamView={type !== 'MY_REPOS'} isFavorite={type === 'FAVORITES'} key={i} onRemoveRepo={removeRepo} />
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
            <p className="is-inline-block has-text-black-950 has-text-weight-semibold is-size-4 mb-20 px-15">{LIST_TYPE[type]}</p>
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
          <div className="is-flex">
            <button className={clsx("button border-radius-0 is-small", view === 'list' ? 'is-primary' : '')} onClick={() => setView('list')}>
              <ListIcon />
            </button>
            <button className={clsx("button border-radius-0 is-small", view === 'grid' ? 'is-primary' : '')} onClick={() => setView('grid')}>
              <GridIcon />
            </button>
          </div>
        </div>
        <div className='columns'>
          <div className='column'>
            {withSearch && (
              <div className='pl-10'>
                <InputField placeholder='Search' iconLeft={<SearchIcon />} value={search} onChange={onSearchChange} />
              </div>
            )}
          </div>
          <div className='column is-2'>
            <div className='is-flex is-justify-content-flex-end mb-10'>
              <DropDownMenu
                className={'is-primary'}
                isActiveClassName={'is-black'}
                isRight
                options={
                  filterOptions.map((filter) => {
                    return {
                      ...filter,
                      onClick: () => setSort(filter)
                    }
                  })
                }
                trigger={(
                  <button class="button is-primary is-outlined" aria-haspopup="true" aria-controls="dropdown-menu2">
                    <FilterBarsIcon size="small" fill={blue700} />
                    <span className='ml-10 has-text-weight-semibold'>{sort.placeholder || 'Sort By'}</span>
                  </button>
                )}
              />
            </div>
          </div>
        </div>
        {view === 'grid' ? (
          <div className="is-flex is-flex-wrap-wrap is-align-content-stretch">
            {renderCards(filteredRepos)}
          </div>
        ) : null}
        {view === 'list' ? (
          <RepoTable data={filteredRepos} removeRepo={removeRepo} isTeamView={type !== 'MY_REPOS'} />
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
