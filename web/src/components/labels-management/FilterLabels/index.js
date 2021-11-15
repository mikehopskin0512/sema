import React from 'react';
import PropTypes from 'prop-types';
import { PlusIcon, SearchIcon } from '../../Icons';
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
            <SearchIcon size="small" />
          </span>
        </div>
      </div>
      <div className="is-flex-grow-3 is-flex my-10">
        <div className="mr-25">
          <CustomCheckbox label="Language" checked={filters.languages} onChange={(e) => setFilters({ ...filters, languages: e.target.checked})} />
        </div>
        <div className="">
          <CustomCheckbox label="Other labels" checked={filters.others} onChange={(e) => setFilters({ ...filters, others: e.target.checked})} />
        </div>
      </div>
      <a href="/labels-management/add">
        <button
          className="button is-small is-primary border-radius-4px has-text-semibold"
          type="button">
          <PlusIcon size="small" />
          <span className="ml-8">
            Add Labels
          </span>
        </button>
      </a>
    </div>
  )
}

FilterLabels.propTypes = {
  setFilters: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired
}

export default FilterLabels;
