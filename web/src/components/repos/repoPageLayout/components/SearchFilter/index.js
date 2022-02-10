import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { InputField } from 'adonis';
import { SearchIcon } from '../../../../Icons';
import styles from './searchFilter.module.scss';

const SearchFilter = ({ value, onChange, className }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={clsx('field px-5 my-5', className)}>
      {
        isOpen ? (
          <p className="control has-icons-left">
            <InputField
              className="input has-background-white"
              type="text"
              placeholder="Search"
              onChange={onChange}
              value={value}
              iconLeft={<SearchIcon className={styles.icon} onClick={() => setIsOpen(false)} />}
            />
          </p>
        ) : (
          <button type="button" className="button is-text has-text-gray-500 outline-none px-5" onClick={() => setIsOpen(true)}>
            <SearchIcon />
          </button>
        )
      }
    </div>
  );
};

SearchFilter.defaultProps = {
  className: '',
};

SearchFilter.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default SearchFilter;
