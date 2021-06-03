import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../../components/table';
import withLayout from '../../components/layout/adminLayout';
import withSemaAdmin from '../../components/auth/withSemaAdmin';
import { invitationsOperations } from '../../state/features/invitations';
import { fullName } from '../../utils';
import Tabs from '@/components/tabs';
import ExportButton from '@/components/admin/exportButton';

const { fetchInviteMetrics, exportInviteMetrics } = invitationsOperations;

const ReportsPage = () => {
  const dispatch = useDispatch();
  const { inviteMetrics } = useSelector(state => state.invitationsState);
  const { token } = useSelector(state => state.authState);
  const [inviteCategory, setInviteCategory] = useState('person');

  useEffect(() => {
    dispatch(fetchInviteMetrics());
  }, []);

  useEffect(() => {
    dispatch(fetchInviteMetrics(inviteCategory.toLowerCase()))
  }, [inviteCategory]);

  const columns = useMemo(
    () => [
      {
        Header: 'Email',
        accessor: 'email',
        className: 'p-10'
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

  const dataSource = inviteMetrics ? inviteMetrics.map(item => ({
    name: inviteCategory === 'domain' ? item.domain : fullName(item.sender),
    email: inviteCategory === 'domain' ? item.domain : item.sender && item.sender.username,
    total: item.total,
    accepted: item.accepted,
    pending: item.pending,
    expired: item.expired,
  })) : [];

  const tabOptions = [
    {
      label: 'Person',
      value: 'person'
    },
    {
      label: 'Domain',
      value: 'domain',
    },
  ];

  return (
    <div className="is-full-height is-flex is-flex-direction-column px-25 py-25" style={{ background: '#f7f8fa' }}>
      <h1 className='has-text-black has-text-weight-bold is-size-3'>Reports</h1>
      <p className='mb-15 is-size-6' style={{ color: '#9198a4' }}>Manage your reports at a glance</p>
      <div className='p-20 is-flex-grow-1 has-background-white' style={{ borderRadius: 10 }}>
        <div className='mb-40'>
          <h4 className="title is-4">Invitations Metrics</h4>
          <div className='is-flex is-justify-content-space-between'>
            <Tabs value={inviteCategory} onChange={setInviteCategory} tabs={tabOptions}/>
            <ExportButton onExport={() => exportInviteMetrics(inviteCategory, token)} />
          </div>
          <Table columns={columns} data={dataSource} />
        </div>
      </div>
    </div>
  );
};

export default withSemaAdmin(withLayout(ReportsPage));
