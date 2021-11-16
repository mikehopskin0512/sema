import React, { useCallback, useEffect, useState } from 'react';
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
import ExportButton from '../../components/admin/exportButton';
import useAuthEffect from '../../hooks/useAuthEffect';

const { clearAlert } = alertOperations;
const { getInvitesBySender, resendInvite, revokeInviteAndHydrateUser, exportInvites } = invitationsOperations;

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
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const debounceSearchTerm = useDebounce(searchTerm);
  const { showAlert, alertType, alertLabel } = alerts;
  const { isFetching, data: invites, acceptedInvitationCount, pendingInvitationCount} = invitations;

  useAuthEffect(() => {
    dispatch(getInvitesBySender({ userId: user._id, page, perPage }, token));
  }, [user._id]);

  const getInvites = useCallback(() => {
    if (category === 'your_invites') {
      dispatch(getInvitesBySender({ userId: user._id, search: debounceSearchTerm, page, perPage }, token));
    } else {
      dispatch(getInvitesBySender({ userId: undefined, search: debounceSearchTerm, page, perPage }, token));
    }
  }, [category, debounceSearchTerm, dispatch, token, user._id, page, perPage]);

  useAuthEffect(() => {
    getInvites();
  }, [category, debounceSearchTerm, getInvites, page, perPage]);

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

  const handleExport = () => {
    exportInvites({
      senderId: category === 'your_invites' ? user._id : undefined,
      search: debounceSearchTerm,
    });
  };

  const getTotalInvitations = (type = 'table') => {
    switch (type) {
      case 'table':
        return acceptedInvitationCount + pendingInvitationCount
      case 'label':
        return user.isSemaAdmin ? acceptedInvitationCount + pendingInvitationCount : inviteCount + acceptedInvitationCount + pendingInvitationCount;
      default:
        return acceptedInvitationCount + pendingInvitationCount
    }
  };

  const fetchData = useCallback(({ pageSize, pageIndex }) => {
    setPage(pageIndex + 1);
    setPerPage(pageSize);
  }, [setPage, setPerPage]);

  if (isFetching) {
    return (
      <div className='loading' />
    );
  }

  return (
    <>
      <Helmet {...InvitesHelmet} />
      <h1 className='has-text-black has-text-weight-bold is-size-3'>Invites</h1>
      <p className='mb-15 is-size-6 text-gray-light'>Sema is better with friends. View your invites at a glance</p>
      <div className='p-20 is-flex-grow-1 has-background-white' style={{ borderRadius: 10 }}>
        <div className='mb-20'>
          <InviteForm onReload={getInvites} />
        </div>
        <div className='is-flex is-justify-content-space-between mb-10'>
          <FilterTabs tabs={tabOptions} value={category} onChange={setCategory} />
          <div className="is-flex">
            <SearchInput value={searchTerm} onChange={setSearchTerm} />
            <div className="ml-10">
              <ExportButton onExport={handleExport} />
            </div>
          </div>
        </div>
        <InvitationsGrid
          type='admin'
          invites={invites}
          totalInvites={getTotalInvitations()}
          resendInvitation={resendInvitation}
          revokeInvitation={revokeInvitation}
          fetchData={fetchData}
          page={page}
          perPage={perPage}
          isLoading={isFetching}
        />
      </div>
      <Toaster type={alertType} message={alertLabel} showAlert={showAlert} />
    </>
  );
};

export default withLayout(InvitesPage);
