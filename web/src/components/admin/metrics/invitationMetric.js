import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FilterTabs from '../filterTabs';
import ExportButton from '../exportButton';
import Table from '../../table';

import { fullName } from '../../../utils';
import { invitationsOperations } from '../../../state/features/invitations';

const { fetchInviteMetrics, exportInviteMetrics } = invitationsOperations;

const tabOptions = [
  {
    label: 'Person',
    value: 'person',
  },
  {
    label: 'Domain',
    value: 'domain',
  },
];

const InvitationMetric = () => {
  const [inviteCategory, setInviteCategory] = useState('person');
  const { inviteMetrics } = useSelector((state) => state.invitationsState);
  const { token } = useSelector((state) => state.authState);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchInviteMetrics());
  }, [dispatch]);

  const inviteColumns = useMemo(
    () => [
      {
        Header: 'Email',
        accessor: 'email',
        className: 'p-10',
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Total',
        accessor: 'total',
        className: 'has-text-centered',
      },
      {
        Header: 'Pending',
        accessor: 'pending',
        className: 'has-text-centered',
      },
      {
        Header: 'Accepted',
        accessor: 'accepted',
        className: 'has-text-centered',
      },
      {
        Header: 'Expired',
        accessor: 'expired',
        className: 'has-text-centered',
      },
    ],
    [],
  );

  const invitesData = inviteMetrics ? inviteMetrics.map((item) => ({
    name: inviteCategory === 'domain' ? item.domain : fullName(item.sender),
    email: inviteCategory === 'domain' ? item.domain : item.sender && item.sender.username,
    total: item.total,
    accepted: item.accepted,
    pending: item.pending,
    expired: item.expired,
  })) : [];

  return (
    <div className="mb-50">
      <div className="is-flex is-justify-content-space-between">
        <FilterTabs value={inviteCategory} onChange={setInviteCategory} tabs={tabOptions} />
        <ExportButton onExport={() => exportInviteMetrics(inviteCategory, token)} />
      </div>
      <Table columns={inviteColumns} data={invitesData} />
    </div>
  );
};

export default InvitationMetric;
