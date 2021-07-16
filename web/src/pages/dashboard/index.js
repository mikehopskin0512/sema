import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { remove } from 'lodash';
import withLayout from '../../components/layout';
import RepoList from '../../components/repos/repoList';
// import { repositoriesOperations } from '../../state/features/repositories';

import { repositories } from './data';

// const { filterSemaRepositories } = repositoriesOperations;

// UNCOMMENT API CALLS WHEN API IS FIXED

const Dashboard = () => {
  const [repos, setRepos] = useState({
    favorites: [],
    other: [],
  });

  // const dispatch = useDispatch();
  const { auth } = useSelector((state) => ({
    auth: state.authState,
    repositories: state.repositoriesState,
  }));
  // const { token } = auth;

  // const getUserRepos = (user) => {
  //   const { identities } = user;
  //   if (identities && identities.length) {
  //     const githubUser = identities[0];
  //     const externalIds = githubUser.repositories.map((repo) => repo.id);
  //     dispatch(filterSemaRepositories(externalIds, token));
  //   }
  // };

  // useEffect(() => {
  //   // getUserRepos(auth.user);
  // }, [auth, getUserRepos]);

  useEffect(() => {
    const { user: { identities } } = auth;
    if (identities && identities.length) {
      const githubUser = identities[0];
      const favoriteRepoIds = githubUser.repositories.filter((repo) => repo.isFavorite).map((repo) => repo.id);
      const otherRepos = [...repositories];
      const favoriteRepos = remove(otherRepos, (repo) => favoriteRepoIds.includes(repo.externalId));
      setRepos({
        favorites: favoriteRepos,
        other: otherRepos,
      });
    }
  }, [auth]);

  const renderRepos = () => (
    <>
      <RepoList type="FAVORITES" repos={repos.favorites} />
      <RepoList type="OTHERS" repos={repos.other} />
    </>
  );

  return (
    <div className="has-background-gray-9 ">
      <div className="py-30 px-80 is-hidden-mobile">
        {renderRepos()}
      </div>
      <div className="p-25 is-hidden-desktop">
        {renderRepos()}
      </div>
      <div className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center is-fullwidth mb-80">
        <button className="button has-background-gray-9 is-outlined has-text-black-2 has-text-weight-semibold is-size-6" type="button">View More</button>
        <p className="has-text-weight-semibold has-text-gray-dark mt-25">30 other repos with no smart comments yet</p>
      </div>
    </div>
  );
};

export default withLayout(Dashboard);
