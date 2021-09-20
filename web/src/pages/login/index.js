import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTag } from '@fortawesome/free-solid-svg-icons'
import { faThumbsUp, faCommentAlt } from '@fortawesome/free-regular-svg-icons'
import { isEmpty } from "lodash";

import clsx from 'clsx';
import Toaster from '../../components/toaster';
import withLayout from '../../components/layout';
import LoginCard from '../../components/auth/LoginCard';
import InviteCard from '../../components/auth/InviteCard';
import WaitlistCard from '../../components/auth/WaitlistCard';
import Helmet, { LoginHelmet } from '../../components/utils/Helmet';
import styles from './login.module.scss';

import { alertOperations } from '../../state/features/alerts';
import { authOperations } from '../../state/features/auth';
import { invitationsOperations } from '../../state/features/invitations';

const { clearAlert } = alertOperations;
const { authenticate } = authOperations;
const { fetchInvite } = invitationsOperations;

const Login = () => {
  const router = useRouter();
  const {
    query: { token },
  } = router;

  const dispatch = useDispatch();

  // Import state vars
  const { alerts, auth, invitations } = useSelector((state) => ({
    alerts: state.alertsState,
    auth: state.authState,
    invitations: state.invitationsState,
  }));

  const { user, isAuthenticated } = auth;
  const { showAlert, alertType, alertLabel } = alerts;

  // Check for updated state in selectedTag
  useEffect(() => {
    if (showAlert === true) {
      dispatch(clearAlert());
    }
  }, [showAlert, dispatch]);

  // Redirect if user is already logged in
  useEffect(() => {
    if (isAuthenticated && !user.isWaitlist) {
      router.replace('/');
    }
  }, [isAuthenticated]);

  const onSubmit = (data) => {
    const { email, password } = data;
    dispatch(authenticate(email, password));
  };

  const renderCard = () => {
    if (token) {
      if (!isEmpty(invitations.data)) {
        return <InviteCard  invitation={invitations} />
      }
    }

    if (user?.isWaitlist) {
      return <WaitlistCard />
    }
    return <LoginCard isAuthenticated={isAuthenticated} />;
  }

  useEffect(() => {
    if (token) {
      dispatch(fetchInvite(token));
    }
  }, [])

  return (
    <div className={styles.container}>
      <Helmet { ...LoginHelmet } />
      <Toaster type={alertType} message={alertLabel} showAlert={showAlert} />
      <section className="hero">
        <div className="hero-body pb-300">
          <div className="container">
            <div className="tile is-ancestor">
              <div className="tile is-vertical is-parent is-6 is-flex is-justify-content-center is-align-items-center">
                <img src="/img/codelines.png" width="430"/>
                <div className="feature-list mt-50">
                  <ul>
                    <li className="mb-25">
                      <div className="is-flex is-flex-direction-row is-flex-wrap-nowrap is-align-items-center">
                        <div className={clsx("has-background-gray-2 mr-15", styles['fa-container'])} >
                          <FontAwesomeIcon icon={faThumbsUp} size="lg" />
                        </div>
                        <span className="is-size-1r">
                          <span className="has-text-weight-bold">Reactions: </span>
                          Choose a simple summary of your review.</span>
                      </div>
                    </li>
                    <li className="mb-25">
                      <div className="is-flex is-flex-direction-row is-flex-wrap-nowrap is-align-items-center">
                        <div className={clsx("has-background-gray-2 mr-15", styles['fa-container'])} >
                          <FontAwesomeIcon icon={faTag} size="lg" />
                        </div>
                        <span className="is-size-1r">
                          <span className="has-text-weight-bold">Tags: </span>
                          Highlight the key takeaways of your review
                        </span>
                      </div>
                    </li>
                    <li className="mb-25">
                      <div className="is-flex is-flex-direction-row is-flex-wrap-nowrap is-align-items-center">
                        <div className={clsx("has-background-gray-2 mr-15", styles['fa-container'])} >
                          <FontAwesomeIcon icon={faCommentAlt} size="lg" />
                        </div>
                        <span className="is-size-1r">
                          <span className="has-text-weight-bold">Suggested Comments: </span>
                          Insert pre-written comments from the world’s best sources of coding knowledge.
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="tile is-1"/>
              {/** Show on Mobile */}
              <div
                className={clsx(
                  'colored-shadow tile is-child is-5 p-40 box has-text-centered is-hidden-desktop',
                  styles['login-tile'],
                )}
              >
                {renderCard()}
              </div>
              {/** Show on Desktop */}
              <div
                className={clsx(
                  'colored-shadow tile is-child is-5 p-70 box has-text-centered is-hidden-mobile',
                  styles['login-tile'],
                )}
              >
                {renderCard()}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default withLayout(Login);
