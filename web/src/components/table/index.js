import React, { useEffect } from 'react';
import { useSortBy, useTable, usePagination } from 'react-table';

const Table = ({
  columns,
  data,
  pagination,
  empty,
}) => {
  const { fetchData, loading, totalCount, page: currentPage, perPage } = pagination || {};

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      data,
      columns,
      initialState: { pageIndex: currentPage - 1, pageSize: perPage },
      manualPagination: true,
      pageCount: Math.ceil(totalCount / perPage),
    },
    useSortBy,
    usePagination,
  );

  useEffect(() => {
    if (fetchData) {
      fetchData({ pageIndex: pageSize === perPage ? pageIndex : 0, pageSize });
    }
  }, [pageIndex, pageSize, fetchData]);

  return (
    <div className="table-container">
      <table {...getTableProps()} className="table is-striped" style={{ width: '100%' }}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(
                  column.sorted === false ? [{ className: column.className }] : [
                    column.getSortByToggleProps(),
                    { className: column.className },
                  ],
                )}>
                  {column.render('Header')}
                  {/* Add a sort direction indicator */}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {
            loading ? (
              <td colSpan={columns.length}>
                <div className='is-flex is-align-items-center is-justify-content-center' style={{ minHeight: 400 }}>Loading...</div>
              </td>
            ) : (
              data.length ? (
                <>
                  {page.map(
                    (row, i) => {
                      prepareRow(row);
                      return (
                        <tr {...row.getRowProps()}>
                          {row.cells.map((cell) => (
                            <td {...cell.getCellProps([
                              {
                                className: cell.column.className,
                                style: cell.column.style,
                              }])}>{cell.render('Cell')}
                            </td>
                          ))}
                        </tr>
                      );
                    },
                  )}
                </>
              ) : (
                <td colSpan={columns.length}>
                  {empty}
                </td>
              )
            )
          }
        </tbody>
      </table>
      {
        !!pagination && (
          <div className='is-flex mb-20 is-justify-content-space-between is-align-items-center'>
            <div className='is-flex is-align-items-center'>
              <div className='mr-10'>Total Count: {totalCount}</div>
              <div>Show: {data.length}</div>
            </div>
            <div className='is-flex is-align-items-center'>
              <nav className="pagination is-centered mb-0 mr-15" role="navigation" aria-label="pagination">
                <button className="pagination-previous" onClick={() => previousPage()} disabled={!canPreviousPage}>Previous</button>
                <button className="pagination-next" onClick={() => nextPage()} disabled={!canNextPage}>Next page</button>
                <ul className="pagination-list">
                  <li><a className="pagination-link is-current" aria-current="page">{pageIndex + 1}</a></li>
                </ul>
              </nav>

              <div className="select">
                <select value={pageSize} onChange={(e) => setPageSize(e.target.value)}>
                  {
                    [10, 20, 50, 100].map(item => (
                      <option key={item} value={item}>{item}</option>
                    ))
                  }
                </select>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
};

export default Table;
