import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ExportButton from '../exportButton';
import Table from '../../table';
import { searchQueriesOperations } from '../../../state/features/search-queries';

const { fetchSearchQueries, exportSearchTerms } = searchQueriesOperations;

const SearchQueryMetric = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const { searchQueries, isFetching, totalCount } = useSelector((state) => state.searchQueriesState);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.authState);

  useEffect(() => {
    dispatch(fetchSearchQueries({ page, perPage }));
  }, [page, perPage, dispatch]);

  const fetchData = useCallback(({ pageSize, pageIndex }) => {
    setPage(pageIndex + 1);
    setPerPage(pageSize);
  }, [setPage, setPerPage]);

  const queryColumns = useMemo(
    () => [
      {
        Header: 'Search Term',
        accessor: 'searchTerm',
        className: 'p-10',
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

  const queryData = searchQueries ? searchQueries.map((item) => ({
    searchTerm: item._id.searchTerm,
    matchedCount: item._id.matchedCount,
    frequency: item.searchTermFrequencyCount,
  })) : [];

  return (
    <div className="mb-50">
      <div className="is-flex is-justify-content-flex-end mb-15">
        <ExportButton onExport={() => exportSearchTerms({}, token)} />
      </div>
      <Table
        columns={queryColumns}
        data={queryData}
        pagination={{
          page,
          perPage,
          fetchData,
          totalCount,
        }}
        loading={isFetching}
      />
    </div>
  );
};

export default SearchQueryMetric;
