import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import Table from '../../components/table';
import withLayout from '../../components/layout/adminLayout';
import withSemaAdmin from '../../components/auth/withSemaAdmin';
import { smartCommentsOperations } from '../../state/features/smart-comments';
import ExportButton from '../../components/admin/exportButton';
import SearchInput from '../../components/admin/searchInput';
import useDebounce from '../../hooks/useDebounce';
import { fullName } from '../../utils';

const { fetchSuggestedMetrics, exportSuggestedCommentsMetrics } = smartCommentsOperations;

const SmartCommentsMetricPage = () => {
  const dispatch = useDispatch();
  const { suggestedMetrics, isFetching, totalSuggestedCount } = useSelector((state) => state.smartCommentsState);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [searchTerm, setSearchTerm] = useState('');
  const debounceSearchTerm = useDebounce(searchTerm);
  const [sortDesc, setSortDesc] = useState(true);

  useEffect(() => {
    dispatch(fetchSuggestedMetrics({ page, perPage, search: debounceSearchTerm, sortDesc }));
  }, [dispatch, page, perPage, debounceSearchTerm, sortDesc]);

  const fetchData = useCallback(({ pageSize, pageIndex }) => {
    setPage(pageIndex + 1);
    setPerPage(pageSize);
  }, [setPage, setPerPage]);

  const sortComments = useCallback((column) => {
    if (column.isSortedDesc !== undefined) {
      setSortDesc(column.isSortedDesc);
    }
  }, [setSortDesc]);

  const columns = useMemo(() => [
    {
      Header: 'Comment',
      accessor: 'comment',
      className: 'p-10',
      sorted: false,
      Cell: ({ cell: { value } }) => (
        <div dangerouslySetInnerHTML={{ __html: value }} style={{ maxHeight: 200, maxWidth: 400, overflow: 'auto' }} />
      ),
    },
    {
      Header: 'Reaction',
      accessor: 'reaction',
      className: 'p-10',
      sorted: false,
    },
    {
      Header: 'Tags',
      accessor: 'tags',
      className: 'p-10',
      sorted: false,
    },
    {
      Header: 'Suggested Snippets',
      accessor: 'suggestedComment',
      className: 'p-10 is-whitespace-nowrap',
      sorted: false,
    },
    {
      Header: ({ column }) => {
        sortComments(column);
        return 'Date';
      },
      accessor: 'date',
      sortDesc,
      className: 'p-10 is-whitespace-nowrap',
    },
    {
      Header: 'Repo',
      accessor: 'repo',
      className: 'p-10',
      sorted: false,
    },
    {
      Header: 'Email',
      accessor: 'email',
      className: 'p-10',
      sorted: false,
    },
    {
      Header: 'Author',
      accessor: 'author',
      className: 'p-10',
      sorted: false,
    },
    {
      Header: 'Reviewer Email',
      accessor: 'reviewerEmail',
      className: 'p-10',
      sorted: false,
    },
    {
      Header: 'Reviewer Name',
      accessor: 'reviewerName',
      className: 'p-10 is-whitespace-nowrap',
      sorted: false,
    },
  ], [sortComments, sortDesc]);

  const dataSource = useMemo(() => suggestedMetrics.map((item) => ({
    comment: item.comment,
    reaction: item.reaction && item.reaction.title,
    tags: item.tags.length,
    suggestedComment: item.suggestedComments.length,
    date: item.createdAt ? format(new Date(item.createdAt), 'yyyy-MM-dd hh:mm:ss') : '',
    repo: item.githubMetadata && item.githubMetadata.url,
    email: item.userId && item.userId.username,
    author: item.githubMetadata && item.githubMetadata.requester,
    reviewerEmail: item.userId && item.userId.username,
    reviewerName: item.userId && fullName(item.userId),
  })), [suggestedMetrics]);

  return (
    <>
      <h1 className="has-text-black has-text-weight-bold is-size-3">Smart Comments Metrics</h1>
      <p className="mb-15 is-size-6  text-gray-light">Manage your user smart comments metrics at a glance</p>
      <div className="p-20 is-flex-grow-1 has-background-white" style={{ borderRadius: 10 }}>
        <div className="mb-50">
          <div className="is-flex is-justify-content-flex-end mb-15">
            <div className="mr-10">
              <SearchInput value={searchTerm} onChange={setSearchTerm} />
            </div>
            <ExportButton onExport={() => exportSuggestedCommentsMetrics({ search: searchTerm, sortDesc })} />
          </div>
          <Table
            columns={columns}
            data={dataSource}
            loading={isFetching}
            pagination={{
              page,
              perPage,
              fetchData,
              totalCount: totalSuggestedCount,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default withSemaAdmin(withLayout(SmartCommentsMetricPage));
