import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Router from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import FilterTabs from '../filterTabs';
import ExportButton from '../exportButton';
import Table from '../../table';
import { fullName } from '../../../utils';
import { smartCommentsOperations } from '../../../state/features/smart-comments';

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

const { fetchSmartCommentsMetrics, exportSmartCommentsMetrics } = smartCommentsOperations;

const ShareOfWalletMetric = () => {
  const [tab, setTab] = useState('user');
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
      ...tab === 'user' ? [{
        Header: 'Email',
        accessor: 'email',
        className: 'p-10',
        Cell: ({ cell: { value } }) => (
          <div className="is-cursor-pointer" onClick={() => Router.push(`/sema-admin/users/${value.userId}`)}>
            { value.email }
          </div>
        ),
      }] : [],
      {
        Header: 'Reactions(%)',
        accessor: 'reactions',
        className: 'p-10',
      },
      {
        Header: 'Tags(%)',
        accessor: 'tags',
        className: 'p-10',
      },
      {
        Header: 'Suggested Snippets(%)',
        accessor: 'suggestedComments',
        className: 'p-10',
      },
      {
        Header: 'All(%)',
        accessor: 'sow',
        className: 'p-10',
      },
      {
        Header: '% of Searched Comments',
        accessor: 'searchedComments',
        className: 'p-10',
      },
      {
        Header: 'Avg # of tags per smart comment',
        accessor: 'averageTags',
        className: 'p-10',
      },
      ...tab !== 'comments_range' ? [{
        Header: '# of smart comments',
        accessor: 'total',
        className: 'p-10',
      }] : [],
    ]), [getGroupLabel, tab],
  );

  const dataSource = useMemo(() => smartCommentMetrics.map((item) => ({
    group: tab === 'user' ? fullName(item.user) : item._id,
    reactions: item.total ? Math.round((item.reactions / item.total) * 100) : 0,
    tags: item.total ? Math.round((item.tags / item.total) * 100) : 0,
    suggestedComments: item.total ? Math.round((item.suggestedComments / item.total) * 100) : 0,
    searchedComments: item.total ? Math.round((item.suggestedComments / item.total) * 100) : 0,
    sow: item.total ? Math.round((item.sow / item.total) * 100) : 0,
    averageTags: item.total ? (item.totalTags / item.total).toFixed(2) : 0,
    total: item.total,
    email: tab === 'user' ? {
      email: item.user ? item.user.username : '',
      userId: item.user ? item.user._id : '',
    } : '',
  })), [tab, smartCommentMetrics]);

  return (
    <div className="mb-50">
      <div className="is-flex is-justify-content-space-between">
        <FilterTabs value={tab} onChange={setTab} tabs={tabOptions} />
        <ExportButton onExport={() => exportSmartCommentsMetrics({ category: tab })} />
      </div>
      <Table columns={columns} data={dataSource} loading={isFetching} />
    </div>
  );
};

export default ShareOfWalletMetric;
