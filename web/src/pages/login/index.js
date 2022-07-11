import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { isEmpty } from "lodash";
import Logo from '../../components/Logo';
import clsx from 'clsx';
import Toaster from '../../components/toaster/index';
import withLayout from '../../components/layout';
import Loader from '../../components/Loader';
import LoginCard from '../../components/auth/LoginCard';
import InviteCard from '../../components/auth/InviteCard';
import WaitlistCard from '../../components/auth/WaitlistCard';
import Helmet, { LoginHelmet } from '../../components/utils/Helmet';
import styles from './login.module.scss';

import { alertOperations } from '../../state/features/alerts';
import { authOperations } from '../../state/features/auth';
import { invitationsOperations } from '../../state/features/invitations';
import * as analytics from '../../utils/analytics';
import useLocalStorage from '../../hooks/useLocalStorage';

const { clearAlert } = alertOperations;
const { authenticate } = authOperations;
const { fetchInvite, acceptInvite, trackOrganizationInviteAccepted } = invitationsOperations;

const Login = () => {
  const router = useRouter();
  const {
    query: { token: inviteToken, organization: organizationId, isFastForwardOnboarding },
  } = router;
  
  const [isFFOnboardingStarted, setIsFFOnboardingStarted] = useLocalStorage('is_ff_onboarding_started', false);

  const dispatch = useDispatch();

  // Import state vars
  const { alerts, auth, invitations } = useSelector((state) => ({
    alerts: state.alertsState,
    auth: state.authState,
    invitations: state.invitationsState,
  }));

  const { user, isAuthenticated, token } = auth;
  const { showAlert, alertType, alertLabel } = alerts;
  const isWaitlistFunctionality = Boolean(parseInt(process.env.NEXT_PUBLIC_WAITLIST_ENABLED));

  const onGithubLogin = () => {
    setIsFFOnboardingStarted(true);
    window.location.href = '/api/identities/github';
    analytics.fireAmplitudeEvent(analytics.AMPLITUDE_EVENTS.CLICKED_LOGIN, { url: '/login' });
  };

  useEffect(() => {
    setIsFFOnboardingStarted(false);
  }, [])

  useEffect(() => {
    if (isFastForwardOnboarding) {
      onGithubLogin();
    }
  }, [isFastForwardOnboarding])

  // Check for updated state in selectedTag
  useEffect(() => {
    if (showAlert === true) {
      dispatch(clearAlert());
    }
  }, [showAlert, dispatch]);

  // Redirect if user is already logged in
  useEffect(() => {
    if (isAuthenticated && !user.isWaitlist && !invitations.isAcceptingInvite) {
      router.replace('/');
    }
  }, [isAuthenticated]);

  const onSubmit = (data) => {
    const { email, password } = data;
    dispatch(authenticate(email, password));
  };

  const renderCard = () => {
    if (inviteToken) {
      if (!isEmpty(invitations.data)) {
        return <InviteCard  invitation={invitations} />
      }
    }

    if (user?.isWaitlist && isWaitlistFunctionality) {
      return <WaitlistCard />
    }

    return <LoginCard isAuthenticated={isAuthenticated} />;
  }

  useEffect(() => {
    if (inviteToken) {
      dispatch(fetchInvite(inviteToken));
      dispatch(acceptInvite(inviteToken, token));
      if (organizationId) {
        trackOrganizationInviteAccepted(organizationId, {});
      }
    }
  }, [])

if (!isAuthenticated || user.isWaitlist) {
  return (
    <div className={styles.container}>
      <Helmet { ...LoginHelmet } />
      <Toaster type={alertType} message={alertLabel} showAlert={showAlert} />
      <img src="/img/login-bg.png" className={styles.bg} />
      <section className="hero">
        <div className="hero-body mb-120">
          <div className="container">
            <div className="mb-5 mt-40">
              <Logo shape="horizontal" width={218} height={73} theme="dark" />
            </div>
            <div className={clsx(styles['neon-logo'], 'is-hidden-mobile')}>
              <img src="/img/logo-neon.png" />
            </div>
            <div className="is-flex is-flex-wrap-wrap is-justify-content-space-around">
              <div className="is-flex is-flex-direction-column is-align-items-center is-justify-content-center" >
                <div style={{ maxWidth: 500 }}>
                  <h1 className={clsx("my-40", styles.title)}>Write more meaningful code reviews.</h1>
                  <div className="feature-list mt-20">
                    <ul>
                      <li className="mb-25">
                        <div className="is-flex is-flex-direction-row is-flex-wrap-nowrap is-align-items-center">
                          <div className={clsx("mr-15", styles['fa-container'])} >
                            <img src="/img/icons/like_vector.png" />
                          </div>
                          <span className={clsx(styles.subtitles, "is-size-1r")}>
                            <span className="has-text-weight-bold">Snippets: </span>
                            Leave better reviews by inserting pre-written snippets based on best practices.
                          </span>
                        </div>
                      </li>
                      <li className="mb-25">
                        <div className="is-flex is-flex-direction-row is-flex-wrap-nowrap is-align-items-center">
                          <div className={clsx("mr-15", styles['fa-container'])} >
                            <img src="/img/icons/comment_vector.png" />
                          </div>
                          <span className={clsx(styles.subtitles, "is-size-1r")}>
                            <span className="has-text-weight-bold">Comment Summaries: </span>
                            Quickly summarize your review by choosing from a list of summaries.
                          </span>
                        </div>
                      </li>
                      <li className="mb-25">
                        <div className="is-flex is-flex-direction-row is-flex-wrap-nowrap is-align-items-center">
                          <div className={clsx("mr-15", styles['fa-container'])} >
                            <img src="/img/icons/tag_vector.png" />
                          </div>
                          <span className={clsx(styles.subtitles, "is-size-1r")}>
                            <span className="has-text-weight-bold">Comment Tags: </span>
                            Automatically categorize your comments with clear, mutually exclusive tags.
                          </span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="is-hidden-touch is-hidden-desktop-only is-hidden-widescreen-only" style={{ minWidth: 50 }} />
              <div>
                {/** Show on WideScreens */}
                <div
                  className={clsx(
                    'colored-shadow has-text-centered is-hidden-touch is-hidden-desktop-only is-hidden-widescreen-only px-80 pt-110 pb-15',
                    styles['login-tile'],
                  )}
                >
                  {renderCard()}
                </div>
                {/** Show on desktop */}
                <div
                  className={clsx(
                    'colored-shadow has-text-centered is-hidden-touch is-hidden-fullhd pt-50 pb-15 px-30',
                    styles['login-tile'],
                  )}
                >
                  {renderCard()}
                </div>
                {/** Show on Mobile */}
                <div className="is-hidden-desktop p-20 pb-200">
                  <div
                    className={clsx(
                      'colored-shadow has-text-centered px-20 py-50',
                      styles['login-tile'],
                    )}
                  >
                    {renderCard()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>);
  }

  return(
    <div className="is-flex is-align-items-center is-justify-content-center" style={{ height: '55vh' }}>
      <Loader/>
    </div>
  )
};

export default withLayout(Login);
