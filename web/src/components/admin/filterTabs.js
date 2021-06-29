import React from 'react';
import PropTypes from 'prop-types';

const FilterTabs = ({ tabs, value, onChange }) => {
  return (
    <div className="buttons has-addons mb-10">
      {
        tabs.map((tab, i) => (
          <button
            key={i}
            className={`button outline-none ${value === tab.value && 'has-background-purple has-text-white'}`}
            onClick={() => onChange(tab.value)}
          >
            <span>{tab.label}</span>
          </button>
        ))
      }
    </div>
  );
};

FilterTabs.propTypes={
  tabs: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default FilterTabs;
