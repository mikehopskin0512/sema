import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSortBy, useTable, usePagination, useGroupBy } from 'react-table';
import clsx from 'clsx';
import styles from './table.module.scss';
import { getCharCount } from '../../utils';
import { ChevronLeftIcon, ChevronRightIcon } from '../Icons';

const Table = ({
  columns,
  data,
  pagination,
  loading,
  empty,
  className,
}) => {
  const { fetchData, totalCount, page: currentPage, perPage } = pagination || {};

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    pageCount,
    canPreviousPage,
    canNextPage,
    nextPage,
    gotoPage,
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
    useGroupBy,
    useSortBy,
    usePagination,
  );

  const [pageValue, setPageValue] = useState(pageIndex + 1)

  useEffect(() => {
    if (fetchData) {
      fetchData({ pageIndex: pageSize === perPage ? pageIndex : 0, pageSize });
    }
  }, [pageIndex, pageSize, fetchData, perPage]);

  return (
    <>
      <div className={clsx('table-container', className)}>
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
                    <div className={column.isSorted && 'is-flex is-align-items-center'}>
                      {column.render('Header')}
                      {/* Add a sort direction indicator */}
                      <span
                        className={column.tooltip ? 'tooltip is-multiline is-tooltip-left is-tooltip-multiline' : ''}
                        data-tooltip={column.tooltip}
                      >
                        {column.isSorted || column.sortDesc !== undefined
                          ?
                          `${column.isSortedDesc || column.sortDesc ? ' 🔽' : `${!column.sortDesc && column.isSorted ? ' 🔼' : ''}`}`
                          : ''}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {
              loading ? (
                <td colSpan={columns.length}>
                  <div className="is-flex is-align-items-center is-justify-content-center" style={{ minHeight: 400 }}>Loading...</div>
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
      </div>
      <div className="is-flex mb-20 is-justify-content-space-between is-align-items-center">
        <div className="is-flex is-align-items-center">
          <div className='mr-10'>Items per page</div>
          <div className="select">
            <select className="has-background-white" value={pageSize} onChange={(e) => setPageSize(e.target.value)}>
              {
                [10, 20, 50, 100].map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))
              }
            </select>
          </div>
        </div>
        {
          !!pagination && (
            <div className="is-flex is-align-items-center">
              <nav className="pagination is-centered mb-0 mr-15" role="navigation" aria-label="pagination">
                <button className="pagination-previous button is-ghost" onClick={() => previousPage()} disabled={!canPreviousPage}>
                  <ChevronLeftIcon />
                </button>
                <button className="pagination-next button is-ghost" onClick={() => nextPage()} disabled={!canNextPage}>
                  <ChevronRightIcon />
                </button>
                <ul className="pagination-list">
                  <li className="is-flex is-align-items-center mx-5">
                    <input
                      id="page-input"
                      className={`input mr-5 has-background-white has-text-centered ${styles['page-input']} ${pageValue > pageCount && 'is-danger'}`}
                      type="number"
                      defaultValue={pageIndex + 1}
                      onChange={e => {
                        const len = getCharCount(e.target.value);
                        const width = len === 0 ? 40 : 30 + (len*10);
                        const input = document.getElementById('page-input');
                        input.style.width = `${width}px`;
                        const page = e.target.value ? Number(e.target.value) - 1 : 0
                        gotoPage(page)
                        setPageValue(page + 1)
                      }}
                      required
                    />
                    <span className='mx-5'>
                      of {pageCount === 0 ? '1' : pageCount}
                    </span>
                  </li>
                </ul>
              </nav>
            </div>
          )
        }
      </div>
    </>
  );
};

Table.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  pagination: PropTypes.object,
  loading: PropTypes.bool,
  empty: PropTypes.any,
  className: PropTypes.string,
};

Table.defaultProps = {
  pagination: null,
  loading: false,
  empty: null,
  className: '',
};

export default Table;
