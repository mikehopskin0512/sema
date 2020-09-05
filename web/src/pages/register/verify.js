import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Link from 'next/link';

import Toaster from '../../components/toaster';
import withLayout from '../../components/layout';
import { authOperations } from '../../state/features/auth';

const { activateUser, resendVerifiction } = authOperations;

const ResetMessage = (props) => {
  const { username, handleClick } = props;
  const message = (
    <p>We sent an email verification to&nbsp;
      {(username) ? <strong>{username}</strong> : 'you'}.&nbsp;
      Please check your email and activate your account.
    </p>
  );
  return (
    <div>
      {message}
      <br />
      {(username) && (
        <div>
          <p>
            <strong>Didn&#39;t get the email?</strong>
          </p>
          <div className="control mt-15">
            <button
              type="button"
              className="button is-primary"
              onClick={handleClick}>Click here to resend verification email
            </button>
          </div>
        </div>
      )}
      <p className="mt-20">
        <span>Need help? Email us at <a href="mailto:support@semasoftware.com">support@semasoftware.com</a></span>
      </p>
    </div>
  );
};

const Confirmation = () => (
  <div className="columns is-centered">
    <div className="column">
      <h2 className="title is-size-5">
        Account verification successful
      </h2>
      <p>We have verified your email and your account is fully activated</p>
      <br />
      <Link href="/reports"><a className="button is-primary">Continue to dashboard</a></Link>
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
      <section className="hero">
        <div className="hero-body">
          <div className="container">
            <div className="columns is-centered">
              <div className="column is-7-tablet is-7-desktop is-7-widescreen">
                <div className="title-topper mt-70 mb-20" />
                <h1 className="title is-spaced">Account Verification</h1>
                <p className="subtitle is-6">
                  {(isVerified)
                    ? <Confirmation />
                    : <ResetMessage handleClick={handleClick} username={username} />}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

ResetMessage.propTypes = {
  handleClick: PropTypes.func.isRequired,
  username: PropTypes.string,
};

ResetMessage.defaultProps = {
  username: '',
};

export default withLayout(UserVerify);
