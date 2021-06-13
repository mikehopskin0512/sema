import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import styles from './LoginCard.module.scss';

const LoginCard = ({ isAuthenticated }) => {

  const githubLogin = () => {
    window.location.href = "/api/identities/github";
  };

  return <>
    <h1 className="title has-text-centered">Welcome to Sema</h1>
    <div className="is-divider is-primary mx-90" />
    <p className="has-text-centered is-size-6 has-text-black mb-50 has-text-weight-medium">
      Sema is still a work in progress. Join the waitlist to be
      amongst the first to try it out.
    </p>
    <span className="is-size-8 has-text-gray-dark">By joining, you are agreeing to Sema’s <a href="https://semasoftware.com/terms-and-conditions/">Terms & Conditions</a></span>
    <button
      type="button"
      className="button is-black is-primary colored-shadow-small p-25 mt-15"
      onClick={githubLogin}
      disabled={isAuthenticated}
    >
      <span className="icon is-large mr-16 ml-0">
        <FontAwesomeIcon
          icon={['fab', 'github']}
          size="2x"
        />
      </span>
      <span className='has-text-weight-semibold is-size-16'>Join our Waitlist with Github</span>
    </button>
    {/* <button class="button is-black is-fullwidth" href="/api/identities/github">Join the waitlist with Github</button> */}
    <p className={styles['through-container']}>
      <span className={styles.line} />
      <span className={styles['text-container']}>
        <span className={clsx('has-text-weight-semibold is-size-7 has-text-gray-dark', styles['through-text'])}>
          Already have an account?
        </span>
      </span>
    </p>
    <button
      type="button"
      className="button p-25 is-primary is-outlined colored-shadow-small"
      onClick={githubLogin}
      disabled={isAuthenticated}
    >
      <span className="icon is-large mr-20">
        <FontAwesomeIcon
          icon={['fab', 'github']}
          size="2x"
        />
      </span>
      <span className='has-text-weight-semibold is-size-16'>Sign in with Github</span>
    </button>
  </>
};

export default LoginCard;
