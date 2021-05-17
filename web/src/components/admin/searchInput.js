import React from 'react';
import PropTypes from 'prop-types';
import styles from './searchInput.module.scss';

const SearchInput = ({ value, onChange }) => (
  <div className={styles.wrapper}>
    <input
      type="text"
      placeholder="Search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    <button>
      <img src="/img/icons/search.png" alt="search" />
    </button>
  </div>
);

SearchInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SearchInput;
