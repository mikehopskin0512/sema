import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { format, parseISO, subDays } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './style.scss';

const today = new Date();
const weekAgo = subDays(today, 7);

const DateRangeFilter = (props) => {
  const { updateFilters, currentFilters, paramStartDate, paramEndDate } = props;
  const currentStartDate = parseISO(currentFilters[paramStartDate]);
  const currentEndDate = parseISO(currentFilters[paramEndDate]);
  const [startDate, _setStartDate] = useState(currentStartDate || weekAgo);
  const [endDate, _setEndDate] = useState(currentEndDate || today);

  // Update report url when filters change
  const setStartDate = (date) => {
    const params = format(date, 'yyyy-MM-dd');
    updateFilters(paramStartDate, params);
    _setStartDate(date);
  };

  const setEndDate = (date) => {
    const params = format(date, 'yyyy-MM-dd');
    updateFilters(paramEndDate, params);
    _setEndDate(date);
  };

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

DateRangeFilter.propTypes = {
  updateFilters: PropTypes.func.isRequired,
  currentFilters: PropTypes.object.isRequired,
  paramStartDate: PropTypes.string.isRequired,
  paramEndDate: PropTypes.string.isRequired,
};

export default DateRangeFilter;
