import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import { repositoriesOperations } from '../../state/features/repositories';
import { collectionsOperations } from '../../state/features/collections';
import { authOperations } from '../../state/features/auth';
import useLocalStorage from '../../hooks/useLocalStorage';
import withLayout from '../../components/layout';
import Helmet, { DashboardHelmet } from '../../components/utils/Helmet';
import { suggestCommentsOperations } from '../../state/features/suggest-comments';
import OnboardingModal from '../../components/onboarding/onboardingModal';
import ReposView from '../../components/repos/reposView';
import Loader from '../../components/Loader';

const { fetchRepoDashboard } = repositoriesOperations;
const { findCollectionsByAuthor, createCollections } = collectionsOperations;
const { createSuggestComment } = suggestCommentsOperations;
const { updateUser } = authOperations;

const Dashboard = () => {
  const [onboardingProgress, setOnboardingProgress] = useLocalStorage('sema-onboarding', {});
  const [semaCollections, setSemaCollections] = useState([]);
  const [collectionState, setCollection] = useState({ personalComments: true });
  const [isOnboardingModalActive, toggleOnboardingModalActive] = useState(false);
  const [onboardingPage, setOnboardingPage] = useState(1);
  const [comment, setComment] = useState({});
  const dispatch = useDispatch();
  const { auth, repositories } = useSelector((state) => ({
    auth: state.authState,
    repositories: state.repositoriesState,
  }));
  const { token, user } = auth;
  const { identities } = user;

  const nextOnboardingPage = (currentPage) => {
    setOnboardingPage(currentPage + 1);
    setOnboardingProgress({...onboardingProgress, page: currentPage + 1});
  };

  const previousOnboardingPage = (currentPage) => {
    setOnboardingPage(currentPage - 1);
    setOnboardingProgress({...onboardingProgress, page: currentPage -1});
  };

  const toggleCollection = (field) => {
    const newCollection = { ...collectionState };
    newCollection[field] = !newCollection[field];
    setCollection(newCollection);
  };

  const handleCommentFields = (e) => {
    setComment({ ...comment, [e.target.name]: e.target.value });
  };

  const getUserRepos = useCallback(() => {
    if (identities && identities.length) {
      const githubUser = identities[0];
      const externalIds = githubUser?.repositories?.map((repo) => repo.id);
      dispatch(fetchRepoDashboard(externalIds, token));
    }
  }, [dispatch, token]);

  useEffect(() => {
    getUserRepos();
  }, [auth, getUserRepos]);

  useEffect(() => {
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

  const createUserCollection = async () => {
    const { username } = identities[0];
    const userCollection = {
      name: 'My Comments',
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
    const userCollections = await getActiveCollections();
    const updatedUser = { ...user, collections: [...userCollections] };
    setOnboardingProgress({});
    dispatch(updateUser(updatedUser, token));
  };

  useEffect(() => {
    if (user?.collections?.length === 0) {
      toggleOnboardingModalActive(true);
    }
  }, [user]);

  return (
    <>
      <div className='has-background-gray-9 pb-180'>
        <Helmet {...DashboardHelmet} />
        {repositories.isFetching || auth.isFetching ? (
          <div style={{ height: '400px', display: 'flex' }}>
            <Loader/>
          </div>
        ) : (
          <ReposView />
        )}
      </div>
      <OnboardingModal
        isModalActive={isOnboardingModalActive}
        toggleModalActive={toggleOnboardingModalActive}
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
      />
    </>
  );
};

export default withLayout(Dashboard);
