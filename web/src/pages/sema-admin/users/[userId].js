import React, {useCallback, useEffect, useMemo, useState} from 'react';
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
import useAuthEffect from '../../../hooks/useAuthEffect';
import usePermission from "../../../hooks/usePermission";
import { gray600, blue900 } from '../../../../styles/_colors.module.scss';

const { clearAlert } = alertOperations;
const { fetchUser } = selectedUserOperations;
const { getInvitesBySender, resendInvite, revokeInviteAndHydrateUser } = invitationsOperations;

const UserDetailPage = () => {
  const { isSemaAdmin } = usePermission();
  const dispatch = useDispatch();
  const router = useRouter();
  const { alerts, auth, selectedUser, invitations } = useSelector((state) => ({
    alerts: state.alertsState,
    auth: state.authState,
    selectedUser: state.selectedUserState,
    invitations: state.invitationsState,
  }));
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { userId } = router.query;
  const { token } = auth;
  const { user, isFetching: isUserLoading } = selectedUser;
  const { data: invites, isFetching: isInvitesLoading, acceptedInvitationCount, pendingInvitationCount } = invitations;
  const { showAlert, alertType, alertLabel } = alerts;

  useAuthEffect(() => {
    dispatch(fetchUser(userId, token));
    dispatch(getInvitesBySender({ userId, page, perPage }, token));
  }, [userId, page, perPage]);

  const userStatus = useMemo(() => user ? getUserStatus(user) : '', [user]);
  const badgeColor = useMemo(() => getBadgeColor(userStatus), [userStatus]);

  const resendInvitation = async (email) => {
    await dispatch(resendInvite(email, token));
  };

  const revokeInvitation = async (invitationId, recipient) => {
    await dispatch(revokeInviteAndHydrateUser(invitationId, userId, token, recipient));
  };

  const getTotalInvitations = (type = 'table') => {
    switch (type) {
      case 'table':
        return acceptedInvitationCount + pendingInvitationCount
      case 'label':
        return isSemaAdmin() ? acceptedInvitationCount + pendingInvitationCount : user.inviteCount + acceptedInvitationCount + pendingInvitationCount;
      default:
        return acceptedInvitationCount + pendingInvitationCount
    }
  };

  useEffect(() => {
    if (showAlert === true) {
      dispatch(clearAlert());
    }
  }, [showAlert, dispatch]);

  const fetchData = useCallback(({ pageSize, pageIndex }) => {
    setPage(pageIndex + 1);
    setPerPage(pageSize);
  }, [setPage, setPerPage]);

  return (
    <>
      {
        isUserLoading || isInvitesLoading ? (
          <div className='loading' />
        ) : (
          <>
            <p className='my-15 is-size-6' style={{ color: gray600 }}>
              User Management
              <span style={{ color: blue900 }}> / {fullName(user)}</span>
            </p>
            <div className='column is-12 p-25 has-text-black has-background-white mb-20' style={{ borderRadius: 10 }}>
              <div className='is-flex p-10'>
                <Avatar
                  className="mr-10"
                  name={fullName(user)}
                  src={user?.avatarUrl || null}
                  size="50"
                  round
                  color={gray600}
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
                    <span className='tag mr-10 is-size-5 has-text-white' style={{ background: gray600 }}>{user?.inviteCount}</span>
                    <div>Invites Available</div>
                  </div>
                  <div className='is-flex is-align-items-center'>
                    <span className='tag mr-10 is-size-5 has-text-white' style={{ background: gray600 }}>{getTotalInvitations('label')}</span>
                    <div>Invites Used</div>
                  </div>
                </div>
              </div>
            </div>
            <div className='column is-8 p-0'>
              <InvitationsGrid
                  type='admin'
                  invites={invites}
                  totalInvites={getTotalInvitations()}
                  resendInvitation={resendInvitation}
                  revokeInvitation={revokeInvitation}
                  fetchData={fetchData}
                  page={page}
                  perPage={perPage}
                  isLoading={isInvitesLoading}
                />
            </div>
          </>
        )
      }
      <Toaster type={alertType} message={alertLabel} showAlert={showAlert} />
    </>
  )
};

export default withSemaAdmin(withLayout(UserDetailPage));
