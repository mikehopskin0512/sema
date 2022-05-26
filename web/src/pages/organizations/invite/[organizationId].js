import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { organizationsOperations } from '../../../state/features/organizations[new]';
import { PATHS } from '../../../utils/constants';
import useLocalStorage from '../../../hooks/useLocalStorage';

const { inviteOrganizationUser, fetchOrganizationsOfUser } = organizationsOperations;

const PublicOrganizationInvite = () => {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => ({
    auth: state.authState,
    rolesState: state.rolesState,
  }));
  const [organizationIdInvitation, setOrganizationIdInvitation] = useLocalStorage('sema-organization-invite', '');
  const router = useRouter();
  const { organizationId } = router.query;
  const { user, token } = auth;

  const joinOrganization = async () => {
    await dispatch(inviteOrganizationUser(organizationId, token));
    await dispatch(fetchOrganizationsOfUser(token));
  };

  useEffect(() => {
    if (user && token) {
      joinOrganization();
      router.push(`${PATHS.ORGANIZATIONS._}/${organizationId}${PATHS.SETTINGS}`);
    } else {
      setOrganizationIdInvitation(organizationId);
      router.push('/login');
    }
  }, [organizationId, user, token, router]);

  return (
    ''
  );
};

export default PublicOrganizationInvite;
