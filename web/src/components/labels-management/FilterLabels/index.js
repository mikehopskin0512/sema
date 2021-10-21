import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import CustomCheckbox from '../../customCheckbox';

const FilterLabels = ({ setFilters, filters }) => {
  return(
    <div className="has-background-white px-15 py-10 is-flex my-15 is-align-items-center is-flex-wrap-wrap">
      <div className="is-flex-grow-1 mr-20">
        <div className="control has-icons-left has-icons-left">
          <input
            className="input has-background-white is-small"
            type="input"
            placeholder="Search by label name"
            onChange={(e) => {
              setFilters({
                ...filters,
                label: e.target.value,
              })
            }}
          />
          <span className="icon is-small is-left">
            <FontAwesomeIcon icon={faSearch} />
          </span>
        </div>
      </div>
      <div className="is-flex-grow-3 is-flex my-10">
        <div className="mr-25">
          <CustomCheckbox label="Language" checked={filters.languages} onChange={(e) => setFilters({ ...filters, languages: e.target.checked})} />
        </div>
        <div className="">
          <CustomCheckbox label="Other tags" checked={filters.others} onChange={(e) => setFilters({ ...filters, others: e.target.checked})} />
        </div>
      </div>
    </div>
  )
}

FilterLabels.propTypes = {
  setFilters: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired
}

export default FilterLabels;