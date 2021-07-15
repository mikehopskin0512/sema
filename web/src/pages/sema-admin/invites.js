import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import withLayout from '../../components/layout/adminLayout';
import { invitationsOperations } from '../../state/features/invitations';
import SearchInput from '../../components/admin/searchInput';
import InviteForm from '../../components/inviteForm';
import useDebounce from '../../hooks/useDebounce';
import Toaster from '../../components/toaster';
import { alertOperations } from '../../state/features/alerts';
import FilterTabs from '../../components/admin/filterTabs';
import Helmet, { InvitesHelmet } from '../../components/utils/Helmet';
import InvitationsGrid from '../../components/invitationsGrid';

const { clearAlert } = alertOperations;
const { getInvitesBySender, resendInvite, revokeInviteAndHydrateUser } = invitationsOperations;

const tabOptions = [
  {
    label: 'Your Invites',
    value: 'your_invites'
  },
  {
    label: 'All Invites',
    value: 'all_invites',
  },
];

const InvitesPage = () => {
  const dispatch = useDispatch();
  const { alerts, auth, invitations } = useSelector((state) => ({
    alerts: state.alertsState,
    auth: state.authState,
    invitations: state.invitationsState,
  }));

  const { token, user } = auth;
  const [category, setCategory] = useState('your_invites');
  const [searchTerm, setSearchTerm] = useState('');
  const debounceSearchTerm = useDebounce(searchTerm);
  const { showAlert, alertType, alertLabel } = alerts;
  const { isFetching, data: invites } = invitations;

  useEffect(() => {
    dispatch(getInvitesBySender(user._id, token))
  }, []);

  const getInvites = () => {
    if (category === 'your_invites') {
      dispatch(getInvitesBySender(user._id, token, debounceSearchTerm))
    } else {
      dispatch(getInvitesBySender(undefined, token, debounceSearchTerm))
    }
  };

  useEffect(() => {
    getInvites();
  }, [category, debounceSearchTerm]);

  useEffect(() => {
    if (showAlert === true) {
      dispatch(clearAlert());
    }
  }, [showAlert, dispatch]);

  const resendInvitation = async (email) => {
    await dispatch(resendInvite(email, token));
  };

  const revokeInvitation = async (invitationId, recipient) => {
    await dispatch(revokeInviteAndHydrateUser(invitationId, user._id, token, recipient));
  };

  if (isFetching) {
    return (
      <div className='loading' />
    );
  }

  return (
    <div className="is-fullheight is-flex is-flex-direction-column px-25 py-25 background-gray-white">
      <Helmet {...InvitesHelmet} />
      <h1 className='has-text-black has-text-weight-bold is-size-3'>Invites</h1>
      <p className='mb-15 is-size-6 text-gray-light'>Sema is better with friends. View your invites at a glance</p>
      <div className='p-20 is-flex-grow-1 has-background-white' style={{ borderRadius: 10 }}>
        <div className='mb-20'>
          <InviteForm onReload={getInvites} />
        </div>
        <div className='is-flex is-justify-content-space-between mb-10'>
          <FilterTabs tabs={tabOptions} value={category} onChange={setCategory} />
          <SearchInput value={searchTerm} onChange={setSearchTerm} />
        </div>
        <InvitationsGrid type='admin' invites={invites} resendInvitation={resendInvitation} revokeInvitation={revokeInvitation} />
      </div>
      <Toaster type={alertType} message={alertLabel} showAlert={showAlert} />
    </div>
  );
};

export default withLayout(InvitesPage);
