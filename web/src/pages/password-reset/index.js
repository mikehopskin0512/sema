import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from 'react-hook-form';

import Toaster from '../../components/toaster';
import withLayout from '../../components/layout';
import { passwordOperations } from '../../state/features/password-reset';

const { passwordResetRequest } = passwordOperations;

const InputForm = (props) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    const { email } = data;
    props.handleClick(email);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="title-topper mt-70 mb-20" />
      <h1 className="title is-spaced">Reset Password</h1>
      <p className="subtitle is-6">Please enter the email address associated with your account to receive a reset password link.</p>
      <div className="columns">
        <div className="column is-7">
          <div className="field">
            <label className="label">Email Address</label>
            <div className="control has-icons-left">
              <input
                className="input"
                type="email"
                placeholder="e.g. tony@starkindustries.com"
                name="email"
                ref={register({
                  required: 'Email is required',
                  pattern:
                    { value:/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i, message: 'Invaild email format' },
                })}
                required
              />
              <span className="icon is-small is-left">
                <FontAwesomeIcon icon="envelope" />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="control">
        <button
          type="submit"
          className="button is-black">Send Link
        </button>
      </div>
      <div className="field">
        <div className="is-divider" />
        <p className="is-size-6">
          Having trouble? <a href="mailto:support@semasoftware.com">Email support</a>
        </p>
      </div>
    </form>
  );
};

export const Confirmation = (props) => {
  const { emailSubmitted } = props;
  return (
    <div>
      <div className="title-topper mt-70 mb-20" />
      <h1 className="title is-spaced">Reset Password Link</h1>
      <p>If an account exists with {emailSubmitted ? <strong>{emailSubmitted}</strong> : 'your email'}, you&apos;ll receive an email.</p>
      <p>Please follow the instructions within to reset your password.</p>
      <br />
      <Link href="/login"><a className="button is-black">Return to Login</a></Link>
      <br />
    </div>
  );
};

const ResetRequest = () => {
  const [confirmation, setConfirmation] = useState(false);
  const [alertLabel, setAlertLabel] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState('');

  const dispatch = useDispatch();
  const handlePasswordRequest = (email) => {
    dispatch(passwordResetRequest(email));
    setConfirmation(true);
    setEmailSubmitted(email);
  };

  // Check for error in query string
  const {
    query: { err },
  } = useRouter();

  useEffect(() => {
    if (err) {
      setAlertLabel('Your reset link is expired or already used. Please request a new link below.');
      setShowAlert(true);
    }
  }, [err, setAlertLabel]);

  return (
    <div>
      <Toaster
        type="error"
        message={alertLabel}
        showAlert={showAlert} />
      <section className="hero">
        <div className="hero-body">
          <div className="container">
            <div className="columns is-centered">
              <div className="column is-7-tablet is-7-desktop is-7-widescreen">
                {(confirmation)
                  ? <Confirmation emailSubmitted={emailSubmitted} />
                  : <InputForm handleClick={handlePasswordRequest} />}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

InputForm.propTypes = {
  handleClick: PropTypes.func.isRequired,
};

Confirmation.propTypes = {
  emailSubmitted: PropTypes.string,
};

Confirmation.defaultProps = {
  emailSubmitted: '',
};

export default withLayout(ResetRequest);
