import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faTimes } from '@fortawesome/free-solid-svg-icons';
import Table from '../table';
import Badge from '../badge/badge';
import { fullName } from '../../utils';
import styles from './invitationsGrid.module.scss';

const InvitationsGrid = ({ type, invites, resendInvitation, revokeInvitation }) => {

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);

  const getHeaderClass = (accessor) => {
    switch(accessor) {
      case 'sender':
        return 'p-10';
      case 'recipient':
        return type === 'admin' ? 'p-10' : 'has-text-gray-700 has-background-sky-light p-15 pt-35';
      case 'isPending':
        return type === 'dashboard' ? 'has-text-gray-700 p-15 has-background-sky-light is-uppercase pt-35' : '';
      case 'actions':
        return type === 'dashboard' ? `has-text-gray-700 p-15 has-background-sky-light is-uppercase pt-35 pl-150 ${styles.actionsHeader}` : '';
      default:
        return ''
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
            { value }
          </div>
        ),
      }] : [],
      {
        Header: 'USER',
        accessor: 'recipient',
        className: getHeaderClass('recipient'),
        Cell: ({ cell: { value } }) => (
          <div className='is-flex is-align-items-center is-underlined'>
            { value }
          </div>
        ),
      },
      {
        Header: 'Status',
        accessor: 'isPending',
        className: getHeaderClass('isPending'),
        Cell: ({ cell: { value } }) => (type === 'admin' ? (
          <Badge label={value ? 'Pending Invite' : 'Accepted'} color={value ? 'link' : 'success'} />
        ) : (
          <div className="py-15">
            <span 
              className={`has-text-black-bis tag has-text-weight-medium is-rounded ${value ? 'is-warning is-light' : 'is-success is-light'}`}
            >
              { value ? 'Pending Invite' : 'Active' }
            </span>
          </div>
        )),
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        className: getHeaderClass('actions'),
        Cell: ({ cell: { value: el } }) => (
          <div className='is-flex is-align-items-center py-10'>
            {
              el.isPending && (
                <>
                  <button className="button is-text outline-none" onClick={() => resendInvitation(el.recipient)}>
                    <FontAwesomeIcon icon={faUndo} className="mr-15"/>Resend Invitation
                  </button>
                  <button className="button is-text outline-none" onClick={() => revokeInvitation(el._id, el.recipient)}>
                    <FontAwesomeIcon icon={faTimes} className="mr-15"/>Revoke
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
    return Array.isArray(invites) ? invites.map(item => ({
      recipient: item.isPending
        ? item.recipient
        : (
          <>
            {
              item.user && item.user.avatarUrl && (
                <img src={item.user && item.user.avatarUrl} alt="avatar" width={32} height={32} className='mr-10' style={{ borderRadius: '100%' }}/>
              )
            }
            {fullName(item.user)}
          </>
        ),
      sender: (
        <>
          <img
            src={item.sender && item.sender.avatarUrl}
            alt="avatar"
            width={32}
            height={32}
            className="mr-10 is-radius-full"
          />
          {fullName(item.sender)}
        </>
      ),
      isPending: item.isPending,
      actions: item,
    })) : [];
  }, [invites]);

  const totalCount = dataSource.length

  const fetchData = useCallback(({ pageSize, pageIndex }) => {
    setPage(pageIndex + 1);
    setPerPage(pageSize);
  }, [setPage, setPerPage]);

  return (
    <div>
      <Table
        columns={columns}
        data={dataSource}
        empty={(
          <div className="is-flex is-align-content-center is-justify-content-center py-120 is-flex-direction-column">
            <img className={styles['no-data-img']} src="/img/empty-invite-table.png" />
            <div className={"subtitle has-text-centered mt-50 has-text-gray-dark is-size-5"}>
              You haven't invited anyone yet.
            </div>
          </div>
        )}
        pagination={{
          page,
            perPage,
            totalCount,
            fetchData,
            loading: false
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
};

export default InvitationsGrid;
