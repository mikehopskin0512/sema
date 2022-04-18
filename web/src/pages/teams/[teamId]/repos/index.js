import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import { debounce } from 'lodash';
import { TeamReposHelmet } from '../../../../components/utils/Helmet';
import Loader from '../../../../components/Loader';
import ReposView from '../../../../components/repos/reposView';
import { ON_INPUT_DEBOUNCE_INTERVAL_MS } from '../../../../utils/constants';
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
      teams: state.teamsState,
    }),
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchStarted, setSearchStarted] = useState(false);
  const { token } = auth;
  const [isReposLoading, toggleReposLoading] = useState(true);

  const fetchRepos = async (teamId, token) => {
    await dispatch(fetchTeamRepos({ teamId, searchParams: searchQuery }, token));
    toggleReposLoading(false);
  };

  useEffect(() => {
    fetchRepos(teamId, token);
  }, [teamId, token]);

  const onSearchChange = () => debounce((val) => {
    setSearchQuery(val);
  }, ON_INPUT_DEBOUNCE_INTERVAL_MS, { leading: true });

  useEffect(() => {
    if (!searchQuery.length) setSearchStarted(false);
    if (searchQuery.length > 1 || isSearchStarted) {
      if (!isSearchStarted) setSearchStarted(true);
      fetchRepos(teamId, token);
    }
  }, [searchQuery])

  return (
    <>
      {teams.isFetching || isReposLoading ? (
        <div className="is-flex is-align-items-center is-justify-content-center" style={{ height: '55vh' }}>
          <Loader />
        </div>
      ) : (
        <div>
          <Helmet {...TeamReposHelmet} />
          <ReposView type="team" withSearch searchQuery={searchQuery} onSearchChange={onSearchChange()} />
        </div>
      )}
    </>
  )
}

export default withLayout(TeamRepository);
