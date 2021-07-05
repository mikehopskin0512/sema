import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../../components/table';
import withLayout from '../../components/layout/adminLayout';
import withSemaAdmin from '../../components/auth/withSemaAdmin';
import FilterTabs from '../../components/admin/filterTabs';
import ExportButton from '../../components/admin/exportButton';
import { smartCommentsOperations } from '../../state/features/smart-comments';
import { fullName } from '../../utils';

const { fetchSmartCommentsMetrics, exportSmartCommentsMetrics } = smartCommentsOperations;

const tabOptions = [
  {
    label: 'Day',
    value: 'day',
  },
  {
    label: 'User',
    value: 'user',
  },
  {
    label: 'Comments Range',
    value: 'comments_range',
  },
];

const ShareOfWalletPage = () => {
  const [tab, setTab] = useState('day');
  const dispatch = useDispatch();
  const { smartCommentMetrics, isFetching } = useSelector((state) => state.smartCommentsState);

  useEffect(() => {
    dispatch(fetchSmartCommentsMetrics({ category: tab }));
  }, [dispatch, tab]);

  const getGroupLabel = useCallback(() => tabOptions.find((option) => option.value === tab).label, [tab]);

  const columns = useMemo(
    () => ([
      {
        Header: getGroupLabel(),
        accessor: 'group',
        className: 'p-10',
      },
      {
        Header: 'Reactions(%)',
        accessor: 'reactions',
      },
      {
        Header: 'Tags(%)',
        accessor: 'tags',
      },
      {
        Header: 'Suggested Comments(%)',
        accessor: 'suggestedComments',
      },
      {
        Header: 'All(%)',
        accessor: 'sow',
      },
    ]), [getGroupLabel],
  );

  const dataSource = useMemo(() => smartCommentMetrics.map((item) => ({
    group: tab === 'user' ? fullName(item.user) : item._id,
    reactions: item.total ? Math.round((item.reactions / item.total) * 100) : 0,
    tags: item.total ? Math.round((item.tags / item.total) * 100) : 0,
    suggestedComments: item.total ? Math.round((item.suggestedComments / item.total) * 100) : 0,
    sow: item.total ? Math.round((item.sow / item.total) * 100) : 0,
  })), [tab, smartCommentMetrics]);

  return (
    <div className="hero is-full-height is-flex is-flex-direction-column px-25 py-25 background-gray-white">
      <h1 className="has-text-black has-text-weight-bold is-size-3">Share Of Wallet Metrics</h1>
      <p className="mb-15 is-size-6  text-gray-light">Manage your share of wallet metrics at a glance</p>
      <div className="p-20 is-flex-grow-1 has-background-white" style={{ borderRadius: 10 }}>
        <div className="mb-50">
          <div className="is-flex is-justify-content-space-between">
            <FilterTabs value={tab} onChange={setTab} tabs={tabOptions} />
            <ExportButton onExport={() => exportSmartCommentsMetrics({ category: tab })} />
          </div>
          <Table columns={columns} data={dataSource} loading={isFetching} />
        </div>
      </div>
    </div>
  );
};

export default withSemaAdmin(withLayout(ShareOfWalletPage));
