import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import EmptyRepo from '../../../components/repos/emptyRepo';
import RepoList from '../../../components/repos/repoList';
import { remove } from 'lodash';
import { useSelector } from 'react-redux';
import styles from './reposView.module.scss';

const NUM_PER_PAGE = 9;

const REPO_TYPES = {
  USER: 'user',
  ORGANIZATION: 'organization'
}

const ReposView = ({
  type = 'user',
  onSearchChange,
  searchQuery,
  withSearch,
  isLoaded
}) => {
  const { authState, githubUser, repositories, organizations } = useSelector((state) => ({
    githubUser: state.authState.user.identities?.[0],
    repositories: state.repositoriesState.data.repositories,
    organizations: state.organizationsNewState,
    authState: state.authState,
  }));
  const { user, selectedOrganization } = authState;
  const [repos, setRepos] = useState({
    favorites: [],
    other: [],
    pinned: [],
  });
  const [page, setPage] = useState(1);
  const isMoreReposAvailable = repos.other.length > NUM_PER_PAGE && NUM_PER_PAGE * page < repos.other.length;
  const isEmptyRepo = (type === REPO_TYPES.USER && (!repositories.length && !repositories.isFetching)) ||
    (type === REPO_TYPES.ORGANIZATION && (!organizations.isFetching && !organizations.organizations.length))

  useEffect(() => {
    if (githubUser && type === 'user') {
      const favoriteRepoIds = githubUser.repositories.filter((repo) => repo.isFavorite).map((repo) => repo.id);
      const repos = [...repositories];
      const favoriteRepos = remove(repos, (repo) => favoriteRepoIds.includes(repo.externalId));

      const pinnedRepos = repos.filter(repo => user.pinnedRepos?.includes(repo._id.toString()));
      const otherRepos = repos.filter(repo => !user.pinnedRepos?.includes(repo._id.toString()));
      setRepos({
        favorites: favoriteRepos,
        other: otherRepos,
        pinned: pinnedRepos,
      });
    }
  }, [repositories, user]);

  useEffect(() => {
    if (organizations && type === 'organization') {
      const repos = organizations.repos;
      const pinnedRepos = repos.filter(repo => selectedOrganization.organization.pinnedRepos?.includes(repo._id.toString()));
      const otherRepos = repos.filter(repo => !selectedOrganization.organization.pinnedRepos?.includes(repo._id.toString()));
      setRepos({
        favorites: [],
        other: otherRepos,
        pinned: pinnedRepos,
      });
    }
  }, [organizations, selectedOrganization]);

  return ( !repositories.isFetching &&
    <>
    <div className={clsx('my-40', styles['repos-container'])}>
      <RepoList
          type={type === 'organization' ? 'REPOS' : 'MY_REPOS'}
          repos={repos.other.slice(0, NUM_PER_PAGE * page)}
          pinnedRepos={repos.pinned}
          search={searchQuery}
          onSearchChange={onSearchChange}
          withSearch={withSearch}
          isLoaded={isLoaded}
          otherReposCount={repos.other.length}
        />
        {isEmptyRepo && !searchQuery && <EmptyRepo />}
      </div>
      <div className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center is-fullwidth has-footer-margin">
        {isMoreReposAvailable && (
          <button
            onClick={() => setPage(page + 1)}
            className="button has-background-gray-200 is-outlined has-text-black-900 has-text-weight-semibold is-size-6 has-text-primary"
            type="button"
          >View More
          </button>
        )}
      </div>
    </>
  )
};

export default ReposView;
