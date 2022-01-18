import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import { TeamReposHelmet } from '../../../../components/utils/Helmet';
import Loader from '../../../../components/Loader';
import ReposView from '../../../../components/repos/reposView';
import { teamsOperations } from '../../../../state/features/teams';
import withLayout from '../../../../components/layout';

const { fetchTeamRepos } = teamsOperations;

const TeamRepository = () => {
  const dispatch = useDispatch();
  const {
    query: { teamId },
  } = useRouter();

  const { auth, teams } = useSelector(
    (state) => ({
      auth: state.authState,
      teams: state.teamsState
    }),
  );
  const { token } = auth;
  const [isReposLoading, toggleReposLoading] = useState(true);

  const fetchRepos = async (teamId, token) => {
    await dispatch(fetchTeamRepos(teamId, token));
    toggleReposLoading(false);
  };

  useEffect(() => {
    fetchRepos(teamId, token);
  }, [teamId, token]);

  return (
    <>
      {teams.isFetching || isReposLoading ? (
        <div className="is-flex is-align-items-center is-justify-content-center" style={{ height: '55vh' }}>
          <Loader />
        </div>
      ) : (
        <div>
          <Helmet {...TeamReposHelmet} />
          <ReposView type='team' />
        </div>
      )}
    </>
  )
}

export default withLayout(TeamRepository);
