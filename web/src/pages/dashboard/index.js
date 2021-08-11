import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { remove } from 'lodash';
import withLayout from '../../components/layout';
import RepoList from '../../components/repos/repoList';
import Helmet, { DashboardHelmet } from '../../components/utils/Helmet';
import { repositoriesOperations } from '../../state/features/repositories';
import { collectionsOperations } from '../../state/features/collections';
import { suggestCommentsOperations } from '../../state/features/suggest-comments';
import { authOperations } from '../../state/features/auth';
import OnboardingModal from '../../components/onboarding/onboardingModal';
import EmptyRepo from '../../components/repos/emptyRepo';

const { filterSemaRepositories } = repositoriesOperations;
const { findCollectionsByAuthor, createCollections } = collectionsOperations;
const { createSuggestComment } = suggestCommentsOperations;
const { updateUser } = authOperations;

const NUM_PER_PAGE = 9;

const Dashboard = () => {
  const [repos, setRepos] = useState({
    favorites: [],
    other: [],
  });
  const [page, setPage] = useState(1);
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
  const { data: { repositories: repoArray } } = repositories;

  const nextOnboardingPage = (currentPage) => {
    setOnboardingPage(currentPage + 1);
  };

  const previousOnboardingPage = (currentPage) => {
    setOnboardingPage(currentPage - 1);
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
      dispatch(filterSemaRepositories(externalIds, token));
    }
  }, [dispatch, token]);

  useEffect(() => {
    getUserRepos();
  }, [auth, getUserRepos]);

  useEffect(() => {
    getCollectionsByAuthor('sema');
  }, []);

  useEffect(() => {
    if (identities && identities.length) {
      const githubUser = identities[0];
      const favoriteRepoIds = githubUser.repositories.filter((repo) => repo.isFavorite).map((repo) => repo.id);
      const otherRepos = [...repoArray];
      const favoriteRepos = remove(otherRepos, (repo) => favoriteRepoIds.includes(repo.externalId));
      setRepos({
        favorites: favoriteRepos,
        other: otherRepos,
      });
    }
  }, [auth, repositories]);

  const getCollectionsByAuthor = async (author) => {
    const defaultCollections = await dispatch(findCollectionsByAuthor(author, token));
    setSemaCollections(defaultCollections);
  };

  const createUserCollection = async () => {
    const { username } = identities[0];
    const userCollection = {
      name: 'My Comments',
      description: 'Have a code review comment you frequently reuse? Add it here and it will be ready for your next review.',
      author: username,
      isActive: collectionState.personalComments,
      comments: [],
    }
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
    for (const [key, val] of Object.entries(collectionState)) {
      if (key === 'personalComments') {
        const [userCollection] = await createUserCollection();
        if (userCollection._id) {
          userCollections.push({ collectionData: userCollection._id, isActive: val })
        }
      } else {
        userCollections.push({ collectionData: key, isActive: val })
      }
    }
    return userCollections;
  };

  const onboardingOnSubmit = async () => {
    const userCollections = await getActiveCollections();
    const updatedUser = { ...user, collections: [...userCollections] }
    dispatch(updateUser(updatedUser, token));
  };

  useEffect(() => {
    if (user?.collections?.length === 0) {
      toggleOnboardingModalActive(true);
    }
  }, [user]);

  const viewMore = () => {
    setPage(page + 1);
  }

  const renderRepos = () => (
    <>
      <RepoList type="FAVORITES" repos={repos.favorites || []} />
      <RepoList type="OTHERS" repos={repos.other.slice(0, NUM_PER_PAGE * page) || []} />
    </>
  );

  return (
    <>
      <div className="has-background-gray-9 pb-180">
        <Helmet {...DashboardHelmet} />
        {
          repos.favorites.length === 0 && repos.other.length === 0 ? (
            <EmptyRepo />
          ) : (
            <>
              <div className="py-30 px-80 is-hidden-mobile">
                {renderRepos()}
              </div>
              <div className="p-25 is-hidden-desktop">
                {renderRepos()}
              </div>
              <div className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center is-fullwidth mb-80">
                {repos.other.length > NUM_PER_PAGE && NUM_PER_PAGE * page < repos.other.length && (
                  <button onClick={viewMore} className="button has-background-gray-9 is-outlined has-text-black-2 has-text-weight-semibold is-size-6" type="button">View More</button>
                )}
              </div>
            </>
          )
        }
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
