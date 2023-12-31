import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { Helmet } from 'react-helmet';
import OrganizationDashboard from '../../../../components/organization/organizationDashboard';
import withLayout from '../../../../components/layout';
import { OrganizationDashboardHelmet } from '../../../../components/utils/Helmet';
import { PATHS, SEMA_FAQ_SLUGS, SEMA_INTERCOM_FAQ_URL } from '../../../../utils/constants';
import styles from './dashboard.module.scss';
import { organizationsOperations } from '../../../../state/features/organizations[new]';
import withSelectedOrganization from '../../../../components/auth/withSelectedOrganization';
import OnboardingModal from '../../../../components/onboarding/onboardingModal';
import useLocalStorage from '../../../../hooks/useLocalStorage';
import { authOperations } from '../../../../state/features/auth';
import _, { isEmpty } from 'lodash';
import * as analytics from '../../../../utils/analytics';
import { isExtensionInstalled } from '../../../../utils/extension';
import { collectionsOperations } from '../../../../state/features/collections';

const { fetchOrganizationMembers, fetchOrganizationMetrics, fetchOrganizationRepos } = organizationsOperations;
const { updateUser } = authOperations;
const { inviteOrganizationUser, fetchOrganizationsOfUser } = organizationsOperations;
const { findCollectionsByAuthor } = collectionsOperations;

const Dashboard = () => {
  const router = useRouter();
  const { step, page = parseInt(step) } = router.query;
  const [organizationIdInvitation, setOrganizationsIdInvitation] = useLocalStorage('sema-organization-invite', '');
  const [onboardingProgress, setOnboardingProgress] = useLocalStorage('sema-onboarding', {});
  const [isOnboardingModalActive, toggleOnboardingModalActive] = useState(false);
  const [onboardingPage, setOnboardingPage] = useState(1);
  const [collectionState, setCollection] = useState({ personalComments: true });
  const [comment, setComment] = useState({});
  const [semaCollections, setSemaCollections] = useState([]);
  const [isPluginInstalled, togglePluginInstalled] = useState(false);

  const logOnboardingAcitvity = (activityPage) => {
    analytics.fireAmplitudeEvent(analytics.AMPLITUDE_EVENTS.VIEWED_ONBOARDING_WIZARD, { url: `/onboardingModal/page=${activityPage}` });
  };

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

  const dispatch = useDispatch();
  const {
    push,
    query: { organizationId },
  } = useRouter();
  const { auth, organizations, rolesState } = useSelector(
    (state) => ({
      auth: state.authState,
      organizations: state.organizationsNewState,
      rolesState: state.rolesState,
    }),
  );
  const { token, user } = auth;
  const { roles } = rolesState;
  const { isOnboarded = null } = user;

  useEffect(() => {
    dispatch(fetchOrganizationMembers(organizationId, { page: 1, perPage: 6 }, token));
    dispatch(fetchOrganizationMetrics(organizationId, token));
    dispatch(fetchOrganizationRepos({ organizationId }, token));
  }, [dispatch, organizationId, token]);

  const inviteToOrganization = async () => {
    const memberRole = roles.find((role) => role.name === 'Member')
    if (!isEmpty(memberRole)) {
      await dispatch(inviteOrganizationUser(organizationId, token));
      await dispatch(fetchOrganizationsOfUser(token));
      setOrganizationsIdInvitation('');
      router.push(`${PATHS.ORGANIZATIONS._}/${organizationId}${PATHS.SETTINGS}`);
    }
  }

  const onboardUser = async () => {
    const updatedUser = { ...user, ...{ isOnboarded: new Date() } };
    setOnboardingProgress({});
    dispatch(updateUser(updatedUser, token));
    if (organizationIdInvitation) {
      inviteToOrganization();
    }
  };

  const toggleOnboardingModal = (status) => {
    if (status === false) {
      onboardUser();
    }
    toggleOnboardingModalActive(status);
  };

  const getCollectionsByAuthor = async (author) => {
    const defaultCollections = await dispatch(findCollectionsByAuthor(author, token));
    setSemaCollections(defaultCollections);
  };

  useEffect(() => {
    (async () => {
      const result = await isExtensionInstalled();
      togglePluginInstalled(result);
    })();
    getCollectionsByAuthor('sema');
  }, []);

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

  return (
    <>
      <Helmet title={OrganizationDashboardHelmet.title} />
      <div className="sema-wide-container">
        <OrganizationDashboard organization={organizations} selectedOrganization={auth.selectedOrganization} />
        <div className="is-flex is-align-items-center is-justify-content-space-between py-40 px-35 mb-50 has-background-blue-50">
          <div>
            <p className="is-size-4 has-text-weight-semibold">
              Encourage consistent best practices amongst your organization
            </p>
            <p className="is-size-6">
              Be sure to review and update your snippets library. &nbsp;
              <a
                target="_blank"
                rel="noreferrer"
                className="is-text"
                href={`${SEMA_INTERCOM_FAQ_URL}/${SEMA_FAQ_SLUGS.LEARN_MORE_ABOUT_SNIPPETS}`}
              >
                Tell me more.
              </a>
            </p>
          </div>
          <div className="has-background-white">
            <button
              type="button"
              onClick={() => push(PATHS.SNIPPETS._)}
              className={clsx('button p-25 is-primary is-outlined is-medium', styles.button)}
            >
              Update Your Organization Snippets
            </button>
          </div>
        </div>
      </div>
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

export default withSelectedOrganization(withLayout(Dashboard));
