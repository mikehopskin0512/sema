import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _, { isEmpty } from 'lodash';
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
import { PATHS } from '../../utils/constants';

const { fetchRepoDashboard } = repositoriesOperations;
const { findCollectionsByAuthor } = collectionsOperations;
const { updateUser, updateUserHasExtension } = authOperations;
const { inviteTeamUser, fetchTeamsOfUser } = teamsOperations;

const Dashboard = () => {
  const router = useRouter();
  const { step, page = parseInt(step) } = router.query;

  const [teamIdInvitation, setTeamIdInvitation] = useLocalStorage('sema-team-invite', '');
  const [onboardingProgress, setOnboardingProgress] = useLocalStorage('sema-onboarding', {});
  const [semaCollections, setSemaCollections] = useState([]);
  const [collectionState, setCollection] = useState({ personalComments: true });
  const [isOnboardingModalActive, toggleOnboardingModalActive] = useState(false);
  const [isPluginInstalled, togglePluginInstalled] = useState(false);
  const [onboardingPage, setOnboardingPage] = useState(1);
  const [comment, setComment] = useState({});
  const dispatch = useDispatch();
  const { auth, repositories, rolesState } = useSelector((state) => ({
    auth: state.authState,
    repositories: state.repositoriesState.data.repositories,
    rolesState: state.rolesState
  }));
  const { token, user } = auth;
  const { identities, isOnboarded = null, hasExtension = null, username } = user;
  const { roles } = rolesState;
  const userRepos = identities?.length ? identities[0].repositories : [];
  const isLoaded = !userRepos.length || (userRepos.length && repositories.length);

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
    if (teamIdInvitation) {
      inviteToTeam();
    }
  };
  
  const inviteToTeam = async () => {
    const memberRole = roles.find((role) => role.name === 'Member')
    if (!isEmpty(memberRole)) {
      const teamId = teamIdInvitation;
      await dispatch(inviteTeamUser(teamId, token));
      await dispatch(fetchTeamsOfUser(token));
      setTeamIdInvitation('');
      router.push(`${PATHS.TEAMS._}/${teamId}${PATHS.SETTINGS}`);
    }
  }

  const toggleOnboardingModal = (status) => {
    if (status === false) {
      onboardUser();
    }
    toggleOnboardingModalActive(status);
  };

  useAuthEffect(() => {
    if (userRepos.length) {
      const externalIds = userRepos.map((repo) => repo.id);
      dispatch(fetchRepoDashboard(externalIds, token));
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
  if (auth.isFetching) {
    return <LoaderScreen />;
  }

  return (
    <>
      {!isLoaded ? (
        <LoaderScreen />
      ) : (
        <div>
          <Helmet {...DashboardHelmet} />
          <ReposView />
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
