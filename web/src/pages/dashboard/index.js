import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _, { debounce, isEmpty } from 'lodash';
import * as analytics from '../../utils/analytics';
import { repositoriesOperations } from '../../state/features/repositories';
import { collectionsOperations } from '../../state/features/collections';
import { authOperations } from '../../state/features/auth';
import { teamsOperations } from '../../state/features/teams';
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
const { inviteTeamUser, fetchTeamsOfUser } = teamsOperations;
const { setSelectedOrganization, setProfileViewMode } = authOperations;

const Dashboard = () => {
  const router = useRouter();
  const { step, page = parseInt(step) } = router.query;

  // TODO: should be disabled until new invitations logic
  // const [teamIdInvitation, setTeamIdInvitation] = useLocalStorage('sema-team-invite', '');
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
  const { auth, repositories, rolesState, teamsState } = useSelector((state) => ({
    auth: state.authState,
    repositories: state.repositoriesState,
    rolesState: state.rolesState,
    teamsState: state.teamsState
  }));
  const { token, user, selectedTeam } = auth;
  const { identities, isOnboarded = null, hasExtension = null, username } = user;
  const { roles } = rolesState;
  const { teams } = teamsState;
  const { inviteTeamId } = router.query;
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
    // if (teamIdInvitation) {
    //   inviteToTeam();
    // }
  };

  // TODO: should be disabled until new invitations logic
  // const inviteToTeam = async () => {
  //   const memberRole = roles.find((role) => role.name === 'Member')
  //   if (!isEmpty(memberRole)) {
  //     const teamId = teamIdInvitation;
  //     await dispatch(inviteTeamUser(teamId, token));
  //     await dispatch(fetchTeamsOfUser(token));
  //     setTeamIdInvitation('');
  //     router.push(`${PATHS.TEAMS._}/${teamId}${PATHS.SETTINGS}`);
  //   }
  // }

  if (redirectUser) {
    setRedirectUser(false);
    if (selectedTeam) {
      router.push(`${PATHS.TEAMS._}/${selectedTeam._id}${PATHS.DASHBOARD}`);
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
    if (inviteTeamId) {
      const invitedTeam = teams?.find(item => item.team?._id == inviteTeamId);
      if (invitedTeam) {
        dispatch(setSelectedOrganization(invitedTeam));
        dispatch(setProfileViewMode(PROFILE_VIEW_MODE.TEAM_VIEW));
        router.push(`${PATHS.TEAMS._}/${inviteTeamId}${PATHS.DASHBOARD}`);
      }
    }
  }, [inviteTeamId, user.roles, teams]);

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
    !inviteTeamId &&
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
