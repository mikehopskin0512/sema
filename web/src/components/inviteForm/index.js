import React, { useState } from 'react';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useForm } from 'react-hook-form';
import { isEmpty } from 'lodash';
import { invitationsOperations } from '../../state/features/invitations';
import { useDispatch, useSelector } from 'react-redux';
import { fullName } from '../../utils';

const { resendInvite, createInviteAndHydrateUser } = invitationsOperations;

const InviteForm = ({ onReload }) => {
  const dispatch = useDispatch();
  const { register, handleSubmit, formState, reset, setError } = useForm();
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
      const error = errors.email.message;
      if (error.search("has already been invited by another user.") >= 0) {
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

  return (
    <div className="py-25 px-50" style={{ background: '#f2f1f4' }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="field">
          <label className="label">Who would you like to invite?</label>
          <div className="is-flex">
            <div className="control has-icons-right is-flex-grow-1 is-inline-block mr-25">
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
              <span className="icon is-small is-right is-clickable has-text-dark" onClick={reset}>
                <FontAwesomeIcon icon={faTimes} size="sm"/>
              </span>
            </div>
            <button className="button has-background-purple has-text-white" type="submit">
              Send Invite
            </button>
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
