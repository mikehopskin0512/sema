import { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from 'react-hook-form';

import Toaster from '../../../components/toaster';
import withLayout from '../../../components/layout';
import { passwordOperations } from '../../../state/features/password-reset';

const { verifyResetToken, changePassword } = passwordOperations;

const InputForm = (props) => {
  // const emailRef = useRef(null);
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = (data) => {
    const { password } = data;
    props.handleClick(password);
  };

  useEffect(() => {
    // emailInput.current.focus();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p className="has-text-centered">Enter your new password:</p>
      <br />
      <div className="field">
        <div className="control has-icons-left">
          <input
            className={`input ${errors.password && 'is-danger'}`}
            type="password"
            name="password"
            ref={register({
              required: 'Password is required',
              minLength: { value: 8, message: 'Minimum of 8 characters required' },
              maxLength: { value: 20, message: 'Maximum of 20 characters allowed' },
              pattern: { value: /(?=.*?[A-Za-z])(?=.*?[0-9])(?=.*[@$!%*#?&])/, message: 'Must contain 1 letter, 1 number, and 1 special character' },
            })} />
          <span className="icon is-small is-left">
            <FontAwesomeIcon icon="lock" />
          </span>
        </div>
        <p className="help is-danger">{errors.password && errors.password.message}</p>
      </div>
      <div className="control">
        <button
          type="submit"
          className="button is-primary is-fullwidth">Set new password
        </button>
      </div>
    </form>
  );
};


const Confirmation = () => (
  <div className="columns is-centered">
    <div className="column">
      <h1 className="title is-size-5 has-text-black has-text-centered">
        Reset Password Complete
      </h1>
      <p className="has-text-centered">You have successfully reset the password for the account associated with email</p>
      <br />
      <Link href="/login"><a className="button is-primary is-fullwidth">Return to Log in</a></Link>
    </div>
  </div>
);

const PasswordReset = () => {
  const [confirmation, setConfirmation] = useState(false);
  const dispatch = useDispatch();
  // Get userId and token from params
  const {
    query: { userId, resetToken },
  } = useRouter();

  // Validate resetToken
  const callTokenValidation = useCallback(() => {
    dispatch(verifyResetToken(userId, resetToken));
  }, [dispatch, userId, resetToken]);

  useEffect(() => {
    callTokenValidation();
  }, [callTokenValidation]);


  const handlePasswordReset = (password) => {
    dispatch(changePassword(password, resetToken));
    setConfirmation(true);
  };

  return (
    <div>
      <section className="hero is-primary">
        <div className="hero-body">
          <div className="container">
            <div className="columns is-centered">
              <div className="column is-6-tablet is-5-desktop is-5-widescreen">
                <div style={{ padding: '1.25rem' }}><p>Sema</p><p className="is-size-4 has-text-white">Reset your password</p></div>
                <div className="box">
                  {(confirmation)
                    ? <Confirmation />
                    : <InputForm handleClick={handlePasswordReset} />}
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

export default withLayout(PasswordReset);
