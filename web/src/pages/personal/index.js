import React, { useEffect, useState } from 'react';
import PersonalDashboard from '../../components/personalDashboard';
import withLayout from '../../components/layout';
import { useFlags } from '../../components/launchDarkly'
import { useSelector, useDispatch } from 'react-redux';
import { remove } from 'lodash';
import { repositoriesOperations } from '../../state/features/repositories';
import useAuthEffect from '../../hooks/useAuthEffect';
const { fetchRepoDashboard } = repositoriesOperations;
import { useRouter } from 'next/router';
import { PATHS } from '../../utils/constants';

const Personal = () => {
  const { personalDashboard } = useFlags();
  const dispatch = useDispatch();
  const router = useRouter();
  if(!personalDashboard) {
    router.push(PATHS.DASHBOARD)
  }

  const { githubUser, repositories, organizations, auth } = useSelector((state) => ({
    githubUser: state.authState.user.identities?.[0],
    repositories: state.repositoriesState.data.repositories,
    organizations: state.organizationsState,
    auth: state.authState,
  }));

  const { token, user } = auth;
  const [metrics, setMetrics] = useState([]);
  const [repos, setRepos] = useState({
    favorites: [],
    other: [],
  });
  const { identities } = user;
  const userRepos = identities?.length ? identities[0].repositories : [];

  useAuthEffect(() => {
    if (userRepos.length) {
      const externalIds = userRepos.map((repo) => repo.id);
      dispatch(fetchRepoDashboard({
        externalIds,
        searchQuery: '',
      }, token));
    }
  }, [userRepos]);

  const generateEmptyMetrics = () => {
    let tempMetrics = [];
    for (let i = 0; i < 20; i++) {
      tempMetrics = [...tempMetrics, {
        "comments": 0,
        "pullRequests": 0,
        "commenters": 0,
        "users": 0
      }];
    }
    return tempMetrics;
  }

  useEffect(() => {
    if (githubUser) {
      const favoriteRepoIds = githubUser.repositories.filter((repo) => repo.isFavorite).map((repo) => repo.id);
      const otherRepos = [...repositories];
      const favoriteRepos = remove(otherRepos, (repo) => favoriteRepoIds.includes(repo.externalId));
      setRepos({
        favorites: favoriteRepos,
        other: otherRepos
      });
      let tempMetrics = [];
      let totalMetrics = {
        smartCodeReviews: 0,
        smartComments: 0,
        smartCommenters: 0,
        semaUsers: 0
      }
      otherRepos.forEach(repo => {
        tempMetrics = [...tempMetrics, ...repo.metrics];
        totalMetrics.smartCodeReviews += repo.repoStats.smartCodeReviews;
        totalMetrics.smartComments += repo.repoStats.smartComments;
        totalMetrics.smartCommenters += repo.repoStats.smartCommenters;
        totalMetrics.semaUsers += repo.repoStats.semaUsers;
      })
      setMetrics({ metrics: tempMetrics.length > 0 ? tempMetrics : generateEmptyMetrics(), totalMetrics })
    }
  }, [repositories]);

  return (
    <>
      {personalDashboard && <div className="sema-wide-container">
        <PersonalDashboard metrics={metrics} repos={repos} />
      </div>}
    </>
  );
};

export default withLayout(Personal);
