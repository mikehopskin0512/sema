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
      <h1 className={clsx('has-text-centered has-text-white mb-20', styles['title'])}>Welcome to Sema!</h1>
      <span
        className='has-text-weight-semibold is-size-16 mb-25 has-text-white is-block'>Sema is ready to help you supercharge your code reviews.</span>
      <div className='is-divider is-primary mx-90' />

      <button
        type='button'
        className={clsx('button colored-shadow-small p-25', styles['login-button'])}
        onClick={githubLogin}
      >
        <div className='is-flex mr-16 is-hidden-mobile'>
          <GithubIcon size='large' />
        </div>
        <span className='has-text-weight-semibold is-size-16 '>Join Sema with GitHub</span>
      </button>

      <p className={styles['through-container']}>
        <span className={styles['text-container']}>
          <span className={clsx('has-text-weight-semibold is-size-7', styles['through-text'])}>
            Already have an account?
          </span>
        </span>
      </p>

      <button
        type='button'
        className={clsx('button p-25 colored-shadow-small', 'is-outlined', styles['sign-in-button'])}
        onClick={githubLogin}
      >
        <GithubIcon size='large' />
        <span className='ml-16 has-text-weight-semibold is-size-16'>Sign in with GitHub</span>
      </button>
      <div className={styles['terms-and-conditions']}>
        <span className="is-size-8 has-text-gray-500">
          By joining, you are agreeing to Sema’s &nbsp;
          <a href="https://www.semasoftware.com/legal/terms-conditions">
            Terms & Conditions
          </a>
        </span>
      </div>
    </>
  );
};

export default LoginCard;
