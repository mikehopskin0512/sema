import React from 'react';
import PropTypes from 'prop-types';
import { format, subDays } from 'date-fns';
import ReactSelect from 'react-select';

const dateRanges = [
  { label: 'Last 7 days', value: 7 },
  { label: 'Last 14 days', value: 14 },
  { label: 'Last 28 days', value: 28 },
  { label: 'Last 60 days', value: 60 },
  { label: 'Last 90 days', value: 90 },
  { label: 'Last 180 days', value: 180 },
  { label: 'Last 365 days', value: 365 },
  { label: 'All Time', value: 1000 },
];

const FilterDateRange = (props) => {
  const { updateFilters } = props;

  const buildParams = (option) => {
    const paramType = 'filter_dateRange';
    const { value: daysPast = 7 } = option;
    const today = format(new Date(), 'yyyy-MM-dd');
    const startDate = format(subDays(new Date(), daysPast), 'yyyy-MM-dd');
    const paramList = `param_z_date_end=${today}&param_z_date_start=${startDate}`;

    updateFilters(paramType, paramList);
  };

  return (
    <ReactSelect
      hideSelectedOptions
      options={dateRanges}
      placeholder="Date range"
      onChange={(option) => buildParams(option)} />
  );
};

FilterDateRange.propTypes = {
  updateFilters: PropTypes.func.isRequired,
};

export default FilterDateRange;
