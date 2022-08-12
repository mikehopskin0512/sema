import React, { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { getCharCount } from '../../utils';
import styles from './pagination.module.scss';
import { ChevronLeftIcon, ChevronRightIcon } from '../Icons';
import { useIsMount } from '../../hooks/useIsMount';

const PAGE_SIZES = [10, 20, 50, 100];
const PAGE_INPUT_WIDTH = 40;

const Pagination = ({
  setPageSize,
  pageSize,
  totalCount,
  currentPage,
  onPageChange,
}) => {
  const isMount = useIsMount();
  const pageInputRef = useRef(null);
  const [inputWidth, setInputWidth] = useState(PAGE_INPUT_WIDTH)
  const totalPageCount = Math.ceil(totalCount / pageSize);

  useEffect(() => {
    if (!isMount) {
      pageInputRef.current.style.width = `${inputWidth}px`;
      pageInputRef.current.focus();
    }
  }, [inputWidth]);

  const onSelectChange = (e) => {
    setPageSize(parseInt(e.target.value, 10));
    const newMaxPage = Math.ceil(totalCount / e.target.value);
    if(currentPage > newMaxPage) {
      onPageChange(newMaxPage);
    }
  };

  const showPageDescription = (pageNo, currentPageSize, total) => {
    let finalDataIndex = pageNo * currentPageSize
    const initialDataIndex = finalDataIndex !== 0 ? finalDataIndex - (currentPageSize - 1) : 0
    if (finalDataIndex > total) {
      finalDataIndex = total
    }
    return `Showing ${initialDataIndex} to ${finalDataIndex} of ${total} comments`;
  }

  return (
    <>
      <div className={clsx("is-flex mb-20 is-justify-content-space-between is-align-items-center is-bordered p-15 has-background-gray-300", styles['pagination-section'])}>
        <div className="is-flex is-align-items-center">
          <div className='mr-10'>Items per page</div>
          <div className={clsx("select has-white-input mr-10")}>
            <select value={pageSize} onChange={onSelectChange}>
              {
                PAGE_SIZES.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))
              }
            </select>
          </div>
          {typeof totalCount === 'number' && <div className='mr-10 has-gray-700 is-size-7'>{showPageDescription(currentPage, pageSize, totalCount)}</div>}
        </div>
        <div className="is-flex is-align-items-center">
          <nav className="pagination is-centered mb-0 mr-15" role="navigation" aria-label="pagination">
            <button 
              className={clsx("pagination-previous button", styles['pagination-buttons'], currentPage <= 1 ? 'is-disabled' : 'is-clickable')}
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              <ChevronLeftIcon />
            </button>
            <button 
              className={clsx("pagination-next button", styles['pagination-buttons'], currentPage === totalPageCount ? 'is-disabled' : 'is-clickable')}
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPageCount}
            >
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
