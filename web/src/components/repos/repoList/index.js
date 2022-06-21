import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { range } from 'lodash';
import usePermission from '../../../hooks/usePermission';
import RepoCard from '../repoCard';
import OrganizationReposList from '../../../components/organizationReposList';
import RepoTable from '../repoTable';
import styles from './repoList.module.scss';
import repoStyles from '../repoCard/repoCard.module.scss';
import { FilterBarsIcon, GridIcon, ListIcon, PlusIcon, SearchIcon } from '../../Icons';
import { triggerAlert } from '../../../state/features/alerts/actions';
import { fetchOrganizationRepos } from '../../../state/features/organizations[new]/actions';
import { updateOrganizationRepositories } from '../../../state/features/organizations[new]/operations';
import DropDownMenu from '../../../components/dropDownMenu';
import { getCommentsCountLastMonth } from '../../../utils/codeStats';
import InputField from '../../../components/inputs/InputField';
import { blue700 } from '../../../../styles/_colors.module.scss';
import { alertOperations } from '../../../state/features/alerts';
import RepoSkeleton from '../../../components/skeletons/repoSkeleton';

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
  isLoaded,
  pinnedRepos = [],
  otherReposCount,
}) => {
  const dispatch = useDispatch();
  const { token, selectedOrganization } = useSelector((state) => state.authState);

  const [view, setView] = useState('grid');
  const [sort, setSort] = useState({});
  const [filteredRepos, setFilteredRepos] = useState({ other: [], pinned: [] });
  const { isOrganizationAdmin } = usePermission();
  const { clearAlert } = alertOperations;

  const removeRepo = async (repoId) => {
    try {
      const newRepos = repos.filter(repo => repo?._id !== repoId).map(repo => repo._id);
      await dispatch(updateOrganizationRepositories(selectedOrganization.organization._id, { repos: newRepos }, token));
      dispatch(triggerAlert('Repo has been deleted', 'success'));
      dispatch(fetchOrganizationRepos({ organizationId: selectedOrganization.organization._id }, token));
    } catch (e) {
      dispatch(triggerAlert('Unable to delete repo', 'error'));
    }
  }

  const sortRepos = async () => {
    setFilteredRepos({ other: [], pinned: [] });
    if (!repos?.length && !pinnedRepos.length) {
      return []
    }
    const sortedRepos = [...repos];
    const sortedPinnedRepos = [...pinnedRepos];
    const getSortValue = (a, b) => a !== b ? (a > b ? 1 : -1) : 0;
    switch (sort.value) {
      case 'a-z':
        sortedRepos.sort((a, b) => getSortValue(a.name?.toLowerCase(), b.name?.toLowerCase()));
        sortedPinnedRepos.sort((a, b) => getSortValue(a.name?.toLowerCase(), b.name?.toLowerCase()));
        break;
      case 'z-a':
        sortedRepos.sort((a, b) => getSortValue(b.name?.toLowerCase(), a.name?.toLowerCase()));
        sortedPinnedRepos.sort((a, b) => getSortValue(b.name?.toLowerCase(), a.name?.toLowerCase()));
        break;
      case 'dateAdded':
        sortedRepos.sort((a, b) => getSortValue(new Date(b.createdAt), new Date(a.createdAt)));
        sortedPinnedRepos.sort((a, b) => getSortValue(new Date(b.createdAt), new Date(a.createdAt)));
        break;
      case 'mostRecent':
        sortedRepos.sort((a, b) => {
          const [lastItemA] = a.repoStats.reactions.slice(-1);
          const [lastItemB] = b.repoStats.reactions.slice(-1);
          if (!lastItemA) {
            return 0;
          }
          return getSortValue(new Date(lastItemB.createdAt), new Date(lastItemA.createdAt));
        });
        sortedPinnedRepos.sort((a, b) => {
          const [lastItemA] = a.repoStats.reactions.slice(-1);
          const [lastItemB] = b.repoStats.reactions.slice(-1);
          if (!lastItemA) {
            return 0;
          }
          return getSortValue(new Date(lastItemB.createdAt), new Date(lastItemA.createdAt));
        })
        break;
      case 'mostActive':
        sortedRepos.sort((a, b) => {
          const totalCommentsA = getCommentsCountLastMonth(a)
          const totalCommentsB = getCommentsCountLastMonth(b)
          return getSortValue(totalCommentsB, totalCommentsA);
        });
        sortedPinnedRepos.sort((a, b) => {
          const totalCommentsA = getCommentsCountLastMonth(a)
          const totalCommentsB = getCommentsCountLastMonth(b)
          return getSortValue(totalCommentsB, totalCommentsA);
        });
        break;
      default:
        break;
    }
    setFilteredRepos({ other: sortedRepos, pinned: sortedPinnedRepos });
  };

  const renderCards = (repos) => {
    return repos.map((child, i) => (
      <RepoCard {...child} isOrganizationView={type !== 'MY_REPOS'} isFavorite={type === 'FAVORITES'} key={i} onRemoveRepo={removeRepo} />
    ))
  }

  const handleOnClose = () => {
    dispatch(clearAlert());
    setRepoListOpen(false);
  }

  useEffect(() => {
    sortRepos();
  }, [sort, repos, pinnedRepos]);

  const [isRepoListOpen, setRepoListOpen] = useState(false);
  return (
    (repos.length > 0 || withSearch) ? (
      <div className='mb-50'>
        {isOrganizationAdmin() && (
          <OrganizationReposList
            isActive={isRepoListOpen}
            onClose={handleOnClose}
          />
        )}
        <div className="is-flex is-justify-content-space-between">
          <div className="is-flex">
            <p className="is-inline-block has-text-black-950 has-text-weight-semibold is-size-4 mb-20 px-15">{LIST_TYPE[type]}</p>
          </div>
          <div className="is-flex">
            <button className={clsx("button border-radius-0 is-small", view === 'list' ? 'is-primary' : '')} onClick={() => setView('list')}>
              <ListIcon />
            </button>
            <button className={clsx("button border-radius-0 is-small", view === 'grid' ? 'is-primary' : '')} onClick={() => setView('grid')}>
              <GridIcon />
            </button>
            {isOrganizationAdmin() && (
              <button
                type="button"
                className={clsx("ml-16 button is-primary", styles['add-repo-button'])}
                onClick={() => setRepoListOpen(true)}
              >
                <PlusIcon size="small" />
                <span className="ml-8">Add a Repo</span>
              </button>
            )}
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
                  <button className="button is-primary is-outlined" aria-haspopup="true" aria-controls="dropdown-menu2">
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
            {!isLoaded ? range(9).map(_ => (
              <div
                className={clsx(
                  'p-10 is-flex is-flex-grow-1 is-clickable',
                  repoStyles['card-width-3c'],
                )}
                aria-hidden
              >
                <div className={repoStyles['repo-skeleton-background']}>
                  <RepoSkeleton />
                </div>
              </div>
            )) :
              <div>
                <div className="has-text-weight-semibold is-size-5 ml-10 mb-25">{`Pinned repos (${pinnedRepos.length})`}</div>
                <div className={clsx("is-flex is-flex-wrap", !filteredRepos.pinned.length && 'ml-10' )}>{!pinnedRepos.length ? 'No Pinned Repos yet. Add your first one!' : (search && filteredRepos.pinned.length === 0) ? 'No Results Found. We couldn’t find any match' : renderCards(filteredRepos.pinned)}</div>
                <div className="has-text-weight-semibold is-size-5 ml-10 mb-25 mt-40">{`Other repos (${otherReposCount})`}</div>
                <div className={clsx("is-flex is-flex-wrap", !filteredRepos.other.length && 'ml-10' )}>{!repos.length ? 'No Repos yet.' : (search && filteredRepos.other.length === 0) ? 'No Results Found. We couldn’t find any match' : renderCards(filteredRepos.other)}</div>
                </div>}
          </div>
        ) : null}
        {view === 'list' ? (
          <RepoTable search={search} otherReposCount={otherReposCount} data={filteredRepos} removeRepo={removeRepo} isOrganizationView={type !== 'MY_REPOS'} />
        ) : null}
      </div>
    ) : null
  )
};

RepoList.defaultProps = {
  repos: [],
  isLoaded: true
};

RepoList.propTypes = {
  type: PropTypes.string.isRequired,
  isLoaded: PropTypes.bool
  // Repos model isn't currently updated in RepoType
  // repos: PropTypes.arrayOf(
  //  PropTypes.exact(RepoType),
  //),
};

export default RepoList;
