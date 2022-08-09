import React, { useEffect } from 'react';
import clsx from 'clsx';
import { GithubIcon } from '../../Icons';
import styles from './LoginCard.module.scss';
import * as analytics from '../../../utils/analytics';
import useLocalStorage from '../../../hooks/useLocalStorage';

const LoginCard = () => {
  const [redirectUser, setRedirectUser] = useLocalStorage(
    'redirect_user',
    false
  );

  useEffect(() => {
    setRedirectUser(false);
  }, []);

  const githubLogin = () => {
    window.location.href = '/api/identities/github';
    analytics.fireAmplitudeEvent(analytics.AMPLITUDE_EVENTS.CLICKED_LOGIN, {
      url: '/login',
    });
    setRedirectUser(true);
  };

  return (
    <>
      <h1 className={clsx('has-text-centered has-text-white', styles['title'])}>
        Welcome to Sema!
      </h1>
      <div className="is-divider is-primary mx-90" />

      <button
        type="button"
        className={clsx(
          'button colored-shadow-small p-25 mt-60',
          styles['login-button']
        )}
        onClick={githubLogin}
      >
        <span className="has-text-weight-semibold is-size-16 ">
          Join Sema
        </span>
      </button>

      <div className={styles['terms-and-conditions']}>
        <span className="is-size-8 has-text-gray-500">
          By signing in, you agree to &nbsp;
          <a href="https://www.semasoftware.com/legal/terms-conditions">
            Terms & Conditions
          </a>
        </span>
      </div>
    </>
  );
};

export default LoginCard;
