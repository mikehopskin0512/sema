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
      <section className="hero is-primary">
        <div className="hero-body">
          <div className="container">
            <div className="columns is-centered">
              <div className="column is-5-tablet is-4-desktop is-4-widescreen">
                <div style={{ padding: '1.25rem' }}><p>Sema</p><p className="is-size-4 has-text-white">Code Quality Platform</p></div>

                <form className="box" onSubmit={handleSubmit(onSubmit)}>
                  <div className="field">
                    <label htmlFor="" className="label">Email</label>
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
                    <label htmlFor="" className="label">Password</label>
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
                  <div className="field">
                    <Link href="/password-reset/"><a className="is-size-7">Forgot password?</a></Link>
                  </div>
                  <div className="field">
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
                    <div className="is-divider" data-content="OR"></div>
                    <p className="has-text-centered is-size-7">
                      Want to sign up for the Sema platfrom?
                    </p>
                    <p className="has-text-centered is-size-7">
                      <Link href="/register"><a className="is-size-7">Create an account</a></Link>
                    </p>
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
