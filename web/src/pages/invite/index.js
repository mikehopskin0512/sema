import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import Loader from 'react-loader-spinner';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import withLayout from '../../components/layout';
import { isExtensionInstalled } from '../../utils/extension';
import { invitationsOperations } from '../../state/features/invitations';
import Carousel from '../../components/utils/Carousel';

import styles from './invite.module.scss';

const EXTENSION_LINK = process.env.NEXT_PUBLIC_EXTENSION_ID;

const { createInvite, getInvitesBySender } = invitationsOperations;

const Invite = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, errors, reset } = useForm();

  // Import state vars
  const { alerts, auth, invitations } = useSelector((state) => ({
    alerts: state.alertsState,
    auth: state.authState,
    invitations: state.invitationsState,
  }));

  const [isPluginInstalled, togglePluginInstalled] = useState(false);
  const [title, setTitle] = useState('You&apos;re almost there!');
  const [buttonText, setButtonText] = useState('Install Chrome Package');
  const [body2, setBody2] = useState('Learn more about Sema while you wait...');
  const [tableHeader, setTableHeader] = useState('Sema is better with friends');
  const [loading, setLoading] = useState(false);
  const [isCardVisible, toggleCard] = useState(true);

  const { showAlert, alertType, alertLabel } = alerts;
  const { token, user } = auth;
  const { _id: userId, firstName, lastName, organizations = [] } = user;
  const fullName = `${firstName} ${lastName}`;
  const [currentOrg = {}] = organizations;
  const { id: orgId, orgName } = currentOrg;

  const onSubmit = async (data) => {
    const { email } = data;
    // Build invitation data
    const invitation = {
      recipient: email,
      orgId,
      orgName,
      sender: userId,
      senderName: fullName,
    };

    // Send invite & reset form
    await dispatch(createInvite(invitation, token));
    GET_INVITES_BY_USER();
    reset();
  };

  const GET_INVITES_BY_USER = async () => {
    await dispatch(getInvitesBySender(userId, token));
  };

  useEffect(() => {
    if (isPluginInstalled) {
      setTitle('Install Complete');
      setButtonText('Done');
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
    }, 30000);

    GET_INVITES_BY_USER();
  }, []);

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
          <Loader type="TailSpin" color="#00BFFF" height={80} width={80} />
          <p>Searching for plugin...</p>
        </div>
      );
    }
    return (
      <>
        <div className="mb-50">
          <FontAwesomeIcon
            icon={faCheckCircle}
            size="6x"
          />
          <p>Extension Installed!</p>
        </div>
      </>
    );
  };

  return (
    <>
      <section className="hero">
        <div className="hero-body">
          <div className={clsx('container', styles['styled-container'])}>
            <div className="tile is-ancestor">
              <div className="tile is-parent">
                <article className="tile is-child has-text-centered">
                  <p className={'title is-size-1 mb-15'}>
                    Welcome to Sema!
                  </p>
                </article>
              </div>
            </div>
            <PluginStateCard
              title={title}
              buttonText={buttonText}
              loading={loading}
              isCardVisible={isCardVisible}
              buttonAction={buttonAction}
              renderIcon={renderIcon}
            />
            <p
              className={
                'title has-text-centered has-text-weight-semibold is-size-4 mt-120'
              }
              dangerouslySetInnerHTML={{ __html: tableHeader }}
            />
            <p
              className={
                'subtitle has-text-centered has-text-weight-semibold is-size-4 mb-20'
                }
            >
              <span class={clsx('tag is-success is-size-4 m-1r')}>2</span>
              Invites Available
            </p>
            <div className="tile is-ancestor">
              <div className="tile is-parent is-vertical">
                <div className={clsx('tile is-child mb-0')}>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="tile">
                      <div className={clsx('tile is-parent', styles.tableForm)}>
                        <div
                          className={`tile is-child is-12 px-20`}
                        >
                          <div class="field">
                            <label class="label has-text-white">Username</label>
                            <div class="control has-icons-left has-icons-right">
                              <input
                                className={clsx(
                                  `input`,
                                  errors.email && 'is-danger'
                                )}
                                type="email"
                                placeholder="juandelacruz@example.com"
                                name="email"
                                ref={register({
                                  required: 'Email is required',
                                  pattern: {
                                    value: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
                                    message: 'Invaild email format',
                                  },
                                })}
                                style={{ width: '80%', marginRight: 25 }}
                              />
                              <button
                                className={clsx(
                                  'button is-white',
                                  styles.formBtn
                                )}
                                type="submit"
                              >
                                Send Invite
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div className={'tile is-child'}>
                  <InvitationTable invitations={invitations.data} />
                </div>
                <PromotionBoard />
              </div>
            </div>
          </div>
        </div>
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
    <div className={clsx('tile is-ancestor', !isCardVisible && "remove")}>
      <div className="tile is-parent">
        <article
          className={'tile is-child notification has-background-white has-text-centered p-50'}
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
            className="button has-background-black has-text-white"
            onClick={buttonAction}
          >
            {buttonText}
          </button>
        </article>
      </div>
    </div>
  );
};

const InvitationTable = ({ invitations }) => {
  return (
    <table className={clsx('table is-fullwidth', styles.table)}>
      <thead>
        <tr>
          <th>User</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {invitations?.length &&
          invitations.map((el) => {
            return (
              <tr>
                <td>{el.recipient}</td>
                <td>
                  {el.isPending ? (
                    <span class={clsx('tag is-info', styles.tag)}>
                      Pending Invite
                    </span>
                  ) : (
                    <span class={clsx('tag is-success', styles.tag)}>
                      Active
                    </span>
                  )}
                </td>
                <td>
                  <button class="button is-text">Resend Invitation</button>
                  <button class="button is-text">Revoke</button>{' '}
                </td>
              </tr>
            );
          })}
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

export default withLayout(Invite);