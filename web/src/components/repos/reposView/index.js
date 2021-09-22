import React, { useEffect, useState } from 'react';
import EmptyRepo from '../../../components/repos/emptyRepo';
import RepoList from '../../../components/repos/repoList';
import { remove } from 'lodash';
import { useSelector } from 'react-redux';

const NUM_PER_PAGE = 9;

const ReposView = () => {
  const { githubUser, repositories } = useSelector((state) => ({
    githubUser: state.authState.user.identities?.[0],
    repositories: state.repositoriesState.data.repositories
  }));
  const [repos, setRepos] = useState({
    favorites: [],
    other: [],
  });
  const [page, setPage] = useState(1);
  const isMoreReposAvailable = repos.other.length > NUM_PER_PAGE && NUM_PER_PAGE * page < repos.other.length;

  const renderRepos = () => (
    <>
      <RepoList type="FAVORITES" repos={repos.favorites} />
      <RepoList type="MY_REPOS" repos={repos.other.slice(0, NUM_PER_PAGE * page)} />
    </>
  );

  useEffect(() => {
    if (githubUser) {
      const favoriteRepoIds = githubUser.repositories.filter((repo) => repo.isFavorite).map((repo) => repo.id);
      const otherRepos = [...repositories];
      const favoriteRepos = remove(otherRepos, (repo) => favoriteRepoIds.includes(repo.externalId));
      setRepos({
        favorites: favoriteRepos,
        other: otherRepos
      });
    }
  }, [repositories]);

  if (!repositories.length && !repositories.isFetching) {
    return <EmptyRepo />
  }

  return ( !repositories.isFetching &&
    <>
      <div className="py-30 px-80 is-hidden-mobile">
        {/* TODO: it renders twice and create 2 requests on server every time just because of mobile styles */}
        {renderRepos()}
      </div>
      <div className="p-25 is-hidden-desktop">
        {renderRepos()}
      </div>
      <div className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center is-fullwidth mb-80">
        {isMoreReposAvailable && (
          <button
            onClick={() => setPage(page + 1)}
            className="button has-background-gray-9 is-outlined has-text-black-2 has-text-weight-semibold is-size-6 has-text-primary"
            type="button"
          >View More
          </button>
        )}
      </div>
    </>
  )
};

export default ReposView;
