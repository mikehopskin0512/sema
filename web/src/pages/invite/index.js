import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import Loader from 'react-loader-spinner';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import withLayout from '../../components/layout';
import { isExtensionInstalled } from '../../utils/extension';
import Carousel from '../../components/utils/Carousel';
import Toaster from '../../components/toaster';

import { invitationsOperations } from '../../state/features/invitations';
import { alertOperations } from '../../state/features/alerts';

import styles from './invite.module.scss';

const EXTENSION_LINK = process.env.NEXT_PUBLIC_EXTENSION_LINK;

const { clearAlert } = alertOperations;
const { createInvite, getInvitesBySender, resendInvite, revokeInvite } = invitationsOperations;

const Invite = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, errors, reset, getValues } = useForm();

  // Import state vars
  const { alerts, auth, invitations } = useSelector((state) => ({
    alerts: state.alertsState,
    auth: state.authState,
    invitations: state.invitationsState,
  }));

  const [isPluginInstalled, togglePluginInstalled] = useState(false);
  const [title, setTitle] = useState('You&apos;re almost there!');
  const [buttonText, setButtonText] = useState('Install Chrome Plugin');
  const [body2, setBody2] = useState('Learn more about Sema while you wait...');
  const [tableHeader, setTableHeader] = useState('Sema is better with friends');
  const [loading, setLoading] = useState(false);
  const [isCardVisible, toggleCard] = useState(true);
  const [formError, setError] = useState("");
  const [recipient, setRecipient] = useState("");

  const { showAlert, alertType, alertLabel } = alerts;
  const { token, user } = auth;
  const { _id: userId, firstName, lastName, organizations = [], inviteCount = 0} = user;
  const fullName = `${firstName} ${lastName}`;
  const [currentOrg = {}] = organizations;
  const { id: orgId, orgName } = currentOrg;

  const onSubmit = async (data) => {
    if (inviteCount > 0) {    
      const { email } = data;
      // Build invitation data
      const invitation = {
        recipient: email,
        orgId,
        orgName,
        sender: userId,
        senderName: fullName,
        inviteCount
      };
      // Send invite & reset form
      setRecipient(email);
      await dispatch(createInvite(invitation, token));
      GET_INVITES_BY_USER();
      reset();
    }
  };

  const GET_INVITES_BY_USER = async () => {
    await dispatch(getInvitesBySender(userId, token));
  };

  useEffect(() => {
    if (isPluginInstalled) {
      setTitle('Install Complete');
      setButtonText('Continue');
      setBody2('Here&apos;s how to use Sema');
    }
  }, [isPluginInstalled]);

  useEffect(() => {
    let interval;
    interval = setInterval(async () => {
      if (isPluginInstalled) {
        clearInterval(interval);
      }
      setLoading(true);
      const res = await isExtensionInstalled();
      togglePluginInstalled(res);
      setLoading(false);
    }, 5000);

    GET_INVITES_BY_USER();
  }, []);

  useEffect(() => {
    if (invitations.error && typeof invitations.error === "string") {
      setError(invitations.error);
    }
  }, [invitations]);

  useEffect(() => {
    if (showAlert === true) {
      dispatch(clearAlert());
    }
  }, [showAlert, dispatch]);

  const RESEND_INVITE = async (email) => {
    await dispatch(resendInvite(email, token));
  };

  const REVOKE_INVITE = async (id, recipient) => {
    await dispatch(revokeInvite(id, userId, token, recipient));
  }

  const buttonAction = () => {
    if (isPluginInstalled) {
      toggleCard(false);
      return;
    }

    window.open(EXTENSION_LINK, '_blank');
  };

  const renderIcon = () => {
    if (!isPluginInstalled) {
      return (
        <div className="mb-50">
          <Loader type="Grid" color="#0081A7" height={40} width={40} />
          <p>Searching for plugin...</p>
        </div>
      );
    }
    return (
      <>
        <div className="mb-50">
          <FontAwesomeIcon
            icon={faCheckCircle}
            size="4x"
            className="has-text-primary"
          />
        </div>
      </>
    );
  };

  const renderErrorMessage = () => {
    console.log(formError)
    if (formError) {
      if (formError.search("has already been invited by another user.") >= 0) {
        // return formError;
        return <span>{formError} <a onClick={() => RESEND_INVITE(recipient)}>Click here</a> to remind them.</span>
      }
      return formError;
    }
  };

  return (
    <>
      <Toaster type={alertType} message={alertLabel} showAlert={showAlert} />
      <section className={clsx("hero pb-50", styles.container)}>
        <div className="hero-body">
          <div className={clsx('container', styles['styled-container'])}>
            <p className={'title has-text-centered is-size-1 m-15 mb-25'}>
                    Welcome to Sema!
                  </p>
            <PluginStateCard
              title={title}
              buttonText={buttonText}
              loading={loading}
              isCardVisible={isCardVisible}
              buttonAction={buttonAction}
              renderIcon={renderIcon}
            />
          </div>
        </div>
      </section>
      <section className="hero background-foggy-white pt-50">
        <div className="hero-body">
          <div className={clsx('container', styles['styled-container'])}>
            <p
              className={
                'title has-text-centered has-text-weight-semibold is-size-4'
              }
              dangerouslySetInnerHTML={{ __html: tableHeader }}
            />
            <p
              className={
                'subtitle has-text-centered has-text-weight-semibold is-size-4 mb-20'
                }
            >
              <span class={clsx('tag is-success is-size-4 m-1r')}>{inviteCount}</span>
              Invites Available
            </p>
            <div className="tile is-ancestor">
              <div className="tile is-parent is-vertical">
                <div className={clsx('tile is-child mb-0')}>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.tableForm}>
                      <div className={`is-fullwidth px-20`}>
                        <div class="field">
                          <label class="label has-text-white">Username</label>
                          <div class="control has-icons-right is-inline-block mr-25" style={{ width: '80%' }}>
                            <input
                              className={clsx(
                                `input mr-25`,
                                errors.email && 'is-danger',
                              )}
                              type="email"
                              placeholder="tony@starkindustries.com"
                              name="email"
                              ref={register({
                                required: 'Email is required',
                                pattern: {
                                  value: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
                                  message: 'Invaild email format',
                                },
                              })}
                            />
                            <span class="icon is-small is-right is-clickable has-text-dark" onClick={reset}>
                              <FontAwesomeIcon  icon={faTimes} size="s" />
                            </span>
                          </div>
                            <button
                              className={clsx(
                                'button is-white',
                                styles.formBtn
                              )}
                              type="submit"
                              disabled={inviteCount <= 0}
                            >
                              Send Invite
                            </button>
                            <article className={clsx("message is-danger mt-20", !formError && "is-hidden")} style={{ width: "80%"}}>
                              <div className="message-body">
                                {renderErrorMessage()}
                              </div>
                            </article>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div className={'tile is-child'}>
                  <InvitationTable invitations={invitations.data} RESEND_INVITE={RESEND_INVITE} REVOKE_INVITE={REVOKE_INVITE} />
                </div>
                <PromotionBoard />
              </div>
            </div>
          </div>
        </div>
        <ContactUs />
      </section>
    </>
  );
};

const PluginStateCard = ({
  title,
  buttonText,
  loading,
  isCardVisible,
  buttonAction,
  renderIcon,
}) => {
  return (
    <div className={clsx(!isCardVisible && "remove")}>
      <article
        className={'notification has-background-white has-text-centered p-50 colored-shadow'}
      >
        <p
          className={'title is-size-3 mt-15'}
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <p className={'subtitle px-120 py-20'}>
          The Sema Chrome Plugin allows us to modify the Github commenting UI
          and supercharge your code review workflow
        </p>
        {renderIcon()}
        <button
          type="button"
          className="button is-primary"
          onClick={buttonAction}
        >
          {buttonText}
        </button>
      </article>
    </div>
  );
};

const InvitationTable = ({ invitations, RESEND_INVITE, REVOKE_INVITE }) => {
  return (
    <table className={clsx('table is-fullwidth shadow', styles.table)}>
      <thead>
        <tr>
          <th>User</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {invitations?.length ? 
          invitations.map((el) => {
            return (
              <tr>
                <td>{el.recipient}</td>
                <td>
                  {el.isPending ? (
                    <span class={clsx('tag is-primary', styles.tag)}>
                      Pending Invite
                    </span>
                  ) : (
                    <span class={clsx('tag is-success', styles.tag)}>
                      Active
                    </span>
                  )}
                </td>
                <td>
                  <button class="button is-text" onClick={() => RESEND_INVITE(el.recipient)}>Resend Invitation</button>
                  <button class="button is-text" onClick={() => REVOKE_INVITE(el._id, el.recipient)}>Revoke</button>{' '}
                </td>
              </tr>
            );
          }) : <tr>
                  <td colSpan="3" >
                    <div className="is-flex is-align-content-center is-justify-content-center py-120 is-flex-direction-column">
                    <img className={styles['no-data-img']} src="/img/empty-invite-table.png"/>
                    <div className={"subtitle has-text-centered mt-50 has-text-grey-light is-size-5"}>
                      You haven't invited anyone yet.
                    </div>
                    </div>
                  </td>
                </tr>}
      </tbody>
    </table>
  );
};

const PromotionBoard = () => {
  const [heading,] = useState('Learn more about Sema while you wait...');

  return (
    <>
      <p
        className={clsx(
          'title has-text-centered has-text-weight-semibold is-size-4 mt-120 mb-50'
          // styles.tableHeader
        )}
        dangerouslySetInnerHTML={{
          __html: heading,
        }}
      />
      <Carousel />
    </>
  );
};

const ContactUs = () => {
  return (
    <div className="mt-20 py-50 px-120 columns has-background-primary is-centered is-vcentered">
      <div className="column is-6">
        <div className="title has-text-white is-size-4 has-text-weight-semibold">We want to hear from you</div>
        <div className="subtitle has-text-white is-size-6">Please share your thoughts with us so we can continue to craft an amazing developer experience</div>
      </div>
      <div className="column is-2-widescreen is-offset-1 is-2-tablet">
        <a href="mailto:feedback@semasoftware.com?subject=Product Feedback" className="button is-white has-text-primary is-medium is-fullwidth">Email</a> 
      </div>
      <div className="column is-2-widescreen is-2-tablet">
        <button className="button is-white is-medium is-fullwidth has-text-primary">Idea Board</button>
      </div>
    </div>
  )
};

export default withLayout(Invite);
