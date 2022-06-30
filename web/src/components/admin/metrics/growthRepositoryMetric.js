import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import Table from '../../table';
import { smartCommentsOperations } from '../../../state/features/smart-comments';
import ExportButton from '../exportButton';
import { YEAR_MONTH_DAY_FORMAT } from '../../../utils/constants';

const { fetchGrowthOfRepositoryMetrics, exportGrowthOfRepository } = smartCommentsOperations;

const GrowthRepositoryMetric = () => {
  const dispatch = useDispatch();
  const { growthOfRepository, isFetching } = useSelector((state) => state.smartCommentsState);

  useEffect(() => {
    dispatch(fetchGrowthOfRepositoryMetrics());
  }, [dispatch]);

  const columns = [
    {
      Header: 'Date',
      accessor: 'date',
      sorted: false,
      className: 'p-10',
    },
    {
      Header: 'Day 1',
      accessor: 'oneDayRepos',
      className: 'p-10',
    },
    {
      Header: 'Day 7',
      accessor: 'oneWeekRepos',
      className: 'p-10',
    },
    {
      Header: 'Day 30',
      accessor: 'oneMonthRepos',
      className: 'p-10',
    },
  ];

  const dataSource = useMemo(() => growthOfRepository.map((item) => ({
    ...item,
    date: format(new Date(item.date), YEAR_MONTH_DAY_FORMAT),
  })), [growthOfRepository]);

  return (
    <div className="mb-50">
      <div className="is-flex is-justify-content-flex-end mb-15">
        <ExportButton onExport={() => exportGrowthOfRepository()} />
      </div>
      <Table columns={columns} data={dataSource} loading={isFetching} />
    </div>
  );
};

export default GrowthRepositoryMetric;
