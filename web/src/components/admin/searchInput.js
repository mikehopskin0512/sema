import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SearchInput = ({ value, onChange }) => (
  <div className="field has-addons mb-15 is-background-white">
    <p className="control">
    <input
      className="input px-20 py-10 is-background-white"
      type="text"
      placeholder="Search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    </p>
    <p className="control">
      <div className="button is-static is-clickable">
        <FontAwesomeIcon icon='search' />
      </div>
    </p>
  </div>
);

SearchInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SearchInput;
