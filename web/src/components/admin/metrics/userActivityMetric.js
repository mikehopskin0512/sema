import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ExportButton from '../exportButton';
import Table from '../../table';
import { smartCommentsOperations } from '../../../state/features/smart-comments';
import { fullName } from '../../../utils';

const { fetchUserActivityMetrics, exportUserActivityMetrics } = smartCommentsOperations;

const UserActivityMetric = () => {
  const dispatch = useDispatch();
  const { userActivityMetrics, isFetching } = useSelector((state) => state.smartCommentsState);

  useEffect(() => {
    dispatch(fetchUserActivityMetrics());
  }, [dispatch]);

  const columns = [
    {
      Header: 'Name',
      accessor: 'userInfo',
      sorted: false,
      Cell: ({ cell: { value } }) => (
        <div className="is-flex is-align-items-center is-cursor-pointer" onClick={() => Router.push(`/sema-admin/users/${value.id}`)}>
          <img src={value.avatarUrl} alt="avatar" width={32} height={32} className="mr-10" style={{ borderRadius: '100%' }} />
          { value.name }
        </div>
      ),
      className: 'p-10',
    },
    {
      Header: 'User Email',
      accessor: 'userEmail',
      className: 'p-10',
    },
    {
      Header: 'Activity 2 weeks ago',
      accessor: 'activityTwoWeeksAgo',
      className: 'p-10',
    },
    {
      Header: 'Activity 1 week ago',
      accessor: 'activityOneWeekAgo',
      className: 'p-10',
    },
  ];

  const dataSource = useMemo(() => userActivityMetrics.map((item) => ({
    userInfo: {
      id: item.user._id,
      name: fullName(item.user),
      avatarUrl: item.user.avatarUrl,
    },
    userId: item._id,
    userEmail: item.user.username,
    activityTwoWeeksAgo: item.activityTwoWeeksAgo,
    activityOneWeekAgo: item.activityOneWeekAgo,
  })), [userActivityMetrics]);

  return (
    <div className="mb-50">
      <div className="is-flex is-justify-content-flex-end mb-15">
        <ExportButton onExport={() => exportUserActivityMetrics()} />
      </div>
      <Table columns={columns} data={dataSource} loading={isFetching} />
    </div>
  );
};

export default UserActivityMetric;
