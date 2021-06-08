import React, {useEffect, useMemo} from 'react';
import { useRouter } from 'next/router';
import Avatar from 'react-avatar';
import withSemaAdmin from '@/components/auth/withSemaAdmin';
import withLayout from '@/components/layout/adminLayout';
import {useDispatch, useSelector} from 'react-redux';
import { usersOperations } from '../../../state/features/users';
import { fullName, getBadgeColor, getUserStatus } from '../../../utils';
import Badge from '@/components/badge/badge';
import Table from '@/components/table';
import Toaster from '@/components/toaster';
import { invitationsOperations } from '../../../state/features/invitations';
import { alertOperations } from '../../../state/features/alerts';

const { clearAlert } = alertOperations;
const { fetchUser } = usersOperations;
const { getInvitesBySender, resendInvite, revokeInviteAndHydrateUser } = invitationsOperations;

const UserDetailPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { alerts, auth, users, invitations } = useSelector((state) => ({
    alerts: state.alertsState,
    auth: state.authState,
    users: state.usersState,
    invitations: state.invitationsState,
  }));

  const { userId } = router.query;
  const { token } = auth;
  const { user, isFetching: isUserLoading } = users;
  const { data: invites, isFetching: isInvitesLoading } = invitations;
  const { showAlert, alertType, alertLabel } = alerts;

  useEffect(() => {
    dispatch(fetchUser(userId, token));
    dispatch(getInvitesBySender(userId, token))
  }, []);

  const userStatus = useMemo(() => user ? getUserStatus(user) : '', [user]);
  const badgeColor = useMemo(() => getBadgeColor(userStatus), [userStatus]);

  const RESEND_INVITE = async (email) => {
    await dispatch(resendInvite(email, token));
  };

  useEffect(() => {
    if (showAlert === true) {
      dispatch(clearAlert());
    }
  }, [showAlert, dispatch]);

  const columns = useMemo(
    () => [
      {
        Header: 'User',
        accessor: 'recipient',
        className: 'p-10',
        Cell: ({ cell: { value } }) => (
          <div className='is-flex is-align-items-center'>
            { value }
          </div>
        ),
      },
      {
        Header: () => (
          <div className='is-flex'>
            <div className='mr-2'>Status</div>
          </div>
        ),
        accessor: 'isPending',
        Cell: ({ cell: { value } }) => (
          <Badge label={value ? 'Pending Invite' : 'Active'} color={value ? 'link' : 'success'} />
        ),
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ cell: { value: el } }) => (
          <div className='is-flex is-align-items-center py-10'>
            {
              el.isPending && (
                <>
                  <button className="button is-text outline-none has-no-border" onClick={() => RESEND_INVITE(el.recipient)}>Resend Invitation</button>
                  <button className="button is-text outline-none" onClick={() => dispatch(revokeInviteAndHydrateUser(el._id, userId, token, el.recipient))}>Revoke</button>
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
            <img src={item.user && item.user.avatarUrl} alt="avatar" width={32} height={32} className='mr-20' style={{ borderRadius: '100%' }}/>
            {fullName(item.user)}
          </>
        ),
      isPending: item.isPending,
      actions: item,
    })) : [];
  }, [invites]);

  return (
    <div className="is-full-height is-flex is-flex-direction-column p-25" style={{ background: '#f7f8fa' }}>
      {
        isUserLoading || isInvitesLoading ? (
          <div className='loading' />
        ) : (
          <>
            <p className='my-15 is-size-6' style={{ color: '#9198a4' }}>
              User Management
              <span style={{ color: '#203353' }}> / {fullName(user)}</span>
            </p>
            <div className='column is-12 p-25 has-text-black has-background-white mb-20' style={{ borderRadius: 10 }}>
              <div className='is-flex p-10'>
                <Avatar
                  className="mr-10"
                  name={fullName(user)}
                  src={user?.avatarUrl || null}
                  size="50"
                  round
                  color='#888888'
                  textSizeRatio={2.5}
                />
                <div className='mr-20'>
                  <div className='has-text-black has-text-weight-bold'>
                    { fullName(user) }
                  </div>
                  <div>
                    { user?.username }
                  </div>
                </div>
                <div className='is-size-8'>
                  <Badge label={userStatus} color={badgeColor} />
                </div>
              </div>
            </div>
            <div className='column is-8 p-25 has-text-black has-background-white mb-20' style={{ borderRadius: 10 }}>
              <div className='px-10 pb-10'>
                <div className='is-flex is-justify-content-space-between is-align-items-flex-end mb-10'>
                  <div className='has-text-black has-text-weight-bold is-size-6 mb-5'>Invites</div>
                  <div><a className="is-size-8" style={{ textDecoration: 'underline' }}>Edit</a></div>
                </div>
                <div className='is-flex'>
                  <div className='is-flex is-align-items-center mr-25'>
                    <span className='tag mr-10 is-size-5 has-text-white' style={{ background: '#888888' }}>{user?.inviteCount}</span>
                    <div>Invites Available</div>
                  </div>
                  <div className='is-flex is-align-items-center'>
                    <span className='tag mr-10 is-size-5 has-text-white' style={{ background: '#888888' }}>{invites?.length}</span>
                    <div>Invites Used</div>
                  </div>
                </div>
              </div>
            </div>
            <div className='column is-8 p-0'>
              <Table columns={columns} data={dataSource} className='column is-6 has-background-white p-0' />
            </div>
          </>
        )
      }
      <Toaster type={alertType} message={alertLabel} showAlert={showAlert} />
    </div>
  )
};

export default withSemaAdmin(withLayout(UserDetailPage));
