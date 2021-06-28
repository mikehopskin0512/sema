import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../../components/table';
import withLayout from '../../components/layout/adminLayout';
import withSemaAdmin from '../../components/auth/withSemaAdmin';
import { invitationsOperations } from '../../state/features/invitations';
import { searchQueriesOperations } from '../../state/features/search-queries';
import { fullName } from '../../utils';
import Tabs from '../../components/tabs';
import ExportButton from '../../components/admin/exportButton';

const { fetchSearchQueries, exportSearchTerms } = searchQueriesOperations;
const { fetchInviteMetrics, exportInviteMetrics } = invitationsOperations;

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

const ReportsPage = () => {
  const dispatch = useDispatch();
  const { inviteMetrics } = useSelector(state => state.invitationsState);
  const { searchQueries, totalCount, isFetching } = useSelector(state => state.searchQueriesState);
  const { token } = useSelector(state => state.authState);
  const [inviteCategory, setInviteCategory] = useState('person');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);

  useEffect(() => {
    dispatch(fetchInviteMetrics());
  }, []);

  useEffect(() => {
    dispatch(fetchInviteMetrics(inviteCategory.toLowerCase()))
  }, [inviteCategory]);

  useEffect(() => {
    dispatch(fetchSearchQueries({ page, perPage }));
  }, [page, perPage]);

  const inviteColumns = useMemo(
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

  const queryColumns = useMemo(
    () => [
      {
        Header: 'Search Term',
        accessor: 'searchTerm',
        className: 'p-10'
      },
      {
        Header: 'Frequency',
        accessor: 'frequency',
        className: 'has-text-centered',
      },
      {
        Header: 'Matched Count',
        accessor: 'matchedCount',
        className: 'has-text-centered',
      },
    ],
    [],
  );

  const invitesData = inviteMetrics ? inviteMetrics.map(item => ({
    name: inviteCategory === 'domain' ? item.domain : fullName(item.sender),
    email: inviteCategory === 'domain' ? item.domain : item.sender && item.sender.username,
    total: item.total,
    accepted: item.accepted,
    pending: item.pending,
    expired: item.expired,
  })) : [];

  const queryData = searchQueries ? searchQueries.map(item => ({
    searchTerm: item._id.searchTerm,
    matchedCount: item._id.matchedCount,
    frequency: item.searchTermFrequencyCount,
  })) : [];

  const fetchData = useCallback(({ pageSize, pageIndex }) => {
    setPage(pageIndex + 1);
    setPerPage(pageSize);
  }, [setPage, setPerPage]);

  return (
    <div className="hero is-full-height is-flex is-flex-direction-column px-25 py-25 background-gray-white">
      <h1 className='has-text-black has-text-weight-bold is-size-3'>Reports</h1>
      <p className='mb-15 is-size-6  text-gray-light'>Manage your reports at a glance</p>
      <div className='p-20 is-flex-grow-1 has-background-white' style={{ borderRadius: 10 }}>
        <div className='mb-50'>
          <h4 className="title is-4">Invitations Metrics</h4>
          <div className='is-flex is-justify-content-space-between'>
            <Tabs value={inviteCategory} onChange={setInviteCategory} tabs={tabOptions}/>
            <ExportButton onExport={() => exportInviteMetrics(inviteCategory, token)} />
          </div>
          <Table columns={inviteColumns} data={invitesData} />
        </div>

        <div className='mb-50'>
          <div className='is-flex is-justify-content-space-between'>
            <h4 className="title is-4">Queries Metrics</h4>
            <ExportButton onExport={() => exportSearchTerms({}, token)} />
          </div>
          <Table
            columns={queryColumns}
            data={queryData}
            pagination={{
              page: page,
              perPage: perPage,
              fetchData: fetchData,
              totalCount,
              loading: isFetching
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default withSemaAdmin(withLayout(ReportsPage));
