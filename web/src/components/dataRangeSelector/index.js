import React, { useEffect, useState } from 'react';
import { DateRangePicker } from 'react-dates';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import { subDays, subWeeks, subMonths } from 'date-fns';
import moment from 'moment';
import styles from './dateRangeSelector.module.scss';
import 'react-dates/lib/css/_datepicker.css';

console.warn = console.error = () => {};

const DATE_RANGES = {
    last7Days: {
      name: 'Last 7 Days',
      startDate: moment(subDays(new Date(), 6)),
      endDate: moment(new Date()),
    },
    last14Days: {
      name: 'Last 14 Days',
      startDate: moment(subDays(new Date(), 13)),
      endDate: moment(new Date()),
    },
    last30Days: {
      name: 'Last 30 Days',
      startDate: moment(subDays(new Date(), 29)),
      endDate: moment(new Date()),
    },
    last3Months: {
      name: 'Last 3 Months',
      startDate: moment(subDays(new Date(), 89)),
      endDate: moment(new Date()),
    },
    last12Months: {
      name: 'Last 12 Months',
      startDate: moment(subDays(new Date(), 264)),
      endDate: moment(new Date()),
    },
    allTime: {
      name: 'All Time',
    },
  };

const DateRangeSelector = (props) => {
    const { start, setStartDate, setEndDate, end } = props;
    const [selectedRange, setSelectedRange] = useState('allTime');
    const [focusedInput, setFocusedInput] = useState();

    useEffect(() => {
      if (selectedRange === 'custom') {
        return;
      }
      if (selectedRange !== 'allTime') {
        setStartDate(DATE_RANGES[selectedRange].startDate);
        setEndDate(DATE_RANGES[selectedRange].endDate);
      } else {
        setStartDate(null);
        setEndDate(null);
      }
    }, [selectedRange]);

    const setDates = ({ startDate, endDate }) => {
        setSelectedRange('custom');
        setStartDate(startDate);
        setEndDate(endDate);
    }

    const renderCalendarInfo = () => (
        <div className={clsx("menu py-20", styles['calendar-info'])}>
            <ul className="menu-list">
                <li><a className={clsx("px-25", selectedRange === 'last7Days' ? "has-text-primary has-text-weight-semibold" : null)} onClick={() => setSelectedRange('last7Days')}>Last 7 days</a></li>
                <li><a className={clsx("px-25", selectedRange === 'last14Days' ? "has-text-primary has-text-weight-semibold" : null)} onClick={() => setSelectedRange('last14Days')}>Last 14 days</a></li>
                <li><a className={clsx("px-25", selectedRange === 'last30Days' ? "has-text-primary has-text-weight-semibold" : null)} onClick={() => setSelectedRange('last30Days')}>Last 30 days</a></li>
                <li><a className={clsx("px-25", selectedRange === 'last3Months' ? "has-text-primary has-text-weight-semibold" : null)} onClick={() => setSelectedRange('last3Months')}>Last 3 months</a></li>
                <li><a className={clsx("px-25", selectedRange === 'last12Months' ? "has-text-primary has-text-weight-semibold" : null)} onClick={() => setSelectedRange('last12Months')}>Last 12 months</a></li>
                <li><a className={clsx("px-25", selectedRange === 'allTime' ? "has-text-primary has-text-weight-semibold" : null)} onClick={() => setSelectedRange('allTime')}>All time</a></li>
                <li><a className={clsx("px-25", selectedRange === 'custom' ? "has-text-primary has-text-weight-semibold" : null)} onClick={() => setSelectedRange('custom')}>Custom</a></li>
            </ul>
        </div>
    )

    const renderNavPrevButton = (p) => (
        <button className="mx-20 my-15 button is-white" {...p}>
            <FontAwesomeIcon icon={faChevronLeft} />
        </button>
    );

    const renderNavNextButton = (p) => (
        <button className={clsx("mx-20 my-15 button is-white", styles['right-button'])} {...p}>
            <FontAwesomeIcon icon={faChevronRight} />
        </button>
    );

    return (
      <DateRangePicker
        startDate={start}
        startDateId="startDate"
        endDate={end} // momentPropTypes.momentObj or null,
        endDateId="endDate" // PropTypes.string.isRequired,
        onDatesChange={setDates} // PropTypes.func.isRequired,
        focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
        onFocusChange={focused => setFocusedInput(focused)} // PropTypes.func.isRequired,
        calendarInfoPosition="before"
        renderCalendarInfo={renderCalendarInfo}
        orientation="horizontal"
        anchorDirection="right"
        renderNavPrevButton={renderNavPrevButton}
        renderNavNextButton={renderNavNextButton}
        small
        keepOpenOnDateSelect
        hideKeyboardShortcutsPanel
        displayFormat="MMM DD, YYYY"
        isOutsideRange={(day) => day.isAfter(moment().add(1, 'days'))}
      />
    )
};

export default DateRangeSelector;