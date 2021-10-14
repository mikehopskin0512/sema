import React, {useEffect, useMemo} from 'react';
import { useRouter } from 'next/router';
import Avatar from 'react-avatar';
import withSemaAdmin from '../../../components/auth/withSemaAdmin';
import withLayout from '../../../components/layout/adminLayout';
import {useDispatch, useSelector} from 'react-redux';
import { selectedUserOperations } from '../../../state/features/selected-user';
import { fullName, getBadgeColor, getUserStatus } from '../../../utils';
import Badge from '../../../components/badge/badge';
import Toaster from '../../../components/toaster';
import { invitationsOperations } from '../../../state/features/invitations';
import { alertOperations } from '../../../state/features/alerts';
import InvitationsGrid from '../../../components/invitationsGrid';

const { clearAlert } = alertOperations;
const { fetchUser } = selectedUserOperations;
const { getInvitesBySender, resendInvite, revokeInviteAndHydrateUser } = invitationsOperations;

const UserDetailPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { alerts, auth, selectedUser, invitations } = useSelector((state) => ({
    alerts: state.alertsState,
    auth: state.authState,
    selectedUser: state.selectedUserState,
    invitations: state.invitationsState,
  }));

  const { userId } = router.query;
  const { token } = auth;
  const { user, isFetching: isUserLoading } = selectedUser;
  const { data: invites, isFetching: isInvitesLoading } = invitations;
  const { showAlert, alertType, alertLabel } = alerts;

  useEffect(() => {
    dispatch(fetchUser(userId, token));
    dispatch(getInvitesBySender(userId, token))
  }, []);

  const userStatus = useMemo(() => user ? getUserStatus(user) : '', [user]);
  const badgeColor = useMemo(() => getBadgeColor(userStatus), [userStatus]);

  const resendInvitation = async (email) => {
    await dispatch(resendInvite(email, token));
  };

  const revokeInvitation = async (invitationId, recipient) => {
    await dispatch(revokeInviteAndHydrateUser(invitationId, userId, token, recipient));
  };

  useEffect(() => {
    if (showAlert === true) {
      dispatch(clearAlert());
    }
  }, [showAlert, dispatch]);

  return (
    <>
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
              <InvitationsGrid type='admin' invites={invites} resendInvitation={resendInvitation} revokeInvitation={revokeInvitation} />
            </div>
          </>
        )
      }
      <Toaster type={alertType} message={alertLabel} showAlert={showAlert} />
    </>
  )
};

export default withSemaAdmin(withLayout(UserDetailPage));
