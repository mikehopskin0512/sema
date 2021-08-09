import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import { isEmpty } from "lodash";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import withLayout from '../../components/layout';
import Helmet, { InvitesHelmet } from '../../components/utils/Helmet';
import Toaster from '../../components/toaster';

import { invitationsOperations } from '../../state/features/invitations';
import { alertOperations } from '../../state/features/alerts';

import styles from './invitations.module.scss';
import InvitationsGrid from '../../components/invitationsGrid';


const { clearAlert } = alertOperations;
const { createInviteAndHydrateUser, getInvitesBySender, resendInvite, revokeInviteAndHydrateUser } = invitationsOperations;

const Invite = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, formState, reset, setError } = useForm();
  const { errors } = formState;
  // Import state vars
  const { alerts, auth, invitations } = useSelector((state) => ({
    alerts: state.alertsState,
    auth: state.authState,
    invitations: state.invitationsState,
  }));

  const [recipient, setRecipient] = useState("");
  const [tableHeader] = useState('Sema is better with friends. View your invites at a glance.');

  const { showAlert, alertType, alertLabel } = alerts;
  const { token, user, userVoiceToken } = auth;
  const { _id: userId, firstName, lastName, username: senderEmail, organizations = [], inviteCount = 0 } = user;
  const fullName = !isEmpty(firstName) || !isEmpty(lastName) ? `${firstName} ${lastName}` : null;
  const [currentOrg = {}] = organizations;
  const { id: orgId, orgName } = currentOrg;

  const onSubmit = async (data) => {
    if (inviteCount > 0 || user.isSemaAdmin) {
      const { email } = data;
      // Build invitation data
      const invitation = {
        recipient: email,
        orgId,
        orgName,
        sender: userId,
        senderName: fullName,
        senderEmail,
        inviteCount
      };
      // Send invite & reset form
      setRecipient(email);
      const response = await dispatch(createInviteAndHydrateUser(invitation, token));
      if (response.status === 201) {
        reset();
      } else {
        setError("email", {
          type: "manual",
          message: response.data.message
        });
      }
      await dispatch(getInvitesBySender(userId, token));
    }
  };
  useEffect(() => {
    dispatch(getInvitesBySender(userId, token));
  }, []);

  useEffect(() => {
    if (showAlert === true) {
      dispatch(clearAlert());
    }
  }, [showAlert, dispatch]);

  const RESEND_INVITE = async (email) => {
    await dispatch(resendInvite(email, token));
  };

  const revokeInvitation = async (invitationId, recipient) => {
    await dispatch(revokeInviteAndHydrateUser(invitationId, user._id, token, recipient));
  };

  const renderErrorMessage = () => {
    if (!isEmpty(errors)) {
      const error = errors.email.message;
      if (error.search("has already been invited by another user.") >= 0) {
        return <span>{error} <a onClick={() => RESEND_INVITE(recipient)}>Click here</a> to remind them.</span>
      }
      return error;
    }
  };

  return (
    <>
      <Helmet {...InvitesHelmet} />
      <Toaster type={alertType} message={alertLabel} showAlert={showAlert} />
      <section className={clsx("hero mb-40 pb-300", styles.container)}>
        {/* <div className="is-flex is-justify-content-space-between is-flex-wrap-wrap p-10">
          <p className="has-text-weight-semibold has-text-deep-black is-size-3">
            Invites
          </p>
        </div>
        <p className="is-size-6 has-text-deep-black px-10 mb-40">
          Sema is better with friends. View your invites at a glance
        </p> */}
        <div className={clsx('container', styles['styled-container'])}>
          <p
            className={
              'title has-text-centered has-text-weight-semibold is-size-4 mt-50'
            }
            dangerouslySetInnerHTML={{ __html: tableHeader }}
          />
          <p
            className={
              'subtitle has-text-centered has-text-weight-semibold is-size-4 is-size-5-mobile mb-20'
            }
          >
            <span className={clsx('tag is-success is-size-4 is-size-6-mobile m-1r')}>{user.isSemaAdmin ? 'ꝏ' : inviteCount}</span>
            Invites Available
          </p>
          <div className="tile is-ancestor">
            <div className="tile is-parent is-vertical">
              <div className={clsx(styles['sema-tile'], styles['sema-is-child'], 'mb-0')}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className={styles.tableForm}>
                    <div className={`is-fullwidth px-20`}>
                      <div className="field is-flex-mobile is-flex-direction-column">
                        <label className="label has-text-white">Username</label>
                        <div className={clsx("control has-icons-right is-inline-block mr-25", styles['invite-input'])}>
                          <input
                            className={clsx(
                              `input mr-25`,
                              errors?.email && 'is-danger',
                            )}
                            type="email"
                            placeholder="tony@starkindustries.com"
                            {
                            ...register(`email`,
                              {
                                required: 'Email is required',
                                pattern: {
                                  value: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
                                  message: 'Invaild email format'
                                },
                              })
                            }
                          />
                          <span className="icon is-small is-right is-clickable has-text-dark is-4" onClick={reset}>
                            <FontAwesomeIcon icon={faTimes} size="sm" />
                          </span>
                        </div>
                        <button
                          className={clsx(
                            'button is-white-gray has-text-centered',
                            styles.formBtn
                          )}
                          type="submit"
                          disabled={!user.isSemaAdmin && inviteCount <= 0}
                        >
                          Send Invite
                        </button>
                        <article className={clsx("message is-danger mt-20", isEmpty(errors) && "is-hidden", styles['invite-input'])}>
                          <div className="message-body">
                            {renderErrorMessage()}
                          </div>
                        </article>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className={clsx(styles['sema-tile'], styles['sema-is-child'])}>
                <InvitationsGrid type='dashboard' invites={invitations.data} resendInvitation={RESEND_INVITE} revokeInvitation={revokeInvitation} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default withLayout(Invite);
