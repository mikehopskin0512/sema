import React, { useEffect } from 'react';
import clsx from 'clsx';
import { GithubIcon } from '../../Icons';
import styles from './LoginCard.module.scss';
import * as analytics from '../../../utils/analytics';
import useLocalStorage from '../../../hooks/useLocalStorage';

const LoginCard = () => {
  const [redirectUser, setRedirectUser] = useLocalStorage('redirect_user', false);

  useEffect(() => {
    setRedirectUser(false);
  }, []);

  const githubLogin = () => {
    window.location.href = '/api/identities/github';
    analytics.fireAmplitudeEvent(analytics.AMPLITUDE_EVENTS.CLICKED_LOGIN, { url: '/login' });
    setRedirectUser(true);
  };

  return (
    <>
      <h1 className="title has-text-centered has-text-black">Welcome to Sema</h1>
      <div className="is-divider is-primary mx-90" />
      <p className="has-text-centered is-size-6 has-text-black mb-50 has-text-weight-medium">
        Sema is still a work in progress. Join the waitlist<br /> to be
        amongst the first to try it out.
      </p>
      <div className="mb-15">
        <span className="is-size-8 has-text-gray-500">
          By joining, you are agreeing to Sema’s &nbsp;
          <a href="https://www.semasoftware.com/legal/terms-conditions" className="is-underlined">
            Terms & Conditions
          </a>
        </span>
      </div>
      <button
        type="button"
        className="button is-black is-primary colored-shadow-small p-25"
        onClick={githubLogin}
      >
        <div className="is-flex mr-16 is-hidden-mobile">
          <GithubIcon size="large" />
        </div>
        <span className="has-text-weight-semibold is-size-16 ">Join our Waitlist with GitHub</span>
      </button>
      {/* <button className="button is-black is-fullwidth" href="/api/identities/github">Join the waitlist with GitHub</button> */}
      <p className={styles['through-container']}>
        <span className={styles.line} />
        <span className={styles['text-container']}>
          <span className={clsx('has-text-weight-semibold is-size-7 has-text-gray-500', styles['through-text'])}>
            Already have an account?
          </span>
        </span>
      </p>
      <button
        type="button"
        className="button p-25 is-primary is-outlined colored-shadow-small"
        onClick={githubLogin}
      >
        <GithubIcon size="large" />
        <span className="ml-16 has-text-weight-semibold is-size-16">Sign in with GitHub</span>
      </button>
    </>
  );
};

export default LoginCard;
