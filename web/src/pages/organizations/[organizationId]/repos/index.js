import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import { debounce } from 'lodash';
import { OrganizationReposHelmet } from '../../../../components/utils/Helmet';
import Loader from '../../../../components/Loader';
import ReposView from '../../../../components/repos/reposView';
import { ON_INPUT_DEBOUNCE_INTERVAL_MS } from '../../../../utils/constants';
import { organizationsOperations } from '../../../../state/features/organizations[new]';
import withLayout from '../../../../components/layout';
import Toaster from '../../../../components/toaster';
import useAuthEffect from '../../../../hooks/useAuthEffect';
import { repositoriesOperations } from '../../../../state/features/repositories';

const { fetchOrganizationRepos } = organizationsOperations;
const { fetchRepoDashboard } = repositoriesOperations;

const OrganizationRepository = () => {
  const dispatch = useDispatch();
  const {
    query: { organizationId },
  } = useRouter();

  const { alerts, auth, organizations, } = useSelector(
    (state) => ({
      alerts: state.alertsState,
      auth: state.authState,
      organizations: state.organizationsNewState,
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

  const fetchRepos = async (organizationId, token) => {
    await dispatch(fetchOrganizationRepos({ organizationId, searchParams: searchQuery }, token));
    toggleReposLoading(false);
  };

  useEffect(() => {
    fetchRepos(organizationId, token);
  }, [organizationId, token]);

  const onSearchChange = () => debounce((val) => {
    setSearchQuery(val);
  }, ON_INPUT_DEBOUNCE_INTERVAL_MS, { leading: true });

  useEffect(() => {
    if (!searchQuery.length) setSearchStarted(false);
    if (searchQuery.length > 1 || isSearchStarted) {
      if (!isSearchStarted) setSearchStarted(true);
      fetchRepos(organizationId, token);
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
        {organizations.isFetching || isReposLoading ? (
          <div className="is-flex is-align-items-center is-justify-content-center" style={{ height: '55vh' }}>
            <Loader />
          </div>
        ) : (
          <div>
            <Helmet {...OrganizationReposHelmet} />
            <ReposView type="organization" withSearch searchQuery={searchQuery} onSearchChange={onSearchChange()} />
          </div>
        )}
      </>
    </>
  )
}

export default withLayout(OrganizationRepository);
