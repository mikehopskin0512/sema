import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { remove } from 'lodash';
import { useSelector } from 'react-redux';
import EmptyRepo from "../emptyRepo";
import RepoList from "../repoList";
import styles from './reposView.module.scss';
import RepoMissingBanner from '../../banners/repoMissing';

const NUM_PER_PAGE = 9;

const REPO_TYPES = {
  USER: 'user',
  ORGANIZATION: 'organization'
}

function ReposView({
  type = 'user',
  onSearchChange,
  searchQuery,
  withSearch,
  isLoaded
}) {
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
    (type === REPO_TYPES.ORGANIZATION && (!repos.other.length))

  useEffect(() => {
    if (githubUser && type === 'user') {
      const favoriteRepoIds = githubUser.repositories.filter((repo) => repo.isFavorite).map((repo) => repo.id);
      const repos = [...repositories];
      const favoriteRepos = remove(repos, (repo) => favoriteRepoIds.includes(repo.externalId));

      const pinnedRepos = repos.filter(repo => user?.pinnedRepos?.includes(repo._id.toString()));
      const otherRepos = repos.filter(repo => !user?.pinnedRepos?.includes(repo._id.toString()));
      setRepos({
        favorites: favoriteRepos,
        other: otherRepos,
        pinned: pinnedRepos,
      });
    }
  }, [repositories, user]);

  useEffect(() => {
    if (organizations && type === 'organization') {
      const {repos} = organizations;
      const pinnedRepos = repos.filter(repo => selectedOrganization?.organization?.pinnedRepos?.includes(repo._id.toString()));
      const otherRepos = repos.filter(repo => !selectedOrganization?.organization?.pinnedRepos?.includes(repo._id.toString()));
      setRepos({
        favorites: [],
        other: otherRepos,
        pinned: pinnedRepos,
      });
    }
  }, [organizations, selectedOrganization]);

  return ( !repositories.isFetching &&
    <>
    <div className={clsx('mt-40 mb-20', styles['repos-container'])}>
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
      {isMoreReposAvailable && <div className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center is-fullwidth has-footer-margin">
        <button
          onClick={() => setPage(page + 1)}
          className="button has-background-gray-200 is-outlined has-text-black-900 has-text-weight-semibold is-size-6 has-text-primary"
          type="button"
        >View More
        </button>
      </div>}
      <RepoMissingBanner />
    </>
  )
}

export default ReposView;
