import React, { useEffect, useRef, useState } from 'react';
import { DayPickerRangeController } from 'react-dates';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faSortDown } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import { subDays } from 'date-fns';
import moment from 'moment';
import usePopup from '../../hooks/usePopup';
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
    const { start, setStartDate, setEndDate, end, isRight = false } = props;
    const popupRef = useRef(null);
    const [selectedRange, setSelectedRange] = useState('allTime');
    const [focusedInput, setFocusedInput] = useState('startDate');
    const { isOpen, toggleMenu } = usePopup(popupRef);

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
      <>
        <div className={clsx("dropdown is-flex is-justify-content-stretch is-align-items-stretch", isOpen ? "is-active" : null, isRight ? "is-right": null)}>
          <div className="dropdown-trigger is-flex-grow-1">
            <button
              className={clsx(
                "has-background-gray-2 border-radius-4px border-none is-flex is-justify-content-space-between is-align-items-center py-10 px-15 is-clickable",
                styles.button
              )}
              onClick={toggleMenu}
            >
              <span className={clsx("has-text-weight-semibold is-fullwidth is-size-6", styles.placeholder)}>
                { start && end ? `${moment(start).format('MM/DD/YY')} - ${moment(end).format('MM/DD/YY')}` : 'Date range'}
              </span>
              <span className="icon is-small pb-5">
                <FontAwesomeIcon icon={faSortDown} color="#394A64" />
              </span>
            </button>
          </div>
          <div className="dropdown-menu" id="dropdown-menu" role="menu" ref={popupRef}>
            <div className={clsx("dropdown-content", styles['dropdown-container'])}>
              <DayPickerRangeController
                startDate={start}
                endDate={end}
                onDatesChange={setDates}
                focusedInput={focusedInput}
                onFocusChange={focused => setFocusedInput(focused || 'startDate')}
                calendarInfoPosition="before"
                renderCalendarInfo={renderCalendarInfo}
                orientation="horizontal"
                renderNavPrevButton={renderNavPrevButton}
                renderNavNextButton={renderNavNextButton}
                displayFormat="MMM DD, YYYY"
                isOutsideRange={(day) => day.isAfter(moment().add(1, 'days'))}
                initialVisibleMonth={() => moment()}
                numberOfMonths={2}
                hideKeyboardShortcutsPanel
              />
            </div>
          </div>
        </div>
      </>
    )
};

DateRangeSelector.defaultProps = {
  isRight: false,
};

DateRangeSelector.propTypes = {
  start: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
  setStartDate: PropTypes.func.isRequired,
  setEndDate: PropTypes.func.isRequired,
  isRight: PropTypes.bool,
};

export default DateRangeSelector;