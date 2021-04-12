import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from 'react-hook-form';
import { isEmpty } from "lodash";

import clsx from 'clsx';
import Toaster from '../../components/toaster';
import withLayout from '../../components/layout';
import styles from './login.module.scss';

import { alertOperations } from '../../state/features/alerts';
import { authOperations } from '../../state/features/auth';

const { clearAlert } = alertOperations;
const { authenticate } = authOperations;

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { register, handleSubmit, watch, errors } = useForm();

  // Import state vars
  const { alerts, auth } = useSelector((state) => ({
    alerts: state.alertsState,
    auth: state.authState,
  }));

  const { user, isAuthenticated } = auth;
  console.log(auth);

  const { showAlert, alertType, alertLabel } = alerts;

  // Check for updated state in selectedTag
  useEffect(() => {
    if (showAlert === true) {
      dispatch(clearAlert());
    }
  }, [showAlert, dispatch]);

  const onSubmit = (data) => {
    const { email, password } = data;
    dispatch(authenticate(email, password));
  };

  const LoginScreen = () => {
    return (
      <>
        <h1 className="title has-text-centered">Welcome to Sema</h1>
        <h2 className="subtitle has-text-centered is-size-6">
          Sema is still a work in progress. Join the waitlist to be
          amongst the first to try it out.
        </h2>
        <a
          type="button"
          className="button is-black is-fullwidth"
          href="/api/identities/github"
        >
          <span>Join the waitlist with Github</span>
        </a>
        {/* <button class="button is-black is-fullwidth" href="/api/identities/github">Join the waitlist with Github</button> */}
        <p className={styles['through-container']}>
          <span className={styles.line} />
          <span className={styles['text-container']}>
            <span className={styles['through-text']}>
              Already have an account?
            </span>
          </span>
        </p>
        <a
          type="button"
          className="button is-fullwidth"
          href="/api/identities/github"
        >
          <span>Sign in with Github</span>
        </a>
      </>
    );
  };

  const renderScreen = () => {
    if (user?.isWaitlist) {
      return <Waitlist />
    }
    return LoginScreen();
  }

  return (
    <div className={styles.container}>
      <Toaster type={alertType} message={alertLabel} showAlert={showAlert} />
      <section className="hero">
        <div className="hero-body">
          <div className="container">
            <div className="tile is-ancestor">
              <div className="tile is-6" />
              <div
                className={clsx(
                  'tile is-child is-5 box',
                  styles['tile-padding'],
                )}
              >
                {renderScreen()}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const Waitlist = () => (
  <>
    <div className={styles['head-text']}>
      <h4 className="title is-4 has-text-centered">You&apos;re on the list!</h4>
      <h2 className={clsx(
        'subtitle has-text-centered has-text-weight-medium',
        styles['foot-text'],
      )}>
        Thanks for your interest. We&apos;ve added you on the list. We&apos;ll
        email as soon as a slot opens up in the private beta
      </h2>
    </div>
    <div className={clsx(
      'title has-text-centered',
      styles['foot-text'],
    )}>
      Skip the line
    </div>
    <div className={clsx(
      'subtitle has-text-centered has-text-weight-medium',
      styles['foot-text'],
    )}>
      A few people have the ability to invite others.
      <div>
        Keep an eye out for our early testers.
      </div>
    </div>
  </>
);

export default withLayout(Login);
