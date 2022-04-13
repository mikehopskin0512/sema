import React, { useState } from 'react';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import { isEmpty } from 'lodash';
import { invitationsOperations } from '../../state/features/invitations';
import { useDispatch, useSelector } from 'react-redux';
import { fullName } from '../../utils';
import * as analytics from '../../utils/analytics';
import { CloseIcon } from '../Icons';
import { white50 } from '../../../styles/_colors.module.scss';

const { resendInvite, createInviteAndHydrateUser, trackSendInvite } = invitationsOperations;

const InviteForm = ({ onReload }) => {
  const dispatch = useDispatch();
  const { register, handleSubmit, formState, reset, setError, setValue } = useForm();
  const { errors } = formState;

  const { auth } = useSelector((state) => ({
    auth: state.authState,
  }));

  const { token, user } = auth;
  const [recipient, setRecipient] = useState("");
  const { _id: userId, username: senderEmail, organizations = [], inviteCount = 0} = user;
  const [currentOrg = {}] = organizations;
  const { id: orgId, orgName } = currentOrg;

  const renderErrorMessage = () => {
    if (!isEmpty(errors)) {
      const error = errors?.email?.message;
      if (error && error.search("has already been invited by another user.") >= 0) {
        return <span>{error} <a onClick={() => RESEND_INVITE(recipient)}>Click here</a> to remind them.</span>
      }
      return error;
    }
  };

  const RESEND_INVITE = async (email) => {
    await dispatch(resendInvite(email, token));
  };

  const onSubmit = async (data) => {
    const { email } = data;
    const invitation = {
      ...data,
      recipient: email,
      orgId,
      orgName,
      sender: userId,
      senderName: fullName(user),
      senderEmail,
      inviteCount
    };
    // Send invite & reset form
    setRecipient(email);
    analytics.fireAmplitudeEvent(analytics.AMPLITUDE_EVENTS.CLICKED_SEND_INVITATION, { recipient: email });
    const response = await dispatch(createInviteAndHydrateUser(invitation, token));

    if (response.status === 201) {
      reset();
      onReload();
    } else {
      setError("email", {
        type: "manual",
        message: response.data.message
      });
    }
  };

  const clearField = (name) => {
    setValue(name, '');
  };

  return (
    <div className="py-25 px-50" style={{ background: `${white50}` }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="field">
          <label className="label">Who would you like to invite?</label>
          <div className="">
            <div className="control has-icons-right mb-25">
              <input
                className={clsx(
                  `input mr-25 has-background-white`,
                  errors?.email && 'is-danger',
                )}
                type="email"
                placeholder="example@example.com"
                {
                  ...register(`email`,
                    {
                      required: 'Email is required',
                      pattern: {
                        value: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
                        message: 'Invalid email format'
                      },
                    })
                }
              />
              <span className="icon is-small is-right is-clickable has-text-dark" onClick={() => clearField('email')}>
                <CloseIcon size="small" />
              </span>
            </div>
            <div className="control has-icons-right mb-25">
              <input
                className={clsx(
                  `input mr-25 has-background-white`,
                  errors?.companyName && 'is-danger',
                )}
                type="text"
                placeholder="Company Name"
                {
                  ...register(`companyName`)
                }
              />
              <span className="icon is-small is-right is-clickable has-text-dark" onClick={() => clearField('companyName')}>
                <CloseIcon size="small" />
              </span>
            </div>
            <div className="control has-icons-right mb-25">
              <input
                className={clsx(
                  `input mr-25 has-background-white`,
                  errors?.cohort && 'is-danger',
                )}
                type="text"
                placeholder="Cohort"
                {
                  ...register(`cohort`)
                }
              />
              <span className="icon is-small is-right is-clickable has-text-dark" onClick={() => clearField('cohort')}>
                <CloseIcon size="small" />
              </span>
            </div>
            <div className="control has-icons-right mb-25">
              <textarea
                className={clsx(
                  `input mr-25 has-background-white is-height-auto`,
                  errors?.notes && 'is-danger',
                )}
                rows="4"
                placeholder="Notes"
                {
                  ...register(`notes`)
                }
              />
              <span className="icon is-small is-right is-clickable has-text-dark" onClick={() => clearField('notes')}>
                <CloseIcon size="small" />
              </span>
            </div>
            <div className="is-flex is-justify-content-flex-end">
              <button className="button has-background-black-900 has-text-white" type="submit">
                Send Invite
              </button>
            </div>
          </div>
          <article className={clsx("message is-danger mt-20", isEmpty(errors) && "is-hidden")} style={{ width: "80%" }}>
            <div className="message-body">
              {renderErrorMessage()}
            </div>
          </article>
        </div>
      </form>
    </div>
  )
};

export default InviteForm;
