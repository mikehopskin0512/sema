import React from 'react';
import PropTypes from 'prop-types';
import { SearchIcon } from '../Icons';

const SearchInput = ({ value, onChange }) => (
  <div className="field has-addons mb-15 has-background-white">
    <p className="control">
    <input
      className="input px-20 py-10 has-background-white"
      type="text"
      placeholder="Search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    </p>
    <div className="control">
      <div className="button is-static is-clickable">
        <SearchIcon size="small" />
      </div>
    </div>
  </div>
);

SearchInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SearchInput;
