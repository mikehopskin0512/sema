import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { getMonth, getYear } from 'date-fns';
import enUs from 'date-fns/locale/en-US';
import DatePicker, { registerLocale } from 'react-datepicker';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import styles from './calendarPopover.module.scss';

import 'react-datepicker/dist/react-datepicker.css';
import { black900 } from '../../../styles/_colors.module.scss';

registerLocale('enUs', enUs);

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',
];

const Calendar = ({ dateRange, setDates, selectedRange }) => {
  const getNextMonth = () => {
    const d = new Date();
    return new Date(d.setMonth(d.getMonth() + 1));
  };

  const [startDate, setStartDate] = useState(dateRange.startDate);
  const [endDate, setEndDate] = useState(dateRange.endDate);
  const [selecting, setSelecting] = useState('start');
  const [currentDate1, setCurrentDate1] = useState({
    month: getMonth(new Date()),
    year: getYear(new Date()),
  });
  const [currentDate2, setCurrentDate2] = useState({
    month: getMonth(getNextMonth()),
    year: getYear(new Date()),
  });

  useEffect(() => {
    if (selectedRange !== 'custom') {
      setStartDate(dateRange.startDate);
      setEndDate(dateRange.endDate);
      setCurrentDate1({
        month: getMonth(new Date(dateRange.startDate)),
        year: getYear(new Date(dateRange.startDate)),
      });
    }
  }, [dateRange, selectedRange]);

  const handleChange = (date) => {
    if (selecting === 'start') {
      if (endDate) {
        setEndDate(null);
      }
      setStartDate(date);
      setSelecting('end');
      return;
    }
    if (selecting === 'end') {
      if (date < startDate) {
        setStartDate(date);
        return;
      }
      setEndDate(date);
      setSelecting('start');
      setDates({ startDate, endDate: date });
    }
  };

  const switchMonth = (date, type) => {
    let { month, year } = date;
    if (type === 'inc') {
      month = date.month + 1;
      if (month === 12) {
        month = 0;
        year += 1;
      }
    }
    if (type === 'dec') {
      month = date.month - 1;
      if (month === -1) {
        month = 11;
        year -= 1;
      }
    }
    return { month, year };
  };

  const renderCustomHeader1 = (props) => (
    <CustomHeader
      {...props}
      switchMonth={switchMonth}
      currentDate={currentDate1}
      setCurrentDate={(d) => setCurrentDate1(d)}
      disabledPrev={false}
      disabledNext={(
        currentDate1.month + 1 === currentDate2.month &&
        currentDate1.year === currentDate2.year
      ) ||
      (
        currentDate1.year + 1 === currentDate2.year &&
        currentDate2.month === 0 &&
        currentDate1.month === 11
      )}
    />
  );

  const renderCustomHeader2 = (props) => (
    <CustomHeader
      {...props}
      switchMonth={switchMonth}
      currentDate={currentDate2}
      setCurrentDate={(d) => setCurrentDate2(d)}
      disabledPrev={
        (
          currentDate2.month - 1 === currentDate1.month &&
          currentDate1.year === currentDate2.year
        ) ||
        (
          currentDate1.year + 1 === currentDate2.year &&
          currentDate2.month === 0 &&
          currentDate1.month === 11
        )
      }
      disabledNext={false}
    />
  );

  const calendarContainer = ({ children }) => (
    <div className="has-background-white">
      {children}
    </div>
  );

  const dayClassName1 = (date) => (getMonth(date) !== currentDate1.month ? 'prev-month' : undefined);

  const dayClassName2 = (date) => (getMonth(date) !== currentDate2.month ? 'prev-month' : undefined);

  return (
    <div className={clsx('is-flex', styles.calendars)}>
      <div className={clsx('p-20', styles['first-calendar'])}>
        <DatePicker
          locale="enUs"
          onChange={handleChange}
          renderCustomHeader={renderCustomHeader1}
          calendarContainer={calendarContainer}
          dayClassName={dayClassName1}
          selected={currentDate2.month > getMonth(startDate) ? startDate : undefined}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          inline />
      </div>
      <div className="p-20">
        <DatePicker
          locale="enUs"
          onChange={handleChange}
          renderCustomHeader={renderCustomHeader2}
          calendarContainer={calendarContainer}
          dayClassName={dayClassName2}
          selected={currentDate2.month === getMonth(startDate) ? startDate : undefined}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          inline />
      </div>
    </div>
  );
};

const CustomHeader = ({
  date,
  changeYear,
  changeMonth,
  switchMonth,
  currentDate,
  disabledPrev,
  setCurrentDate,
  disabledNext,
}) => {
  useEffect(() => {
    changeYear(currentDate.year);
    changeMonth(currentDate.month);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const prevMonth = () => {
    const { month, year } = switchMonth(currentDate, 'dec');
    setCurrentDate({ month, year });
    changeYear(year);
    changeMonth(month);
  };

  const nextMonth = () => {
    const { month, year } = switchMonth(currentDate, 'inc');
    setCurrentDate({ month, year });
    changeYear(year);
    changeMonth(month);
  };

  return (
    <div className="has-background-white is-flex is-justify-content-space-between is-align-items-center">
      <button
        className="button is-white"
        type="button"
        onClick={prevMonth}
        disabled={disabledPrev}
      >
        <FontAwesomeIcon icon={faChevronLeft} color={black900} size="xs" />
      </button>
      <div className="has-text-weight-semibold has-text-black-950">{months[getMonth(date)]} {getYear(date)}</div>
      <button disabled={disabledNext} className="button is-white" type="button" onClick={nextMonth}>
        <FontAwesomeIcon icon={faChevronRight} color={black900} size="xs" />
      </button>
    </div>
  );
};

CustomHeader.propTypes = {
  date: PropTypes.string.isRequired,
  changeYear: PropTypes.func.isRequired,
  changeMonth: PropTypes.func.isRequired,
  switchMonth: PropTypes.func.isRequired,
  currentDate: PropTypes.object.isRequired,
  disabledPrev: PropTypes.bool.isRequired,
  disabledNext: PropTypes.bool.isRequired,
  setCurrentDate: PropTypes.func.isRequired,
};

Calendar.propTypes = {
  setDates: PropTypes.func.isRequired,
  dateRange: PropTypes.object.isRequired,
  selectedRange: PropTypes.string.isRequired,
};

export default Calendar;
