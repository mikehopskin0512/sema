import { useEffect, useState } from 'react';
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
import Helmet, { RegisterHelmet } from '../../components/utils/Helmet';

import { alertOperations } from '../../state/features/alerts';
import { authOperations } from '../../state/features/auth';
import { invitationsOperations } from '../../state/features/invitations';
import { PATHS } from '../../utils/constants';

const { clearAlert } = alertOperations;
const { registerAndAuthUser, partialUpdateUser } = authOperations;
const { fetchInvite, redeemInvite, trackRedeemedInvite } = invitationsOperations;

const InviteError = () => (
  <div className="columns is-centered">
    <div className="column">
      <h2 className="title is-size-5">
        Invalid invitation
      </h2>
      <p>Your invitation token is either expired or invalid. Please request a new invitation from your administrator.</p>
      <br />
      <Link href={PATHS.LOGIN}><a className="button is-black">Back to login</a></Link>
    </div>
  </div>
);

const RegistrationForm = (props) => {
  const dispatch = useDispatch();
  const { register, watch, handleSubmit, formState } = useForm();
  const { errors } = formState;

  const router = useRouter();
  const { token } = router.query;

  // Import state vars
  const { auth } = useSelector(
    (state) => ({
      auth: state.authState,
    }),
  );

  let identity = {};
  if (token) {
    ({ identity } = jwtDecode(token));
  }
  const {
    email: githubEmail, firstName, lastName, avatarUrl, emails,
  } = identity;
  const hasIdentity = Object.prototype.hasOwnProperty.call(identity, 'id') || false;

  const { invitation = {} } = props;
  const { token: inviteToken, recipient } = invitation;
  const { token: authToken, user, team: teamId } = auth;
  const { _id: userId } = user;

  // If Github login, use that primarily. Fallback to invite recipient.
  // However normal reg will have neither
  const initialEmail = githubEmail || recipient;

  const onSubmit = (data) => {
    const { username: email = '' } = data;
    if (inviteToken && authToken) {
      // User is redeeming invite, but already exists (likely on waitlist)
      dispatch(redeemInvite(inviteToken, authToken));
      dispatch(partialUpdateUser(userId, { isWaitlist: false }, authToken));
      router.push(teamId ? `${PATHS.DASHBOARD}/?teamId=${teamId}` : PATHS.DASHBOARD);
      trackRedeemedInvite(email);
    } else {
      // New user
      // If no invite, set to waitlist
      const isWaitlist = !inviteToken;
      const newUser = { ...user, ...data, avatarUrl, isWaitlist };
      if (identity) { newUser.identities = [identity]; }
      dispatch(registerAndAuthUser(newUser, invitation));
    }
  };

  const renderEmailList = (emails) => {
    if (emails.length) {
      emails = emails.sort((x, y) => (x === githubEmail ? -1 : y == githubEmail ? 1 : 0));
      return emails
        .filter((e) => e.search('users.noreply') === -1)
        .map((e, i) => <option key={`${e}-${i}`} value={e}>{e}</option>);
    }
  };

  return (
    <div className="columns is-justify-content-center pb-250">
      <Helmet {...RegisterHelmet} />
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
                href={`${PATHS.IDENTITIES}/${inviteToken || ''}`}>
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
            <p className="subtitle is-6">Please complete or verify your profile information below. We use this information to personalize your experience.</p>
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
                    defaultValue={firstName}
                    {
                      ...register('firstName',
                        {
                          required: 'First name is required',
                          maxLength: { value: 80, message: 'First name must be less than 80 characters' },
                        })
                    }
                  />
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
                    defaultValue={lastName}
                    {
                      ...register('lastName',
                        {
                          required: 'Last name is required',
                          maxLength: { value: 100, message: 'Last name must be less than 80 characters' },
                        })
                    }
                  />
                </div>
                <p className="help is-danger">{errors.lastName && errors.lastName.message}</p>
              </div>
            </div>
          </div>
          <div className="field">
            <label className="label">Email address</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select
                  className={`input ${errors.username && 'is-danger'}`}
                  type="email"
                  placeholder="tony@starkindustries.com"
                  defaultValue={initialEmail}
                  {
                    ...register('username',
                      {
                        required: 'Email is required',
                      })
                  }
                >
                  {renderEmailList(emails)}
                </select>
              </div>
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
                          {
                            ...register('password',
                              {
                                required: 'Password is required',
                                minLength: { value: 8, message: 'Minimum of 8 characters required' },
                                maxLength: { value: 20, message: 'Maximum of 20 characters allowed' },
                                pattern: { value: /(?=.*?[A-Za-z])(?=.*?[0-9])(?=.*[@$!%*#?&])/, message: 'Must contain 1 letter, 1 number, and 1 special character' },
                              })
                          }
                        />
                      </div>
                      <p className="help is-danger">{errors.password && errors.password.message}</p>
                    </div>
                    <div className="field">
                      <label className="label">Confirm password</label>
                      <div className="control">
                        <input
                          className={`input ${errors.passwordConfirm && 'is-danger'}`}
                          type="password"
                          {
                            ...register('passwordConfirm',
                              {
                                validate: (value) => {
                                  if (value === watch('password')) {
                                    return true;
                                  }
                                  return 'Passwords do not match';
                                },
                              })
                          }
                        />
                      </div>
                      <p className="help is-danger">{errors.passwordConfirm && errors.passwordConfirm.message}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          }
          <div className="control mt-20">
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
    <>
      <Toaster
        type={alertType}
        message={alertLabel}
        showAlert={showAlert} />
      <section className="hero is-min-fullheight">
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
    </>
  );
};

export default withLayout(Register);
