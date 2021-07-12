import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../../components/table';
import withLayout from '../../components/layout/adminLayout';
import withSemaAdmin from '../../components/auth/withSemaAdmin';
import { smartCommentsOperations } from '../../state/features/smart-comments';
import ExportButton from '../../components/admin/exportButton';

const { fetchUserActivityMetrics, exportUserActivityMetrics } = smartCommentsOperations;

const UserActivityMetricPage = () => {
  const dispatch = useDispatch();
  const { userActivityMetrics, isFetching } = useSelector((state) => state.smartCommentsState);

  useEffect(() => {
    dispatch(fetchUserActivityMetrics());
  }, [dispatch]);

  const columns = [
    {
      Header: 'No',
      accessor: 'no',
      className: 'p-10',
    },
    {
      Header: 'User Id',
      accessor: 'userId',
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

  const dataSource = useMemo(() => userActivityMetrics.map((item, index) => ({
    no: index + 1,
    userId: item._id,
    userEmail: item.user.username,
    activityTwoWeeksAgo: item.activityTwoWeeksAgo,
    activityOneWeekAgo: item.activityOneWeekAgo,
  })), [userActivityMetrics]);

  return (
    <div className="hero is-full-height is-flex is-flex-direction-column px-25 py-25 background-gray-white">
      <h1 className="has-text-black has-text-weight-bold is-size-3">User Activity Changes Metrics</h1>
      <p className="mb-15 is-size-6  text-gray-light">Manage your user activity changes metrics at a glance</p>
      <div className="p-20 is-flex-grow-1 has-background-white" style={{ borderRadius: 10 }}>
        <div className="mb-50">
          <div className="is-flex is-justify-content-flex-end mb-15">
            <ExportButton onExport={() => exportUserActivityMetrics()} />
          </div>
          <Table columns={columns} data={dataSource} loading={isFetching} />
        </div>
      </div>
    </div>
  );
};

export default withSemaAdmin(withLayout(UserActivityMetricPage));
