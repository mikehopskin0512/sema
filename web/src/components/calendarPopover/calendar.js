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

registerLocale('enUs', enUs);

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',
];

const Calendar = ({ dateRange, setDates }) => {
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
    setStartDate(dateRange.startDate);
    setEndDate(dateRange.endDate);
    setCurrentDate1({
      month: getMonth(new Date(dateRange.startDate)),
      year: getYear(new Date(dateRange.startDate)),
    });
    if (
      !(getMonth(new Date(dateRange.endDate)) === getMonth(new Date(dateRange.startDate)) && getYear(new Date(dateRange.startDate)) === getYear(new Date(dateRange.endDate)))
    ) {
      setCurrentDate2({
        month: getMonth(new Date()),
        year: getYear(new Date()),
      });
    }
  }, [dateRange]);

  useEffect(() => {
    setDates({ startDate, endDate });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

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

  const renderCustomHeader1 = ({
    date,
    decreaseMonth,
    increaseMonth,
  }) => {
    const prevMonth = () => {
      setCurrentDate1(switchMonth(currentDate1, 'dec'));
      decreaseMonth();
    };

    const nextMonth = () => {
      setCurrentDate1(switchMonth(currentDate1, 'inc'));
      increaseMonth();
    };
    return (
      <div className="has-background-white is-flex is-justify-content-space-between is-align-items-center">
        <button className="button is-white" type="button" onClick={prevMonth}>
          <FontAwesomeIcon icon={faChevronLeft} color="#19181A" size="xs" />
        </button>
        <div className="has-text-weight-semibold has-text-deep-black">{months[getMonth(date)]} {getYear(date)}</div>
        <button
          className="button is-white"
          type="button"
          onClick={nextMonth}
          disabled={
            currentDate1.month + 1 === currentDate2.month ||
            (
              currentDate1.year + 1 === currentDate2.year &&
              currentDate2.month === 0 &&
              currentDate1.month === 11
            )
          }
        >
          <FontAwesomeIcon icon={faChevronRight} color="#19181A" size="xs" />
        </button>
      </div>
    );
  };

  const renderCustomHeader2 = ({
    date,
    decreaseMonth,
    increaseMonth,
  }) => {
    const prevMonth = () => {
      setCurrentDate2(switchMonth(currentDate2, 'dec'));
      decreaseMonth();
    };

    const nextMonth = () => {
      setCurrentDate2(switchMonth(currentDate2, 'inc'));
      increaseMonth();
    };
    return (
      <div className="has-background-white is-flex is-justify-content-space-between is-align-items-center">
        <button
          className="button is-white"
          type="button"
          onClick={prevMonth}
          disabled={
            currentDate2.month - 1 === currentDate1.month ||
            (
              currentDate1.year + 1 === currentDate2.year &&
              currentDate2.month === 0 &&
              currentDate1.month === 11
            )
          }
        >
          <FontAwesomeIcon icon={faChevronLeft} color="#19181A" size="xs" />
        </button>
        <div className="has-text-weight-semibold has-text-deep-black">{months[getMonth(date)]} {getYear(date)}</div>
        <button className="button is-white" type="button" onClick={nextMonth}>
          <FontAwesomeIcon icon={faChevronRight} color="#19181A" size="xs" />
        </button>
      </div>
    );
  };

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
          openToDate={getNextMonth()}
          selectsRange
          inline />
      </div>
    </div>
  );
};

Calendar.propTypes = {
  setDates: PropTypes.func.isRequired,
  dateRange: PropTypes.object.isRequired,
};

export default Calendar;
