import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../../components/table';
import withLayout from '../../components/layout/adminLayout';
import withSemaAdmin from '../../components/auth/withSemaAdmin';
import { invitationsOperations } from '../../state/features/invitations';
import { fullName } from '../../utils';
import Tabs from '../../components/tabs';
import ExportButton from '../../components/admin/exportButton';
import { suggestCommentsOperations } from '../../state/features/suggest-comments';
const { fetchInviteMetrics, exportInviteMetrics } = invitationsOperations;
const { fetchSuggestComments } = suggestCommentsOperations;

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
  const { suggestedComments, isFetching, totalCount } = useSelector(state => state.suggestCommentsState);
  const { token } = useSelector(state => state.authState);
  const [inviteCategory, setInviteCategory] = useState('person');
  const [commentPage, setCommentPage] = useState(1);
  const [commentPageSize, setCommentPageSize] = useState(50);

  useEffect(() => {
    dispatch(fetchInviteMetrics());
    dispatch(fetchSuggestComments());
  }, []);

  useEffect(() => {
    dispatch(fetchInviteMetrics(inviteCategory.toLowerCase()))
  }, [inviteCategory]);

  useEffect(() => {
    dispatch(fetchSuggestComments({ page: commentPage, perPage: commentPageSize }));
  }, [commentPage, commentPageSize]);

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


  const suggestCommentColumns = useMemo(
    () => [
      {
        Header: 'Title',
        accessor: 'title',
        className: 'p-10'
      },
      {
        Header: 'Comment',
        accessor: 'comment',
        className: 'p-10',
        Cell: ({ cell: { value } }) => (
          <div dangerouslySetInnerHTML={{ __html: value }} style={{ maxHeight: 200, overflow: 'auto' }} />
        )
      },
      {
        Header: 'Insert Count',
        accessor: 'insertCount',
        className: 'py-10 px-20'
      },
    ],
    [],
  );

  const suggestCommentsData = suggestedComments ? suggestedComments.map(item => ({
    title: item.title,
    comment: item.comment,
    insertCount: item.insertCount,
  })) : [];

  const fetchData = useCallback(({ pageSize, pageIndex }) => {
    setCommentPage(pageIndex + 1);
    setCommentPageSize(pageSize);
  }, [setCommentPage, setCommentPageSize]);

  return (
    <div className="hero is-fullheight is-flex is-flex-direction-column px-25 py-25" style={{ background: '#f7f8fa' }}>
      <h1 className='has-text-black has-text-weight-bold is-size-3'>Reports</h1>
      <p className='mb-15 is-size-6' style={{ color: '#9198a4' }}>Manage your reports at a glance</p>
      <div className='p-20 is-flex-grow-1 has-background-white' style={{ borderRadius: 10 }}>
        <div className='mb-50'>
          <h4 className="title is-4">Invitations Metrics</h4>
          <div className='is-flex is-justify-content-space-between'>
            <Tabs value={inviteCategory} onChange={setInviteCategory} tabs={tabOptions}/>
            <ExportButton onExport={() => exportInviteMetrics(inviteCategory, token)} />
          </div>
          <Table columns={columns} data={dataSource} />
        </div>

        <div className='mb-50'>
          <h4 className="title is-4">Suggested Comments</h4>
          <Table
            columns={suggestCommentColumns}
            data={suggestCommentsData}
            pagination={{
              page: commentPage,
              perPage: commentPageSize,
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
