import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import withLayout from '../../components/layout/adminLayout';
import Table from '../../components/table';
import Badge from '../../components/badge/badge';
import { invitationsOperations } from '../../state/features/invitations';
import { fullName } from '../../utils';
import SearchInput from '../../components/admin/searchInput';
import InviteForm from '../../components/inviteForm';
import useDebounce from '../../hooks/useDebounce';
import Toaster from '../../components/toaster';
import { alertOperations } from '../../state/features/alerts';
import Tabs from '../../components/admin/tabs';
import Helmet, { InvitesHelmet } from '../../components/utils/Helmet';

const { clearAlert } = alertOperations;
const { getInvitesBySender, resendInvite, revokeInviteAndHydrateUser } = invitationsOperations;

const InvitesPage = () => {
  const dispatch = useDispatch();
  const { alerts, auth, invitations } = useSelector((state) => ({
    alerts: state.alertsState,
    auth: state.authState,
    invitations: state.invitationsState,
  }));

  const { token, user } = auth;
  const [category, setCategory] = useState('Your Invites');
  const [searchTerm, setSearchTerm] = useState('');
  const debounceSearchTerm = useDebounce(searchTerm);
  const { showAlert, alertType, alertLabel } = alerts;
  const { isFetching, data: invites } = invitations;

  useEffect(() => {
    dispatch(getInvitesBySender(user._id, token))
  }, []);

  const getInvites = () => {
    if (category === 'Your Invites') {
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

  const resentInvitation = async (email) => {
    await dispatch(resendInvite(email, token));
  };

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
                  <button className="button is-text outline-none has-no-border" onClick={() => resentInvitation(el.recipient)}>Resend Invitation</button>
                  <button className="button is-text outline-none" onClick={() => dispatch(revokeInviteAndHydrateUser(el._id, user._id, token, el.recipient))}>Revoke</button>
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

  if (isFetching) {
    return (
      <div className='loading' />
    );
  }

  return (
    <div className="is-fullheight is-flex is-flex-direction-column px-25 py-25" style={{ background: '#f7f8fa' }}>
      <Helmet {...InvitesHelmet} />
      <h1 className='has-text-black has-text-weight-bold is-size-3'>Invites</h1>
      <p className='mb-15 is-size-6' style={{ color: '#9198a4' }}>Sema is better with friends. View your invites at a glance</p>
      <div className='p-20 is-flex-grow-1 has-background-white' style={{ borderRadius: 10 }}>
        <div className='mb-20'>
          <InviteForm onReload={getInvites} />
        </div>
        <div className='is-flex is-justify-content-space-between mb-10'>
          <Tabs tabs={['Your Invites', 'All Invites']} value={category} onChange={setCategory} />
          <SearchInput value={searchTerm} onChange={setSearchTerm} />
        </div>
        <Table columns={columns} data={dataSource} />
      </div>
      <Toaster type={alertType} message={alertLabel} showAlert={showAlert} />
    </div>
  );
};

export default withLayout(InvitesPage);
