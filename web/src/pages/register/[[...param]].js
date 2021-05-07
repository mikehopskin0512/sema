import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import jwtDecode from 'jwt-decode';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';

import Toaster from '../../components/toaster';
import withLayout from '../../components/layout';

import { alertOperations } from '../../state/features/alerts';
import { authOperations } from '../../state/features/auth';
import { invitationsOperations } from '../../state/features/invitations';

const { clearAlert } = alertOperations;
const { registerUser } = authOperations;
const { fetchInvite } = invitationsOperations;

const InviteError = () => (
  <div className="columns is-centered">
    <div className="column">
      <h2 className="title is-size-5">
        Invalid invitation
      </h2>
      <p>Your invitation token is either expired or invalid. Please request a new invitation from your administrator.</p>
      <br />
      <Link href="/login"><a className="button is-black">Back to login</a></Link>
    </div>
  </div>
);

const RegistrationForm = (props) => {
  const dispatch = useDispatch();
  const { register, watch, handleSubmit, errors } = useForm();

  const router = useRouter();
  const { token } = router.query;

  let identity = {};
  if (token) {
    ({ identity } = jwtDecode(token));
  }
  const { email: githubEmail, firstName, lastName, avatarUrl } = identity;
  const hasIdentity = Object.prototype.hasOwnProperty.call(identity, 'id') || false;

  const { invitation = {} } = props;
  const { token: inviteToken, recipient } = invitation;

  // If Github login, use that primarily. Fallback to invite recipient.
  // However normal reg will have neither
  const initialEmail = githubEmail || recipient;

  const onSubmit = (data) => {
    const user = { ...data, avatarUrl };
    if (identity) { user.identities = [identity]; }
    dispatch(registerUser(user, invitation));
  };

  return (
    <div className="columns">
      <div className="column is-9">
        <div className="title-topper mt-70 mb-20" />
        {(!hasIdentity) ? (
          <div>
            <h1 className="title is-4 is-spaced">Sign Up with your GitHub account</h1>
            <p className="subtitle is-6">Nulla tincidunt consequat tortor ultricies iaculis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>
            <div className="field">
              <a
                type="button"
                className="button is-github"
                href={`/api/identities/github/${inviteToken || ''}`}>
                <span className="icon">
                  <FontAwesomeIcon icon={['fab', 'github']} />
                </span>
                <span>Sign up with GitHub</span>
              </a>
            </div>
            {/* <div className="is-divider" data-content="OR" />
            <h2 className="title is-4 is-spaced">Or sign up with your email</h2>
            <p className="subtitle is-6">Nulla tincidunt consequat tortor ultricies iaculis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>      */}
          </div>
        ) : (
          <div>
            <h1 className="title is-4 is-spaced">Complete your profile information</h1>
            <p className="subtitle is-6">Nulla tincidunt consequat tortor ultricies iaculis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>     
          </div>
        )}
        <form className="mt-20" onSubmit={handleSubmit(onSubmit)}>
          <div className="field is-horizontal">
            <div className="field-body">
              <div className="field">
                <label className="label">First name</label>
                <div className="control">
                  <input
                    className={`input ${errors.firstName && 'is-danger'}`}
                    type="text"
                    placeholder="Tony"
                    name="firstName"
                    defaultValue={firstName}
                    ref={register({
                      required: 'First name is required',
                      maxLength:
                        { value: 80, message: 'First name must be less than 80 characters' },
                    })} />
                </div>
                <p className="help is-danger">{errors.firstName && errors.firstName.message}</p>
              </div>
              <div className="field">
                <label className="label">Last name</label>
                <div className="control">
                  <input
                    className={`input ${errors.lastName && 'is-danger'}`}
                    type="text"
                    placeholder="Stark"
                    name="lastName"
                    defaultValue={lastName}
                    ref={register({
                      required: 'Last name is required',
                      maxLength:
                        { value: 100, message: 'Last name must be less than 80 characters' },
                    })} />
                </div>
                <p className="help is-danger">{errors.lastName && errors.lastName.message}</p>
              </div>
            </div>
          </div>
          <div className="field">
            <label className="label">Job title</label>
            <div className="control">
              <input
                className={`input ${errors.jobTitle && 'is-danger'}`}
                type="text"
                placeholder="Job title"
                name="jobTitle"
                ref={register({ required: 'Job title is required' })} />
            </div>
            <p className="help is-danger">{errors.jobTitle && errors.jobTitle.message}</p>
          </div>
          <div className="field">
            <label className="label">Business email</label>
            <div className="control">
              <input
                className={`input ${errors.username && 'is-danger'}`}
                type="email"
                placeholder="tony@starkindustries.com"
                name="username"
                defaultValue={initialEmail}
                ref={register({
                  required: 'Email is required',
                  pattern:
                    { value:/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i, message: 'Invaild email format' },
                })} />
            </div>
            <p className="help is-danger">{errors.username && errors.username.message}</p>
          </div>
          { // Hide password field if identity (Github) is present
            (_.isEmpty(identity)) && (
              <div>
                <div className="field is-horizontal">
                  <div className="field-body">
                    <div className="field">
                      <label className="label">Password</label>
                      <div className="control">
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
                      </div>
                      <p className="help is-danger">{errors.password && errors.password.message}</p>
                    </div>
                    <div className="field">
                      <label className="label">Confirm password</label>
                      <div className="control">
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
                      </div>
                      <p className="help is-danger">{errors.passwordConfirm && errors.passwordConfirm.message}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          }
          <div className="field">
            <label className="checkbox">
              <input
                type="checkbox"
                name="terms"
                ref={register({ required: 'You must accept terms' })} />
              <span className="is-size-6">
                &nbsp;&nbsp;By selecting the checkbox you agree to the <a href="#">terms & conditions</a>
              </span>
              <p className="help is-danger">{errors.terms && errors.terms.message}</p>
            </label>
          </div>
          <div className="control">
            <button
              type="submit"
              className="button is-black">Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Register = () => {
  const dispatch = useDispatch();

  const router = useRouter();
  const { param = [] } = router.query;

  // Import state vars
  const { alerts, invitations } = useSelector(
    (state) => ({
      alerts: state.alertsState,
      invitations: state.invitationsState,
    }),
  );

  const { showAlert, alertType, alertLabel } = alerts;
  const { data: invitation, isFetching } = invitations;

  // Check for updated state in selectedTag
  useEffect(() => {
    if (showAlert === true) {
      dispatch(clearAlert());
    }
  }, [showAlert, dispatch]);

  const [inviteToken] = param;

  // Check invite if in params
  useEffect(() => {
    if (inviteToken) {
      dispatch(fetchInvite(inviteToken));
    }
  }, [inviteToken, dispatch]);

  // If no invite in params, register as usual. If invite token, check to see if valid
  const validInvite =
    (param.length === 0) ||
    (invitation &&
    Object.prototype.hasOwnProperty.call(invitation, '_id'));

  // Loading
  if (isFetching) {
    return (
      <div>
        <h1 className="loading">Loading...</h1>
      </div>
    );
  }

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
                {(!validInvite)
                  ? <InviteError />
                  : <RegistrationForm invitation={invitation} />}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

RegistrationForm.propTypes = {
  invitation: PropTypes.object,
};

RegistrationForm.defaultProps = {
  invitation: {},
};

export default withLayout(Register);
