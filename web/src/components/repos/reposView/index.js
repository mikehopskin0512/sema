import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { remove } from 'lodash';
import { useSelector } from 'react-redux';
import EmptyRepo from "../emptyRepo";
import RepoList from "../repoList";
import styles from './reposView.module.scss';

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
  const { githubUser, repositories, organizations } = useSelector((state) => ({
    githubUser: state.authState.user.identities?.[0],
    repositories: state.repositoriesState.data.repositories,
    organizations: state.organizationsNewState
  }));
  const [repos, setRepos] = useState({
    favorites: [],
    other: [],
  });
  const [page, setPage] = useState(1);
  const isMoreReposAvailable = repos.other.length > NUM_PER_PAGE && NUM_PER_PAGE * page < repos.other.length;
  const isEmptyRepo = (type === REPO_TYPES.USER && (!repositories.length && !repositories.isFetching)) ||
    (type === REPO_TYPES.ORGANIZATION && (!organizations.isFetching && !organizations.organizations.length))

  useEffect(() => {
    if (githubUser && type === 'user') {
      const favoriteRepoIds = githubUser.repositories.filter((repo) => repo.isFavorite).map((repo) => repo.id);
      const otherRepos = [...repositories];
      const favoriteRepos = remove(otherRepos, (repo) => favoriteRepoIds.includes(repo.externalId));
      setRepos({
        favorites: favoriteRepos,
        other: otherRepos
      });
    }
  }, [repositories]);

  useEffect(() => {
    if (organizations && type === 'organization') {
      const {repos} = organizations;
      setRepos({
        favorites: [],
        other: repos
      });
    }
  }, [organizations]);

  return ( !repositories.isFetching &&
    <>
      <div className={clsx('my-40', styles['repos-container'])}>
        {/* <RepoList type="FAVORITES" repos={repos.favorites} /> */}
        <RepoList
          type={type === 'organization' ? 'REPOS' : 'MY_REPOS'}
          repos={repos.other.slice(0, NUM_PER_PAGE * page)}
          search={searchQuery}
          onSearchChange={onSearchChange}
          withSearch={withSearch}
          isLoaded={isLoaded}
        />
        {isEmptyRepo && <EmptyRepo />}
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
}

export default ReposView;
