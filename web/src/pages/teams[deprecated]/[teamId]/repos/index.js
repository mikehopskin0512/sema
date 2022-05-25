import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import { debounce } from 'lodash';
import { TeamReposHelmet } from '../../../../components/utils/Helmet';
import Loader from '../../../../components/Loader';
import ReposView from '../../../../components/repos/reposView';
import { ON_INPUT_DEBOUNCE_INTERVAL_MS } from '../../../../utils/constants';
import { organizationsOperations } from '../../../../state/features/teams';
import withLayout from '../../../../components/layout';
import Toaster from '../../../../components/toaster';
import useAuthEffect from '../../../../hooks/useAuthEffect';
import { repositoriesOperations } from '../../../../state/features/repositories';

const { fetchTeamRepos } = organizationsOperations;
const { fetchRepoDashboard } = repositoriesOperations;

const TeamRepository = () => {
  const dispatch = useDispatch();
  const {
    query: { teamId },
  } = useRouter();

  const { alerts, auth, teams, } = useSelector(
    (state) => ({
      alerts: state.alertsState,
      auth: state.authState,
      teams: state.teamsState,
    }),
  );

  const { token, user } = auth;
  const { identities } = user;

  const userRepos = identities?.length ? identities[0].repositories : [];
  const { showAlert, alertType, alertLabel } = alerts;

  const memoizedToaster = useMemo(() => {
    return <Toaster type={alertType} message={alertLabel} showAlert={showAlert} />
  }, [alertType]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchStarted, setSearchStarted] = useState(false);
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

  useAuthEffect(() => {
    if (userRepos.length) {
      const externalIds = userRepos.map((repo) => repo.id);
      dispatch(fetchRepoDashboard({
        externalIds,
        searchQuery,
      }, token));
    }
  }, [userRepos]);

  return (
    <>
      {memoizedToaster}
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
    </>
  )
}

export default withLayout(TeamRepository);
