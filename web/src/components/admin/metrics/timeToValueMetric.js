import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import Table from '../../table';
import { usersOperations } from '../../../state/features/users';
import ExportButton from '../exportButton';
import Select from '../../select';

const { fetchTimeToValueMetric, exportTimeToValueMetric } = usersOperations;

const TimeToValueMetric = () => {
  const dispatch = useDispatch();
  const { timeToValueMetric, totalTimeToValueMetricCount, isFetching } = useSelector((state) => state.usersState);
  const [range, setRange] = useState('first_hour');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);

  useEffect(() => {
    dispatch(fetchTimeToValueMetric({ page, perPage, range }));
  }, [page, perPage, range, dispatch]);

  const columns = [
    {
      Header: 'Name',
      accessor: 'name',
      sorted: false,
      className: 'p-10',
      rowSpan: 2,
    },
    {
      Header: 'Last Time',
      className: 'p-10 has-background-white has-text-centered',
      columns: [
        {
          Header: 'Leave waitlist',
          accessor: 'leaveWaitlist',
          className: 'p-10',
        },
        {
          Header: 'Accept invite',
          accessor: 'acceptInvite',
          className: 'p-10',
        },
        {
          Header: 'Last login',
          accessor: 'lastLogin',
          className: 'p-10',
        },
        {
          Header: 'Save smartComment',
          accessor: 'saveCommentAt',
          className: 'p-10',
        },
        {
          Header: 'Insert suggested comment',
          accessor: 'insertSuggestedCommentAt',
          className: 'p-10',
        },
        {
          Header: 'Manually change reaction',
          accessor: 'changeReaction',
          className: 'p-10',
        },
        {
          Header: 'Manually Change tag',
          accessor: 'changeTags',
          className: 'p-10',
        },
      ]
    },
    {
      Header: '# of smart comments',
      accessor: 'countOfSmartComments',
      className: 'p-10',
    },
  ];

  const dataSource = useMemo(() => timeToValueMetric.map((item) => ({
    name: item.name,
    leaveWaitlist: item.leaveWaitlist ? 'Yes' : 'No',
    acceptInvite: item.acceptInvite ? 'Yes' : 'No',
    lastLogin: item.lastLogin ? format(new Date(item.lastLogin), 'yyyy-MM-dd hh:mm:ss') : '',
    saveCommentAt: item.saveCommentAt ? format(new Date(item.saveCommentAt), 'yyyy-MM-dd hh:mm:ss') : '',
    insertSuggestedCommentAt: item.insertSuggestedCommentAt ? format(new Date(item.insertSuggestedCommentAt), 'yyyy-MM-dd hh:mm:ss') : '',
    changeReaction: item.changeReaction ? 'Yes' : 'No',
    changeTags: item.changeTags ? 'Yes' : 'No',
  })), [timeToValueMetric]);

  const options = [
    {
      label: 'First hour',
      value: 'first_hour',
    },
    {
      label: 'First day',
      value: 'first_day',
    },
    {
      label: 'First week',
      value: 'first_week',
    },
  ];

  const fetchData = useCallback(({ pageSize, pageIndex }) => {
    setPage(pageIndex + 1);
    setPerPage(pageSize);
  }, [setPage, setPerPage]);

  return (
    <div className="mb-50">
      <div className="is-flex is-justify-content-space-between mb-15">
        <Select
          onChange={setRange}
          value={range}
          search={false}
          placeholder=""
          options={options}
        />
        <ExportButton onExport={() => exportTimeToValueMetric()} />
      </div>
      <Table
        columns={columns}
        data={dataSource}
        loading={isFetching}
        pagination={{
          fetchData,
          totalCount: totalTimeToValueMetricCount,
          page,
          perPage,
        }}
      />
    </div>
  );
};

export default TimeToValueMetric;
