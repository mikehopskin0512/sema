import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import tableStyles from '../../repos/repoTable/repoTable.module.scss';
import styles from './labelsTable.module.scss';
import { getCharCount } from 'src/utils';

const LabelsTable = ({ data, columns = [], renderRow }) => {
  const [pageSize, setPageSize] = useState(10);
  const [pageValue, setPageValue] = useState(1);

  const pageCount = Math.ceil(data.length / pageSize);
  const canPreviousPage = pageValue > 1;
  const canNextPage = pageValue < pageCount;
  const invalidInput = pageValue > pageCount || pageValue < 1 || !/^\d+$/.test(pageValue);

  useEffect(() => {
    setPageValue(1);
  }, [data]);

  return (
    <div className={clsx(tableStyles['table-wrapper'], styles['show-overflow-y'])}>
      <table className={clsx('table is-fullwidth', tableStyles.table)}>
        <thead className={clsx('is-fullwidth', tableStyles.thead)}>
          <tr>
            { columns.map((col) => 
              <th
                className={clsx(
                  "is-uppercase has-text-weight-semibold is-size-8 p-10",
                  col.isHiddenMobile && 'is-hidden-mobile'
                )}
                key={`column-${col.label}`}>
                  {col.label}
              </th>)
            }
            <th></th>
          </tr>
        </thead>
        <tbody className="is-fullwidth">
          { data.slice((pageValue - 1) * pageSize, pageValue * pageSize).map(renderRow) }
        </tbody>
      </table>
      <div className="is-flex mb-20 is-justify-content-space-between is-align-items-center">
        <div className="is-flex is-align-items-center">
          <div className='mr-10'>Items per page</div>
          <div className={clsx("select", styles['page-selection'])}>
            <select value={pageSize} onChange={(e) => setPageSize(e.target.value)} className="has-background-white">
              {
                [10, 20, 50, 100].map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))
              }
            </select>
          </div>
        </div>
        {
          pageSize < data.length && (
            <div className="is-flex is-align-items-center">
              <nav className="pagination is-centered mb-0 mr-15" role="navigation" aria-label="pagination">
                <button className={clsx("pagination-previous is-clickable", styles['pagination-buttons'])} onClick={() => setPageValue(pageValue-1)} disabled={!canPreviousPage}>
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <button className={clsx("pagination-next is-clickable", styles['pagination-buttons'])} onClick={() => setPageValue(pageValue+1)} disabled={!canNextPage}>
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
                <ul className="pagination-list">
                  <li className="is-flex is-align-items-center mx-5">
                    <input
                      id="page-input"
                      className={`input mr-5 has-text-centered has-background-white ${styles['page-input']} ${invalidInput && 'is-danger'}`}
                      // type="number"
                      defaultValue={1}
                      onChange={e => {
                        if (e.target.value === '') {
                          setPageValue('')
                        }
                        if (/^\d+$/.test(e.target.value)) {
                          const len = getCharCount(e.target.value);
                          const width = len === 0 ? 40 : 30 + (len*10);
                          const input = document.getElementById('page-input');
                          input.style.width = `${width}px`;
                          const page = e.target.value ? Number(e.target.value) - 1 : 0;
                          setPageValue(page + 1);
                        }
                      }}
                      value={pageValue}
                      required
                    />
                    <span className='ml-5'>
                      of {pageCount === 0 ? '1' : pageCount}
                    </span>
                  </li>
                </ul>
              </nav>
            </div>
          )
        }
      </div>
    </div>
  )
};

LabelsTable.defaultProps = {
  data: [],
};

LabelsTable.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array.isRequired,
  renderRow: PropTypes.func.isRequired,
};

export default LabelsTable;