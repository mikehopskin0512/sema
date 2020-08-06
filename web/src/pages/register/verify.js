import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';

import Toaster from '../../components/toaster';
import withLayout from '../../components/layout/newLayout';
import { alertOperations } from '../../state/features/alerts';
import { authOperations } from '../../state/features/auth';

const { clearAlert } = alertOperations;
const { activateUser, resendVerifiction } = authOperations;

const ResetMessage = (props) => {
  const { username, handleClick } = props;
  const message = <p>We sent an email verification to {(username) ? <strong>{username}</strong> : 'you'}. Please check your email and activate your account.</p>;
  return (
    <div>
      {message}
      <br />
      {(username) && (
        <div>
          <p className="has-text-centered is-size-6">
            <strong>Didn&#39;t get the email?</strong>
          </p>
          <div className="control has-text-centered margin-top-15">
            <button
              type="button"
              className="button is-primary"
              onClick={handleClick}>Click here to resend verification email
            </button>
          </div>
        </div>
      )}
      <p className="has-text-centered is-size-6 margin-top-15">
        <span>Need help? Email us at <a href="mailto:support@semasoftware.com">support@semasoftware.com</a></span>
      </p>
    </div>
  );
};

const Confirmation = () => (
  <div className="columns is-centered">
    <div className="column">
      <h1 className="title is-size-5 has-text-black has-text-centered">
        Account verification successful
      </h1>
      <p className="has-text-centered">We have verified your email and your account is fully activated</p>
      <br />
      <Link href="/reports"><a className="button is-primary is-fullwidth">Continue to dashboard</a></Link>
    </div>
  </div>
);

const UserVerify = () => {
  const dispatch = useDispatch();
  // Get token from params
  const {
    query: { token: verifyToken },
  } = useRouter();

  // Import state vars
  const { alerts, auth } = useSelector(
    (state) => ({
      alerts: state.alertsState,
      auth: state.authState,
    }),
  );

  const { showAlert, alertType, alertLabel } = alerts;
  const { user: { username, isVerified } } = auth;

  // Validate token & activate user
  const callUserActivation = useCallback(() => {
    dispatch(activateUser(verifyToken));
  }, [dispatch, verifyToken]);

  useEffect(() => {
    if (verifyToken) {
      callUserActivation();
    }
  }, [callUserActivation, verifyToken]);


  const handleClick = () => {
    dispatch(resendVerifiction(username));
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
              <div className="column is-8-tablet is-7-desktop is-7-widescreen">
                <div style={{ padding: '1.25rem' }}><p>Sema</p><p className="is-size-4 has-text-white">Account verification</p></div>
                <div className="box">
                  {(isVerified)
                    ? <Confirmation />
                    : <ResetMessage handleClick={handleClick} username={username} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default withLayout(UserVerify);
