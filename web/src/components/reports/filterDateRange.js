import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { format, subDays } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './style.scss';

const today = new Date();
const weekAgo = subDays(today, 7);

const FilterDateRange = (props) => {
  const [startDate, setStartDate] = useState(weekAgo);
  const [endDate, setEndDate] = useState(today);

  const { updateFilters } = props;

  // Update report url when filters change
  useEffect(() => {
    const paramType = 'filter_dateRange';
    const paramList = `param_z_date_end=${format(endDate, 'yyyy-MM-dd')}&param_z_date_start=${format(startDate, 'yyyy-MM-dd')}`;

    updateFilters(paramType, paramList);
  }, [startDate, endDate]);

  return (
    <div>
      <DatePicker
        className="input-datepicker"
        placeholderText="Start date"
        dateFormat="yyyy-MM-dd"
        selected={startDate}
        onChange={(date) => setStartDate(date)} />-
      <DatePicker
        className="input-datepicker"
        placeholderText="End date"
        dateFormat="yyyy-MM-dd"
        selected={endDate}
        onChange={(date) => setEndDate(date)} />
    </div>
  );
};

FilterDateRange.propTypes = {
  updateFilters: PropTypes.func.isRequired,
};

export default FilterDateRange;
