import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './LoginCard.module.scss';

const LoginCard = () => (
  <>
    <h1 className="title has-text-centered mb-20">Welcome to Sema</h1>
    <div className="is-divider is-info mx-90" />
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
      className="button p-25 is-primary is-outlined"
      href="/api/identities/github"
    >
      <span className="icon is-large mr-20">
        <FontAwesomeIcon
          icon={['fab', 'github']}
          size="2x"
        />
      </span>
      <span>Sign in with Github</span>
    </a>
  </>
);

export default LoginCard;
