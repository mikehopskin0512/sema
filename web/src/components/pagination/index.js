import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { getCharCount } from '../../utils';
import styles from './pagination.module.scss';
import { ChevronLeftIcon, ChevronRightIcon } from '../Icons';

const PAGE_SIZES = [10, 20, 50, 100];
const PAGE_INPUT_WIDTH = 40;

const Pagination = ({
  setPageSize, 
  pageSize,
  totalCount,
  currentPage,
  onPageChange
}) => {
  const pageInputRef = useRef(null);
  const [inputWidth, setInputWidth] = useState(PAGE_INPUT_WIDTH)
  const totalPageCount = Math.ceil(totalCount / pageSize);

  useEffect(() => {
    pageInputRef.current.style.width = `${inputWidth}px`;
    pageInputRef.current.focus();
  }, [inputWidth]);

  return (
    <>
      <div className="is-flex mb-20 is-justify-content-space-between is-align-items-center is-bordered p-15 has-background-white-0">
        <div className="is-flex is-align-items-center">
          <div className='mr-10'>Items per page</div>
          <div className={clsx("select", 'has-white-input')}>
            <select value={pageSize} onChange={(e) => setPageSize(parseInt(e.target.value, 10))}>
              {
                PAGE_SIZES.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))
              }
            </select>
          </div>
        </div>
        <div className="is-flex is-align-items-center">
          <nav className="pagination is-centered mb-0 mr-15" role="navigation" aria-label="pagination">
            <button className="pagination-previous button is-ghost" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1}>
              <ChevronLeftIcon />
            </button>
            <button className="pagination-next button is-ghost" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPageCount}>
              <ChevronRightIcon />
            </button>
            <ul className="pagination-list">
              <li className="is-flex is-align-items-center mx-5">
                <input
                  ref={pageInputRef}
                  key={`page-${currentPage}`} //hack
                  id="page-input"
                  className={`input mr-5 has-text-centered has-white-input ${styles['page-input']} ${currentPage > totalPageCount && 'is-danger'}`}
                  type="number"
                  defaultValue={currentPage}
                  onChange={e => {
                    const len = getCharCount(e.target.value);
                    const width = len === 0 ? PAGE_INPUT_WIDTH : 30 + (len * 10);
                    setInputWidth(width);
                    let page = e.target.value ? Number(e.target.value) : '1'
                    onPageChange(page)
                  }}
                  required
                />
                <span className='mx-5'>
                  of {totalPageCount === 0 ? '1' : totalPageCount}
                </span>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}

export default Pagination
