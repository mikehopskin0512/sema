import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import clsx from 'clsx';
import * as analytics from '../../utils/analytics';
import { repositoriesOperations } from '../../state/features/repositories';
import { collectionsOperations } from '../../state/features/collections';
import { authOperations } from '../../state/features/auth';
import useLocalStorage from '../../hooks/useLocalStorage';
import withLayout from '../../components/layout';
import Helmet, { DashboardHelmet } from '../../components/utils/Helmet';
import { suggestCommentsOperations } from '../../state/features/suggest-snippets';
import OnboardingModal from '../../components/onboarding/onboardingModal';
import ReposView from '../../components/repos/reposView';
import Loader from '../../components/Loader';
import styles from './dashboard.module.scss';
import useAuthEffect from '../../hooks/useAuthEffect';
import { isExtensionInstalled } from '../../utils/extension';

const { fetchRepoDashboard } = repositoriesOperations;
const { findCollectionsByAuthor, createCollections } = collectionsOperations;
const { createSuggestComment } = suggestCommentsOperations;
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
  const [isUserReposLoaded, setUserReposLoaded] = useState(false)
  const { auth, repositories } = useSelector((state) => ({
    auth: state.authState,
    repositories: state.repositoriesState,
  }));
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
    toggleOnboardingModalActive(status)
  }

  const getUserRepos = useCallback(async () => {
    if (identities && identities.length) {
      const githubUser = identities[0];
      const externalIds = githubUser?.repositories?.map((repo) => repo.id);
      await dispatch(fetchRepoDashboard(externalIds, token));
      setUserReposLoaded(true)
    }
  }, [dispatch, token]);

  useAuthEffect(() => {
    getUserRepos();
  }, [auth, getUserRepos]);

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

  const createUserCollection = async () => {
    const { username } = identities[0];
    const userCollection = {
      name: 'My Snippets',
      description: 'Have a code review comment you frequently reuse? Add it here and it will be ready for your next review.',
      author: username,
      // isActive: collectionState.personalComments,
      isActive: true,
      comments: [],
    };
    if (collectionState.personalComments) {
      if (!_.isEmpty(comment)) {
        const suggestedComment = await dispatch(createSuggestComment({ ...comment }, token));
        userCollection.comments.push(suggestedComment._id);
      }
    }
    const personalCollection = await dispatch(createCollections({ collections: [userCollection] }, token));
    return personalCollection;
  };

  const getActiveCollections = async () => {
    const userCollections = [];
    const defaultSemaCollections = ['Philosophies', 'Famous Quotes'];
    const activeSemaCollectionIds = semaCollections.filter((s) => defaultSemaCollections.includes(s.name)).map((s) => s._id);
    for (const [key, val] of Object.entries(collectionState)) {
      if (key === 'personalComments') {
        const [userCollection] = await createUserCollection();
        if (userCollection._id) {
          userCollections.push({ collectionData: userCollection._id, isActive: val });
        }
      } else if (activeSemaCollectionIds.includes(key)) {
        userCollections.push({ collectionData: key, isActive: true })
      } else {
        userCollections.push({ collectionData: key, isActive: false })
      }
    }
    return userCollections;
  };

  const onboardingOnSubmit = async () => {
    /* TODO: Code clean up for the getActiveCollections since it was moved to the user model on save */
    // const userCollections = await getActiveCollections();
    onboardUser();
  };

  useEffect(() => {
    if (!_.isEmpty(user) && isOnboarded === null) {
      toggleOnboardingModalActive(true);
    }
  }, [isOnboarded]);

  if (repositories.isFetching || auth.isFetching) {
    return (
      <div className="is-flex is-align-items-center is-justify-content-center" style={{ height: '55vh' }}>
        <Loader />
      </div>
    )
  }

  return (
    <>
      {repositories.isFetching || !isUserReposLoaded ? (
        <div className="is-flex is-align-items-center is-justify-content-center" style={{ height: '55vh' }}>
          <Loader/>
        </div>
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
        onSubmit={onboardingOnSubmit}
        isPluginInstalled={isPluginInstalled}
      />
    </>
  );
};

export default withLayout(Dashboard);
