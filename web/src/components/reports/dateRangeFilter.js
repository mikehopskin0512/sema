import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { format, parseISO, subDays } from 'date-fns';
import DatePicker from 'react-datepicker';
import { YEAR_MONTH_DAY_FORMAT } from '../../utils/constants/date';

const today = new Date();
const weekAgo = subDays(today, 7);

const DateRangeFilter = (props) => {
  const { updateFilters, currentFilters, paramStartDate, paramEndDate } = props;
  const [startDate, _setStartDate] = useState(weekAgo);
  const [endDate, _setEndDate] = useState(today);

  useEffect(() => {
    _setStartDate(parseISO(currentFilters[paramStartDate]));
    _setEndDate(parseISO(currentFilters[paramEndDate]));
  }, [currentFilters, paramStartDate, paramEndDate]);

  // Update report url when filters change
  const setStartDate = (date) => {
    const params = format(date, YEAR_MONTH_DAY_FORMAT);
    updateFilters(paramStartDate, params);
    _setStartDate(date);
  };

  const setEndDate = (date) => {
    const params = format(date, YEAR_MONTH_DAY_FORMAT);
    updateFilters(paramEndDate, params);
    _setEndDate(date);
  };

  return (
    <div className="datepicker-wrapper">
      <DatePicker
        className="input-datepicker"
        style={{ width: '5rem' }}
        placeholderText="Start date"
        dateFormat={YEAR_MONTH_DAY_FORMAT}
        selected={startDate}
        onChange={(date) => setStartDate(date)} />-
      <DatePicker
        className="input-datepicker"
        style={{ width: '5rem' }}
        placeholderText="End date"
        dateFormat={YEAR_MONTH_DAY_FORMAT}
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
