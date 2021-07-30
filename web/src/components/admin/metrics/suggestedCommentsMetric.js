import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../../table';
import { suggestCommentsOperations } from '../../../state/features/suggest-comments';

const { fetchSuggestComments } = suggestCommentsOperations;

const SuggestedCommentsMetric = () => {
  const dispatch = useDispatch();
  const { suggestedComments, isFetching, totalCount } = useSelector((state) => state.suggestCommentsState);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);

  useEffect(() => {
    dispatch(fetchSuggestComments());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchSuggestComments({ page, perPage }));
  }, [page, perPage, dispatch]);

  const suggestCommentColumns = useMemo(
    () => [
      {
        Header: 'Title',
        accessor: 'title',
        className: 'p-10',
      },
      {
        Header: 'Comment',
        accessor: 'comment',
        className: 'p-10',
        Cell: ({ cell: { value } }) => (
          <div dangerouslySetInnerHTML={{ __html: value }} style={{ maxHeight: 200, overflow: 'auto' }} />
        ),
      },
      {
        Header: 'Insert Count',
        accessor: 'insertCount',
        className: 'py-10 px-20',
      },
    ],
    [],
  );

  const suggestCommentsData = suggestedComments ? suggestedComments.map((item) => ({
    title: item.title,
    comment: item.comment,
    insertCount: item.insertCount,
  })) : [];

  const fetchData = useCallback(({ pageSize, pageIndex }) => {
    setPage(pageIndex + 1);
    setPerPage(pageSize);
  }, [setPage, setPerPage]);

  return (
    <div className="mb-50">
      <Table
        columns={suggestCommentColumns}
        data={suggestCommentsData}
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

export default SuggestedCommentsMetric;
