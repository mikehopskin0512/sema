import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import * as analytics from '../../utils/analytics';
import { repositoriesOperations } from '../../state/features/repositories';
import { collectionsOperations } from '../../state/features/collections';
import { authOperations } from '../../state/features/auth';
import useLocalStorage from '../../hooks/useLocalStorage';
import withLayout from '../../components/layout';
import Helmet, { DashboardHelmet } from '../../components/utils/Helmet';
import OnboardingModal from '../../components/onboarding/onboardingModal';
import ReposView from '../../components/repos/reposView';
import Loader from '../../components/Loader';
import useAuthEffect from '../../hooks/useAuthEffect';
import { isExtensionInstalled } from '../../utils/extension';

const { fetchRepoDashboard } = repositoriesOperations;
const { findCollectionsByAuthor } = collectionsOperations;
const { updateUser } = authOperations;

const Dashboard = () => {
  const router = useRouter();
  const { step, page = parseInt(step) } = router.query;

  const [onboardingProgress, setOnboardingProgress] = useLocalStorage('sema-onboarding', {});
  const [semaCollections, setSemaCollections] = useState([]);
  const [collectionState, setCollection] = useState({ personalComments: true });
  const [isOnboardingModalActive, toggleOnboardingModalActive] = useState(false);
  const [isPluginInstalled, togglePluginInstalled] = useState(false);
  const [onboardingPage, setOnboardingPage] = useState(1);
  const [comment, setComment] = useState({});
  const dispatch = useDispatch();
  const { auth, repositories } = useSelector((state) => ({
    auth: state.authState,
    repositories: state.repositoriesState,
  }));
  const isUserReposLoaded = repositories.data.repositories.length;
  const { token, user } = auth;
  const { identities, isOnboarded = null } = user;

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

  const onboardUser = () => {
    const updatedUser = { ...user, ...{ isOnboarded: new Date() } };
    setOnboardingProgress({});
    dispatch(updateUser(updatedUser, token));
  };

  const toggleOnboardingModal = (status) => {
    if (status === false) {
      onboardUser();
    }
    toggleOnboardingModalActive(status);
  };

  useAuthEffect(() => {
    const userRepos = identities.length ? identities[0].repositories : [];
    if (userRepos.length) {
      const externalIds = userRepos.map((repo) => repo.id);
      dispatch(fetchRepoDashboard(externalIds, token));
    }
  }, [auth]);

  useEffect(() => {
    (async () => {
      const result = await isExtensionInstalled();
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
      {repositories.isFetching && !isUserReposLoaded ? (
        <LoaderScreen />
      ) : (
        <div>
          <Helmet {...DashboardHelmet} />
          <ReposView />
        </div>
      )}
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
