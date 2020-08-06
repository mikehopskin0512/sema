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
      <p className="has-text-centered">Enter the email address you use to login:</p>
      <br />
      <div className="field">
        <div className="control has-icons-left">
          <input
            className="input"
            type="email"
            placeholder="e.g. tony@starkindustries.com"
            name="email"
            ref={register({
              required: 'Email is required',
              pattern:
                { value: /^\S+@\S+$/i, message: 'Invaild email format' },
            })}
            required
          />
          <span className="icon is-small is-left">
            <FontAwesomeIcon icon="envelope" />
          </span>
        </div>
      </div>
      <br />
      <div className="control">
        <button
          type="submit"
          className="button is-primary is-fullwidth">Continue
        </button>
      </div>
      <div className="field">
        <div className="is-divider" />
        <p className="has-text-centered is-size-6">
          Having trouble? <a href="mailto:support@semasoftware.com">Email support</a>
        </p>
      </div>
    </form>
  );
};

export const Confirmation = () => (
  <div className="columns is-centered">
    <div className="column">
      <h1 className="title is-size-5 has-text-black has-text-centered">
        Password reset sent
      </h1>
      <p className="has-text-centered">Check your inbox for instructions on how to reset your password.</p>
      <br />
      <p className="has-text-centered">Email didn&#39;t arrive? <Link href="/password-reset"><a>Click here</a></Link> to try again</p>
      <br />
    </div>
  </div>
);

const ResetRequest = () => {
  const [confirmation, setConfirmation] = useState(false);
  const [alertLabel, setAlertLabel] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const dispatch = useDispatch();
  const handlePasswordRequest = (email) => {
    dispatch(passwordResetRequest(email));
    setConfirmation(true);
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
      <section className="hero is-primary">
        <div className="hero-body">
          <div className="container">
            <div className="columns is-centered">
              <div className="column is-6-tablet is-5-desktop is-5-widescreen">
                <div style={{ padding: '1.25rem' }}><p className="is-size-4 has-text-white">Reset your password</p></div>
                <div className="box">
                  {(confirmation)
                    ? <Confirmation />
                    : <InputForm handleClick={handlePasswordRequest} />}
                </div>
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

export default withLayout(ResetRequest);
