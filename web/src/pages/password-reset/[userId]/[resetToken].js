import { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from 'react-hook-form';

import withLayout from '../../../components/layout';
import { passwordOperations } from '../../../state/features/password-reset';

const { verifyResetToken, changePassword } = passwordOperations;

const InputForm = (props) => {
  // const emailRef = useRef(null);
  const { register, handleSubmit, errors, watch } = useForm();

  const onSubmit = (data) => {
    const { password } = data;
    props.handleClick(password);
  };

  useEffect(() => {
    // emailInput.current.focus();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="title-topper mt-70 mb-20" />
      <h1 className="title is-spaced">Reset Password</h1>
      <p className="subtitle is-6">Cras justo odio, dapibus ac facilisis in, egestas eget quam. Curabitur blandit tempus porttitor. Donec sed odio dui.</p>
      <div className="columns">
        <div className="column is-7">
          <div className="field">
            <label className="label">Password</label>
            <div className="control has-icons-left">
              <input
                className={`input ${errors.password && 'is-danger'}`}
                type="password"
                name="password"
                ref={register({
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Minimum of 8 characters required' },
                  maxLength: { value: 20, message: 'Maximum of 20 characters allowed' },
                  pattern: {
                    value: /(?=.*?[A-Za-z])(?=.*?[0-9])(?=.*[@$!%*#?&])/,
                    message: 'Must contain 1 letter, 1 number, and 1 special character',
                  },
                })} />
              <span className="icon is-small is-left">
                <FontAwesomeIcon icon="lock" />
              </span>
            </div>
            <p className="help is-danger">{errors.password && errors.password.message}</p>
          </div>
          <div className="field">
            <label className="label">Confirm password</label>
            <div className="control has-icons-left">
              <input
                className={`input ${errors.passwordConfirm && 'is-danger'}`}
                type="password"
                name="passwordConfirm"
                ref={register({
                  validate: (value) => {
                    if (value === watch('password')) {
                      return true;
                    }
                    return 'Passwords do not match';
                  },
                })} />
              <span className="icon is-small is-left">
                <FontAwesomeIcon icon="lock" />
              </span>                
            </div>
            <p className="help is-danger">{errors.passwordConfirm && errors.passwordConfirm.message}</p>
          </div>
        </div>
      </div>
      <div className="control">
        <button
          type="submit"
          className="button is-primary">Set new password
        </button>
      </div>
    </form>
  );
};

const Confirmation = () => (
  <div>
    <div className="title-topper mt-70 mb-20" />
    <h1 className="title is-spaced">Reset Password Completed</h1>
    <p>You have successfully reset the password for your account</p>
    <br />
    <Link href="/login"><a className="button is-primary">Return to Login</a></Link>
    <br />
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
      <section className="hero">
        <div className="hero-body">
          <div className="container">
            <div className="columns is-centered">
              <div className="column is-7-tablet is-7-desktop is-7-widescreen">
                <div>
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
