import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from 'react-hook-form';

import Toaster from '../../components/toaster';
import withLayout from '../../components/layout';
import './login.module.scss';

import { alertOperations } from '../../state/features/alerts';
import { authOperations } from '../../state/features/auth';

const { clearAlert } = alertOperations;
const { authenticate } = authOperations;

const githubClient = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
const githubUri = process.env.NEXT_PUBLIC_GITHUB_REDIRECT;

const Login = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, watch, errors } = useForm();

  // Import state vars
  const { alerts } = useSelector(
    (state) => ({
      alerts: state.alertsState,
    }),
  );

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

  return (
    <div>
      <Toaster
        type={alertType}
        message={alertLabel}
        showAlert={showAlert} />
      <section className="hero">
        <div className="hero-body">
          <div className="container">
            <div className="columns is-centered">
              <div className="column is-6-tablet is-5-desktop is-5-widescreen">
                <div className="title-topper mt-70 mb-20" />
                <h1 className="title">Log In</h1>
                <form className="mt-70" onSubmit={handleSubmit(onSubmit)}>
                  <div className="field">
                    <label htmlFor="" className="label has-text-weight-normal">Email Address</label>
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="email"
                        placeholder="e.g. tony@starkindustries.com"
                        name="email"
                        ref={register}
                        required
                      />
                      <span className="icon is-small is-left">
                        <FontAwesomeIcon icon="envelope" />
                      </span>
                    </div>
                  </div>
                  <div className="field">
                    <label htmlFor="" className="label has-text-weight-normal">Password</label>
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="password"
                        placeholder="*******"
                        name="password"
                        ref={register}
                        required
                      />
                      <span className="icon is-small is-left">
                        <FontAwesomeIcon icon="lock" />
                      </span>
                    </div>
                  </div>
                  <div className="field mt-2r">
                    <button type="submit" className="button is-primary is-fullwidth">
                      Login with Email
                    </button>
                  </div>
                  <div className="field">
                    <a
                      type="button"
                      className="button is-fullwidth is-github"
                      href={`https://github.com/login/oauth/authorize?scope=user&client_id=${githubClient}&redirect_uri=${githubUri}`}>
                      <span className="icon">
                        <FontAwesomeIcon icon={['fab', 'github']} />
                      </span>
                      <span>Login with GitHub</span>
                    </a>
                  </div>
                  <div className="field">
                    <p className="has-text-centered is-size-7">
                      By signing in, you agree to our<br />Terms and Conditions
                    </p>
                  </div>
                  <div className="field">
                    <p><strong>Having trouble logging in?</strong>&nbsp;&nbsp;<Link href="/password-reset/"><a>Reset password</a></Link></p>
                  </div>                  
                  <div className="field">
                    <div className="is-divider" data-content="OR"></div>
                    <p><strong>Want to sign up for the Sema platfrom?</strong></p>
                    <div className="mt-1r">
                      <Link href="/register">
                        <a className="button is-primary">
                          <span className="icon">
                            <FontAwesomeIcon icon={['fas', 'user']} />
                          </span>
                          <span>Create an account</span>
                        </a>
                      </Link>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default withLayout(Login);
