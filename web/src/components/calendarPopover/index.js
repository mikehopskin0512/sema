/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { format, subWeeks, subMonths } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCalendarAlt, faSortDown } from '@fortawesome/free-solid-svg-icons';
import Calendar from './calendar';
import styles from './calendarPopover.module.scss';
import { black900 } from '../../../styles/_colors.module.scss';

const DATE_RANGES = {
  last7Days: {
    name: 'Last 7 Days',
    startDate: subWeeks(new Date(), 1),
    endDate: new Date(),
  },
  last14Days: {
    name: 'Last 14 Days',
    startDate: subWeeks(new Date(), 2),
    endDate: new Date(),
  },
  last30Days: {
    name: 'Last 30 Days',
    startDate: subMonths(new Date(), 1),
    endDate: new Date(),
  },
  last3Months: {
    name: 'Last 3 Months',
    startDate: subMonths(new Date(), 3),
    endDate: new Date(),
  },
  last12Months: {
    name: 'Last 12 Months',
    startDate: subMonths(new Date(), 12),
    endDate: new Date(),
  },
  allTime: {
    name: 'All Time',
  },
  custom: {
    name: 'Custom',
  },
};

const CalendarPopover = ({ setDate }) => {
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [isActive, setIsActive] = useState(false);
  const [selectedRange, setSelectedRange] = useState('last7Days');
  const [title, setTitle] = useState('Last 7 Days');

  useEffect(() => {
    if (selectedRange !== 'custom' && selectedRange !== 'allTime') {
      setDateRange(DATE_RANGES[selectedRange]);
    }
  }, [selectedRange]);

  const selectDates = (dates) => {
    setDateRange(dates);
    setSelectedRange('custom');
  };

  const toggleCalendar = () => {
    setIsActive(!isActive);
  };

  const setDates = () => {
    setTitle(DATE_RANGES[selectedRange].name);
    setDate(dateRange);
    setIsActive(false);
  };

  return (
    <div className={clsx('dropdown is-right', isActive ? 'is-active' : '')}>
      <div className="dropdown-trigger">
        <button className="button" type="button" onClick={toggleCalendar}>
          <span className="icon">
            <FontAwesomeIcon icon={faCalendarAlt} />
          </span>
          <span>{title}</span>
          <span className="icon">
            <FontAwesomeIcon icon={faSortDown} className="mt-neg5" />
          </span>
        </button>
      </div>
      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div className="dropdown-content p-0">
          <div className="is-flex">
            <div className={clsx('menu py-25', styles['date-ranges'])}>
              <ul className="menu-list">
                <li>
                  <a
                    className={
                      clsx(
                        'has-text-black is-size-7 py-10',
                        selectedRange === 'last7Days' ? 'has-text-primary' : 'has-text-black',
                      )
                    }
                    onClick={() => setSelectedRange('last7Days')}
                  >
                    Last 7 days
                  </a>
                </li>
                <li>
                  <a
                    className={
                      clsx(
                        'has-text-black is-size-7 py-10',
                        selectedRange === 'last14Days' ? 'has-text-primary' : 'has-text-black',
                      )
                    }
                    onClick={() => setSelectedRange('last14Days')}
                  >
                    Last 14 days
                  </a>
                </li>
                <li>
                  <a
                    className={
                      clsx(
                        'has-text-black is-size-7 py-10',
                        selectedRange === 'last30Days' ? 'has-text-primary' : 'has-text-black',
                      )
                    }
                    onClick={() => setSelectedRange('last30Days')}
                  >
                    Last 30 days
                  </a>
                </li>
                <li>
                  <a
                    className={
                      clsx(
                        'has-text-black is-size-7 py-10',
                        selectedRange === 'last3Months' ? 'has-text-primary' : 'has-text-black',
                      )
                    }
                    onClick={() => setSelectedRange('last3Months')}
                  >
                    Last 3 months
                  </a>
                </li>
                <li>
                  <a
                    className={
                      clsx(
                        'has-text-black is-size-7 py-10',
                        selectedRange === 'last12Months' ? 'has-text-primary' : 'has-text-black',
                      )
                    }
                    onClick={() => setSelectedRange('last12Months')}
                  >
                    Last 12 months
                  </a>
                </li>
                <li>
                  <a
                    className={
                      clsx(
                        'has-text-black is-size-7 py-10',
                        selectedRange === 'allTime' ? 'has-text-primary' : 'has-text-black',
                      )
                    }
                    onClick={() => setSelectedRange('allTime')}
                  >
                    All Time
                  </a>
                </li>
                <li>
                  <a
                    className={
                      clsx(
                        'has-text-black is-size-7 py-10',
                        selectedRange === 'custom' ? 'has-text-primary' : 'has-text-black',
                      )
                    }
                    onClick={() => setSelectedRange('custom')}
                  >
                    Custom
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <Calendar setDates={selectDates} dateRange={dateRange} selectedRange={selectedRange} />
              <div className="is-flex is-justify-content-space-between is-align-items-center">
                <div className="is-flex py-15 px-25 is-align-items-center">
                  <input
                    className={clsx('input is-size-7 has-text-centered', styles['date-input'])}
                    type="text"
                    value={format(new Date(dateRange.startDate), 'MM/dd/yyyy')}
                  />
                  <div className="px-10">
                    <FontAwesomeIcon icon={faArrowRight} color={black900} />
                  </div>
                  <input
                    className={clsx('input is-size-7 has-text-centered', styles['date-input'])}
                    type="text"
                    value={format(new Date(dateRange.endDate), 'MM/dd/yyyy')}
                  />
                </div>
                <div className="is-flex px-15">
                  <button className="button is-light mx-5" type="button" onClick={toggleCalendar}>Cancel</button>
                  <button className="button is-primary mx-5" type="button" onClick={setDates}>Set Date</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CalendarPopover.propTypes = {
  setDate: PropTypes.func.isRequired,
};

export default CalendarPopover;
