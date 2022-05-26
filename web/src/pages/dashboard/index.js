import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _, { debounce, isEmpty } from 'lodash';
import * as analytics from '../../utils/analytics';
import { repositoriesOperations } from '../../state/features/repositories';
import { collectionsOperations } from '../../state/features/collections';
import { authOperations } from '../../state/features/auth';
import { organizationsOperations } from '../../state/features/organizations[new]';
import useLocalStorage from '../../hooks/useLocalStorage';
import withLayout from '../../components/layout';
import Helmet, { DashboardHelmet } from '../../components/utils/Helmet';
import OnboardingModal from '../../components/onboarding/onboardingModal';
import ReposView from '../../components/repos/reposView';

import Loader from '../../components/Loader';
import useAuthEffect from '../../hooks/useAuthEffect';
import { isExtensionInstalled } from '../../utils/extension';
import { ON_INPUT_DEBOUNCE_INTERVAL_MS, PATHS, PROFILE_VIEW_MODE } from '../../utils/constants';

const { fetchRepoDashboard } = repositoriesOperations;
const { findCollectionsByAuthor } = collectionsOperations;
const { updateUser, updateUserHasExtension } = authOperations;
const { inviteOrganizationUser, fetchOrganizationsOfUser } = organizationsOperations;
const { setSelectedOrganization, setProfileViewMode } = authOperations;

const Dashboard = () => {
  const router = useRouter();
  const { step, page = parseInt(step) } = router.query;

  // TODO: should be disabled until new invitations logic
  // const [organizationIdInvitation, setOrganizationIdInvitation] = useLocalStorage('sema-organization-invite', '');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchStarted, setSearchStarted] = useState(false);
  const [onboardingProgress, setOnboardingProgress] = useLocalStorage('sema-onboarding', {});
  const [semaCollections, setSemaCollections] = useState([]);
  const [collectionState, setCollection] = useState({ personalComments: true });
  const [isOnboardingModalActive, toggleOnboardingModalActive] = useState(false);
  const [isPluginInstalled, togglePluginInstalled] = useState(false);
  const [onboardingPage, setOnboardingPage] = useState(1);
  const [comment, setComment] = useState({});
  const [redirectUser, setRedirectUser] = useLocalStorage('redirect_user', false);
  const dispatch = useDispatch();
  const { auth, repositories, rolesState, organizationsState } = useSelector((state) => ({
    auth: state.authState,
    repositories: state.repositoriesState,
    rolesState: state.rolesState,
    organizationsState: state.organizationsNewState
  }));
  const { token, user, selectedOrganization } = auth;
  const { identities, isOnboarded = null, hasExtension = null, username } = user;
  const { roles } = rolesState;
  const { organizations: organizations } = organizationsState;
  const { inviteOrganizationId } = router.query;
  const userRepos = identities?.length ? identities[0].repositories : [];
  // Now we should show the UI in cases when we receive an empty arrays
  const isLoaded = !userRepos || (userRepos && repositories.data.repositories);

  const logOnboardingAcitvity = (page) => {
    analytics.fireAmplitudeEvent(analytics.AMPLITUDE_EVENTS.VIEWED_ONBOARDING_WIZARD, { url: `/onboardingModal/page=${page}` });
  };

  if (page && typeof page === 'number') {
    logOnboardingAcitvity(page);
  }

  const nextOnboardingPage = (currentPage) => {
    const newPage = currentPage + 1;
    setOnboardingPage(newPage);
    setOnboardingProgress({ ...onboardingProgress, page: newPage });
    logOnboardingAcitvity(newPage);
  };

  const previousOnboardingPage = (currentPage) => {
    const newPage = currentPage - 1;
    setOnboardingPage(newPage);
    setOnboardingProgress({ ...onboardingProgress, page: newPage });
    logOnboardingAcitvity(newPage);
  };

  const toggleCollection = (field) => {
    const newCollection = { ...collectionState };
    newCollection[field] = !newCollection[field];
    setCollection(newCollection);
  };

  const handleCommentFields = (e) => {
    setComment({ ...comment, [e.target.name]: e.target.value });
  };

  const onboardUser = async () => {
    const updatedUser = { ...user, ...{ isOnboarded: new Date() } };
    setOnboardingProgress({});
    dispatch(updateUser(updatedUser, token));
    // TODO: should be disabled until new invitations logic
    // if (organizationIdInvitation) {
    //   inviteToOrganization();
    // }
  };

  // TODO: should be disabled until new invitations logic
  // const inviteToOrganization = async () => {
  //   const memberRole = roles.find((role) => role.name === 'Member')
  //   if (!isEmpty(memberRole)) {
  //     const organizationId = organizationIdInvitation;
  //     await dispatch(inviteOrganizationUser(organizationId, token));
  //     await dispatch(fetchOrganizationsOfUser(token));
  //     setOrganizationIdInvitation('');
  //     router.push(`${PATHS.ORGANIZATIONS._}/${organizationId}${PATHS.SETTINGS}`);
  //   }
  // }

  if (redirectUser) {
    setRedirectUser(false);
    if (selectedOrganization) {
      router.push(`${PATHS.ORGANIZATIONS._}/${selectedOrganization._id}${PATHS.DASHBOARD}`);
    } else {
      router.push(PATHS.DASHBOARD);
    }
  }

  const toggleOnboardingModal = (status) => {
    if (status === false) {
      onboardUser();
    }
    toggleOnboardingModalActive(status);
  };

  useEffect(() => {
    if (inviteOrganizationId) {
      const invitedOrganization = organizations?.find(item => item.organization?._id == inviteOrganizationId);
      if (invitedOrganization) {
        dispatch(setSelectedOrganization(invitedOrganization));
        dispatch(setProfileViewMode(PROFILE_VIEW_MODE.ORGANIZATION_VIEW));
        router.push(`${PATHS.ORGANIZATIONS._}/${inviteOrganizationId}${PATHS.DASHBOARD}`);
      }
    }
  }, [inviteOrganizationId, user.roles, organizations]);

  useAuthEffect(() => {
    if (userRepos.length) {
      const externalIds = userRepos.map((repo) => repo.id);
      dispatch(fetchRepoDashboard({
        externalIds,
        searchQuery,
      }, token));
    }
  }, [userRepos]);

  useEffect(() => {
    (async () => {
      const result = await isExtensionInstalled();
      if (hasExtension !== result) {
        const updatedUser = { ...user, ...{ hasExtension: result } };
        dispatch(updateUserHasExtension(updatedUser, token));
      }
      togglePluginInstalled(result);
    })();
    getCollectionsByAuthor('sema');
  }, []);

  const onSearchChange = () => debounce((val) => {
    setSearchQuery(val);
  }, ON_INPUT_DEBOUNCE_INTERVAL_MS, { leading: true });

  useEffect(() => {
    if (!searchQuery.length) setSearchStarted(false);
    if (searchQuery.length > 1 || isSearchStarted) {
      if (!isSearchStarted) setSearchStarted(true);
      if (userRepos.length) {
        const externalIds = userRepos.map((repo) => repo.id);
        dispatch(fetchRepoDashboard({
          externalIds,
          searchQuery,
        }, token));
      }
    }
  }, [searchQuery])


  const getCollectionsByAuthor = async (author) => {
    const defaultCollections = await dispatch(findCollectionsByAuthor(author, token));
    setSemaCollections(defaultCollections);
  };

  useEffect(() => {
    if (!_.isEmpty(onboardingProgress)) {
      setOnboardingPage(onboardingProgress.page || 1);
    }
  }, [onboardingProgress]);

  useEffect(() => {
    if (page && typeof page === 'number') {
      if (!isOnboarded) {
        setOnboardingPage(page);
        setOnboardingProgress({ ...onboardingProgress, page });
        toggleOnboardingModalActive(true);
      }
    }
  }, [page]);
  useEffect(() => {
    if (!_.isEmpty(user) && isOnboarded === null) {
      toggleOnboardingModalActive(true);
    }
  }, [isOnboarded]);

  const LoaderScreen = () => (
    <div className="is-flex is-align-items-center is-justify-content-center" style={{ height: '55vh' }}>
      <Loader />
    </div>
  );

  if (auth.isFetching || repositories.isFetching) {
    return <LoaderScreen />;
  }

  return (
    !inviteOrganizationId &&
    <>
      {!isLoaded ? (
        <LoaderScreen />
      ) : (
        <div>
          <Helmet {...DashboardHelmet} />
          <ReposView searchQuery={searchQuery} onSearchChange={onSearchChange()} withSearch />
        </div>
      )}
      {/* TODO: we have to put almost all the props to modal  */}
      <OnboardingModal
        isModalActive={isOnboardingModalActive}
        toggleModalActive={toggleOnboardingModal}
        page={onboardingPage}
        nextPage={nextOnboardingPage}
        previousPage={previousOnboardingPage}
        collectionState={collectionState}
        setCollection={setCollection}
        toggleCollection={toggleCollection}
        handleCommentFields={handleCommentFields}
        comment={comment}
        setComment={setComment}
        semaCollections={semaCollections}
        onSubmit={onboardUser}
        isPluginInstalled={isPluginInstalled}
      />
    </>
  );
};

export default withLayout(Dashboard);
