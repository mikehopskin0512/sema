import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import Table from '../table';
import Badge from '../badge/badge';
import { fullName } from '../../utils';
import styles from './invitationsGrid.module.scss';
import { CloseIcon, UndoIcon } from '../Icons';
import { isInvitationPending } from '../../utils/invitations';
import { YEAR_MONTH_DAY_FORMAT } from '../../utils/constants/date';

const InvitationsGrid = ({
  type,
  invites,
  resendInvitation,
  revokeInvitation,
  page,
  perPage,
  isFetching,
  fetchData,
  totalInvites = 0,
}) => {
  const getHeaderClass = (accessor) => {
    switch (accessor) {
    case 'sender':
      return 'p-10';
    case 'recipient':
      return type === 'admin' ? 'p-10' : 'has-text-gray-700 has-background-white-50 p-15 pt-35';
    case 'isPending':
      return type === 'dashboard' ? 'has-text-gray-700 p-15 has-background-white-50 is-uppercase pt-35' : '';
    case 'sent':
      return type === 'admin' ? 'p-10' : 'has-text-gray-700 p-15 has-background-white-50 is-uppercase pt-35';
    case 'actions':
      return type === 'dashboard' ? `has-text-gray-700 has-background-white-50 is-uppercase px-4 py-15 pt-35` : '';
    default:
      return 'p-10';
    }
  };

  const columns = useMemo(
    () => [
      ...type === 'admin' ? [{
        Header: 'Sender',
        accessor: 'sender',
        className: getHeaderClass('sender'),
        Cell: ({ cell: { value } }) => (
          <div className="is-flex is-align-items-center">
            {value}
          </div>
        ),
      }] : [],
      {
        Header: 'USER',
        accessor: 'recipient',
        className: getHeaderClass('recipient'),
        Cell: ({ cell: { value } }) => (
          <div className='is-flex is-align-items-center is-underlined'>
            {value}
          </div>
        ),
      },
      {
        Header: 'Sent',
        accessor: 'sent',
        className: getHeaderClass('sent'),
        Cell: ({ cell: { value } }) => (
          <div className="is-flex is-align-items-center">
            { value }
          </div>
        ),
      },
      {
        Header: 'Status',
        accessor: 'isPending',
        className: getHeaderClass('isPending'),
        Cell: ({ cell: { value } }) => (type === 'admin' ? (
            <Badge label={value ? 'Pending Invite' : 'Accepted'} color={value.length ? 'link' : 'success'} />
          ) : (
            <div className="py-15">
            <span
              className={`has-text-black-bis tag has-text-weight-medium is-rounded ${value ? 'is-warning is-light' : 'is-success is-light'}`}
            >
              {value ? 'Pending Invite' : 'Accepted'}
            </span>
            </div>
          ))
      },
      ...type === 'admin' ? [{
        Header: 'Company Name',
        accessor: 'companyName',
        className: getHeaderClass('companyName'),
        Cell: ({ cell: { value } }) => (
          <div className="is-flex is-align-items-center">
            {value}
          </div>
        ),
      }, {
        Header: 'Cohort',
        accessor: 'cohort',
        className: getHeaderClass('cohort'),
        Cell: ({ cell: { value } }) => (
          <div className="is-flex is-align-items-center">
            {value}
          </div>
        ),
      }, {
        Header: 'Notes',
        accessor: 'notes',
        className: getHeaderClass('notes'),
        Cell: ({ cell: { value } }) => (
          <div className='is-flex is-align-items-center'>
            {value}
          </div>
        ),
      }] : [],
      {
        Header: 'Actions',
        accessor: 'actions',
        className: getHeaderClass('actions'),
        Cell: ({ cell: { value: el } }) => (
          <div className={`is-flex is-align-items-center ${styles['actions-cell']}`}>
            {
              isInvitationPending(el.redemptions, el.recipient) && (
                <>
                  <button className="button is-text outline-none pl-4" onClick={() => resendInvitation(el._id)}>
                    <UndoIcon size="small" />
                    <span className="ml-8">
                      Resend Invitation
                    </span>
                  </button>
                  <button className="button is-text outline-none pl-4" onClick={() => revokeInvitation(el._id, el.recipient)}>
                    <CloseIcon size="small" />
                    <span className="ml-8">
                      Revoke
                    </span>
                  </button>
                </>
              )
            }
          </div>
        ),
      },
    ],
    [resendInvitation, revokeInvitation, type],
  );

  const dataSource = useMemo(() => {
    return Array.isArray(invites) ? invites.map(item => {
      const userData = item?.redemptions?.[0]?.userId ?? {};
      return {
        isPending: item.redemptions.length === 0,
        recipient: isInvitationPending(item.redemptions)
          ? item.recipient
          : (
            <>
              {
                userData && userData.avatarUrl && (
                  <img src={userData && userData.avatarUrl} alt='avatar' width={32} height={32} className='mr-10' style={{ borderRadius: '100%' }} />
                )
              }
              {fullName(userData)}
            </>
          ),
        sender: (
          <>
            {item.senderName}
          </>
        ),
        sent: format(new Date(item.createdAt), YEAR_MONTH_DAY_FORMAT),
        actions: item,
      };
    }) : [];
  }, [invites, isFetching]);

  return (
    <div>
      <Table
        columns={columns}
        data={dataSource}
        empty={(
          <div className="is-flex is-align-content-center is-justify-content-center py-120 is-flex-direction-column">
            <img className={styles['no-data-img']} src="/img/social-graph.svg" />
            <div className={"subtitle has-text-centered mt-50 has-text-gray-500 is-size-5"}>
              You haven't invited anyone yet.
            </div>
          </div>
        )}
        pagination={{
          page,
          perPage,
          totalCount: totalInvites,
          fetchData,
          loading: isFetching
        }}
      />
    </div>
  );
};

InvitationsGrid.propTypes = {
  type: PropTypes.string.isRequired,
  invites: PropTypes.array.isRequired,
  resendInvitation: PropTypes.func.isRequired,
  revokeInvitation: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  perPage: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  isFetching: PropTypes.bool.isRequired
};

export default InvitationsGrid;
