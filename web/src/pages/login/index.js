import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
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
        <h1 className="title has-text-centered mb-20 has-text-black">Welcome to Sema</h1>
        <div className="is-divider is-primary mx-90" />
        <h2 className="subtitle has-text-centered is-size-6 has-text-black mt-20 mb-90">
          Sema is still a work in progress. Join the waitlist to be
          amongst the first to try it out.
        </h2>
        <a
          type="button"
          className="button is-black p-25 is-primary"
          href="/api/identities/github"
        >
          <span className="icon is-large mr-20">
            <FontAwesomeIcon
              icon={['fab', 'github']}
              size="2x"
            />
          </span>
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
          className="button p-25"
          href="/api/identities/github"
        >
        <span className="icon has-text-primary is-large mr-20">
            <FontAwesomeIcon
              icon={['fab', 'github']}
              size="2x"
            />
          </span>
          <span className="has-text-primary">Sign in with Github</span>
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
              <div className="tile is-vertical is-parent is-6">
                <img src="/img/sema-logo.png" alt="sema-logo" width="200" />
                <div className="title is-4 mt-20 mb-50">Your code review assistant</div>
                <img src="/img/codelines.png" width="500"/>
                <div className="feature-list mt-50 ml-20">
                  <ul>
                    <li className="my-5">
                      <FontAwesomeIcon className="mr-10" icon={faCheck} size="1x" />
                      <span className="is-size-4"> Feature 1</span>
                    </li>
                    <li className="my-5">
                      <FontAwesomeIcon className="mr-10" icon={faCheck} size="1x" />
                      <span className="is-size-4"> Feature 2</span>
                    </li>
                    <li className="my-5">
                      <FontAwesomeIcon className="mr-10" icon={faCheck} size="1x" />
                      <span className="is-size-4"> Feature 3</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="tile is-1"/>
              <div
                className={clsx(
                  'colored-shadow tile is-child is-5 px-70 pb-50 pt-120 box has-text-centered',
                  styles['login-tile'],
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
