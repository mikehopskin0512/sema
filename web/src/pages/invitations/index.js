import { CloseIcon } from '../../components/Icons';
import InputField from '../../components/inputs/InputField';
import SupportForm from '../../components/supportForm';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { useForm, Controller } from 'react-hook-form';
import { isEmpty } from "lodash";
import withLayout from '../../components/layout';
import Helmet, { InvitesHelmet } from '../../components/utils/Helmet';
import Toaster from '../../components/toaster';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import { invitationsOperations } from '../../state/features/invitations';
import { alertOperations } from '../../state/features/alerts';
import styles from './invitations.module.scss';
import InvitationsGrid from '../../components/invitationsGrid';
import { getCharCount } from '../../utils';
import * as analytics from '../../utils/analytics';
import Logo from '../../components/Logo';
import useAuthEffect from '../../hooks/useAuthEffect';

const { clearAlert } = alertOperations;
const { createInviteAndHydrateUser, getInvitesBySender, resendInvite, revokeInviteAndHydrateUser, trackSendInvite } = invitationsOperations;

const Invite = () => {
  const schema = yup.object().shape({
    email: yup
      .string()
      .email('Invalid email format')
      .required('Email is required'),
  });
  const dispatch = useDispatch();
  const defaultValues = {
    email: '',
  }
  const { handleSubmit, formState, reset, setError, control } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });
  const { errors } = formState;
  const { alerts, auth, invitations } = useSelector((state) => ({
    alerts: state.alertsState,
    auth: state.authState,
    invitations: state.invitationsState,
  }));
  const {user: { isSemaAdmin }} = auth;

  const [recipient, setRecipient] = useState("");
  const [tableHeader] = useState('is better with friends, invite yours 🙌');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const cardStyling = 'is-size-5 has-text-weight-semibold p-10 border-radius-4px'
  const { showAlert, alertType, alertLabel } = alerts;
  const { token, user } = auth;
  const { isFetching, acceptedInvitationCount, pendingInvitationCount } = invitations ?? []
  const { _id: userId, inviteCount = 0 } = user;
  const isInviteBtnDisabled = !isSemaAdmin && inviteCount <= 0;
  const [isSupportModalActive, setSupportModalActive] = useState(false);

  const onSubmit = async (data) => {
    if (isInviteBtnDisabled) {
      return;
    }
    // Build invitation data
    const { email } = data;
    const invitation = {
      recipient: email,
      sender: userId,
      inviteCount,
      isMagicLink: false
    };
    setRecipient(email);
    const response = await dispatch(createInviteAndHydrateUser(invitation, token));
    analytics.fireAmplitudeEvent(analytics.AMPLITUDE_EVENTS.CLICKED_SEND_INVITATION, { recipient: email });

    // send segment event tracking
    trackSendInvite(email, invitation.senderName, invitation.senderEmail, 'user');
    const isSent = response.status === 201;
    if (isSent) {
      reset(defaultValues);
    } else {
      setError("email", {
        type: "manual",
        message: response.data.message
      });
    }
  };

  const getTotalInvitations = (type = 'table') => {
    switch (type) {
      case 'table':
        return acceptedInvitationCount + pendingInvitationCount
      case 'label':
        return isSemaAdmin ? acceptedInvitationCount + pendingInvitationCount : inviteCount + acceptedInvitationCount + pendingInvitationCount;
      default:
        return acceptedInvitationCount + pendingInvitationCount
    }
  };

  useAuthEffect(() => {
    dispatch(getInvitesBySender({ userId, page, perPage}, token));
  }, [userId, page, perPage]);

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
    return null;
  };

  const fetchData = useCallback(({ pageSize, pageIndex }) => {
    setPage(pageIndex + 1);
    setPerPage(pageSize);
  }, [setPage, setPerPage]);

  return (
    <>
      <Helmet {...InvitesHelmet} />
      <Toaster type={alertType} message={alertLabel} showAlert={showAlert} />
      <SupportForm
        active={isSupportModalActive}
        closeForm={() => setSupportModalActive(false)}
      />
      <section className={clsx("hero mb-40", styles.container)}>
        <div>
          <div className="is-flex is-align-items-center is-justify-content-center mt-60 mb-30">
            <Logo shape="horizontal" width={100} height={34} />
            <p
              style={{ lineHeight: '26px' }}
              className={'title has-text-centered has-text-weight-semibold is-size-4 ml-8'}
              dangerouslySetInnerHTML={{ __html: `${tableHeader}` }}
            />
          </div>
          <div className="mb-5 mt-30 mx-3 columns">
            <div className={`box column mr-10 px-20 py-30`}>
              <span className={`${cardStyling} ${getCharCount(acceptedInvitationCount) > 1 ? '' : 'px-15'} has-background-primary has-text-white`}>
                {getTotalInvitations()}
              </span>
              <span className="has-text-weight-semibold ml-30">
                Total Invites
              </span>
            </div>
            <div className="box column mx-10 px-20 py-30">
              <span className={`${cardStyling} ${getCharCount(acceptedInvitationCount) > 1 ? '' : 'px-15'} has-background-success-dark has-text-white`}>
                {acceptedInvitationCount}
              </span>
              <span className="has-text-weight-semibold ml-15">
                Invites Accepted
              </span>
            </div>
            <div className="box column mx-10 px-20 py-30">
              <span className={`${cardStyling} ${getCharCount(pendingInvitationCount) > 1 ? '' : 'px-15'} has-background-grey-lighter`}>
                {pendingInvitationCount}
              </span>
              <span className="has-text-weight-semibold ml-15">
                Invites Pending
              </span>
            </div>
            <div className="box column ml-10 px-20 py-30 mb-24">
              <span className={`${cardStyling} ${getCharCount(isSemaAdmin ? 'ꝏ' : inviteCount) > 1 ? '' : 'px-15'} has-background-success`}>
                {isSemaAdmin ? 'ꝏ' : inviteCount}
              </span>
              <span className="has-text-weight-semibold ml-15">
                Invites Available
              </span>
            </div>
          </div>

          <div className="tile is-ancestor">
            <div className="tile is-parent is-vertical">
              <div className={clsx(styles['sema-tile'], styles['sema-is-child'], 'mb-0')}>
                {isInviteBtnDisabled && (
                  <div className="has-background-blue-50 has-text-blue-700 py-8 px-32 is-size-8">
                    <b>
                      You do not have any invitations left. Please contact{" "}
                        <span
                          onClick={() => setSupportModalActive(true)}
                          className="has-text-blue-700 is-clickable is-underlined"
                        >Support
                        </span>
                      {" "}to request more invites.
                    </b>
                  </div>
                )}
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className={clsx(
                    'has-background-gray-300 pt-16 px-12 pb-24',
                    isInviteBtnDisabled && 'has-background-gray-200')}>
                    <div className={`is-fullwidth px-20`}>
                      <div className="field is-flex-mobile is-flex-direction-column">
                        <label
                          className={clsx(
                            'label',
                            isInviteBtnDisabled && 'has-text-gray-600')
                          }>Who would you like to invite?
                        </label>
                        <div className={clsx(
                          'is-full-width is-flex',
                          styles['invite-form'])
                        }>
                          <Controller
                            control={control}
                            name='email'
                            render={({ field: { onChange, value } }) => (
                              <InputField
                                value={value}
                                onChange={onChange}
                                disabled={isInviteBtnDisabled}
                                placeholder="tony@starkindustries.com"
                                error={renderErrorMessage()}
                                iconRight={isInviteBtnDisabled ?
                                  null :
                                  <CloseIcon
                                    size="small"
                                    onClick={() => reset(defaultValues)}
                                  />
                                }
                              />
                            )}
                          />
                          <button
                            className={clsx(
                              'button is-primary has-text-centered has-text-white',
                              styles.formBtn
                            )}
                            type="submit"
                            disabled={isInviteBtnDisabled || errors?.email}
                          >
                            Send Invite
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className={clsx(styles['sema-tile'], styles['sema-is-child'])}>
                <InvitationsGrid
                  type='dashboard'
                  invites={invitations.data}
                  totalInvites={getTotalInvitations()}
                  resendInvitation={RESEND_INVITE}
                  revokeInvitation={revokeInvitation}
                  fetchData={fetchData}
                  page={page}
                  perPage={perPage}
                  isFetching={isFetching}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default withLayout(Invite);
