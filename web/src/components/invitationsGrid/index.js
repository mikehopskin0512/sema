import React, {useMemo} from 'react';
import Table from '../table';
import Badge from '../badge/badge';
import {fullName} from '../../utils';
import styles from '../../pages/dashboard_old/dashboard.module.scss';

const InvitationsGrid = ({ type, invites, resendInvitation, revokeInvitation }) => {
  const columns = useMemo(
    () => [
      {
        Header: 'User',
        accessor: 'recipient',
        className: type === 'admin' ? 'p-10' : 'pl-150 has-background-sky-light',
        Cell: ({ cell: { value } }) => (
          <div className='is-flex is-align-items-center'>
            { value }
          </div>
        ),
      },
      {
        Header: 'Status',
        accessor: 'isPending',
        className: type === 'dashboard' ? 'has-background-sky-light' : '',
        Cell: ({ cell: { value } }) => type === 'admin' ? (
          <Badge label={value ? 'Pending Invite' : 'Accepted'} color={value ? 'link' : 'success'} />
        ) : (
          <div className='py-15'><span className={`tag is-rounded ${value ? 'is-primary' : 'is-success'}`}>{ value ? 'Pending Invite' : 'Accepted' }</span></div>
        ),
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        className: type === 'dashboard' ? 'pl-50 has-background-sky-light' : '',
        Cell: ({ cell: { value: el } }) => (
          <div className='is-flex is-align-items-center py-10'>
            {
              el.isPending && (
                <>
                  <button className="button is-text outline-none" onClick={() => resendInvitation(el.recipient)}>Resend Invitation</button>
                  <button className="button is-text outline-none" onClick={() => revokeInvitation(el._id, el.recipient)}>Revoke</button>
                </>
              )
            }
          </div>
        ),
      },
    ],
    [],
  );

  const dataSource = useMemo(() => {
    return Array.isArray(invites) ? invites.map(item => ({
      recipient: item.isPending
        ? item.recipient
        : (
          <>
            <img src={item.user && item.user.avatarUrl} alt="avatar" width={32} height={32} className='mr-10' style={{ borderRadius: '100%' }}/>
            {fullName(item.user)}
          </>
        ),
      isPending: item.isPending,
      actions: item,
    })) : [];
  }, [invites]);

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
      />
    </div>
  );
};

export default InvitationsGrid;
