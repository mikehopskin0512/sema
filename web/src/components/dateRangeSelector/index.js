import React, { useEffect, useRef, useState } from 'react';
import { DayPickerRangeController } from 'react-dates';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faSortDown } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import { isEqual, subDays, subMonths } from 'date-fns';
import moment from 'moment';
import usePopup from '../../hooks/usePopup';
import styles from './dateRangeSelector.module.scss';
import 'react-dates/lib/css/_datepicker.css';
import { gray700 } from '../../../styles/_colors.module.scss';

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
      startDate: moment(subMonths(new Date(), 3)),
      endDate: moment(new Date()),
    },
    last12Months: {
      name: 'Last 12 Months',
      startDate: moment(subMonths(new Date(), 12)),
      endDate: moment(new Date()),
    },
    allTime: {
      name: 'All Time',
      startDate: null,
      endDate: null,
    },
  };

const DateRangeSelector = (props) => {
    const { start, end, onChange, isRight = false, buttonProps = {} } = props;
    const popupRef = useRef(null);
    const [selectedRange, setSelectedRange] = useState('allTime');
    const [focusedInput, setFocusedInput] = useState('startDate');
    const { isOpen, toggleMenu } = usePopup(popupRef);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
      if (selectedRange === 'custom') {
        return;
      }
      onChange({
        startDate: DATE_RANGES[selectedRange].startDate,
        endDate: DATE_RANGES[selectedRange].endDate,
      })
    }, [selectedRange]);

    useEffect(() => {
      setSelectedRange('last30Days');
    }, []);

    const setDates = ({ startDate, endDate }) => {
      setSelectedRange('custom');
      setStartDate(startDate);
      setEndDate(endDate);
      const isSameDate = (a, b) => isEqual(new Date(a), new Date(b));
      const isStartedDateChanged = isSameDate(end, endDate) && !isSameDate(start, startDate);
      onChange({
        startDate: startDate,
        endDate: isStartedDateChanged ? null : endDate,
      })
    }

    const renderCalendarInfo = () => (
        <div className={"menu py-20"}>
            <ul className="menu-list">
                <li><a className={clsx("px-25", selectedRange === 'last7Days' ? "has-text-primary has-text-weight-semibold" : null)} onClick={() => setSelectedRange('last7Days')}>Last 7 days</a></li>
                <li><a className={clsx("px-25", selectedRange === 'last14Days' ? "has-text-primary has-text-weight-semibold" : null)} onClick={() => setSelectedRange('last14Days')}>Last 14 days</a></li>
                <li><a className={clsx("px-25", selectedRange === 'last30Days' ? "has-text-primary has-text-weight-semibold" : null)} onClick={() => setSelectedRange('last30Days')}>Last 30 days</a></li>
                <li><a className={clsx("px-25", selectedRange === 'last3Months' ? "has-text-primary has-text-weight-semibold" : null)} onClick={() => setSelectedRange('last3Months')}>Last 3 months</a></li>
                <li><a className={clsx("px-25", selectedRange === 'last12Months' ? "has-text-primary has-text-weight-semibold" : null)} onClick={() => setSelectedRange('last12Months')}>Last 12 months</a></li>
                <li><a className={clsx("px-25", selectedRange === 'allTime' ? "has-text-primary has-text-weight-semibold" : null)} onClick={() => setSelectedRange('allTime')}>All time</a></li>
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
                "has-background-gray-100 border-radius-4px border-none is-flex is-justify-content-space-between is-align-items-center py-10 px-15 is-clickable",
                styles.button
              )}
              onClick={toggleMenu}
              {...buttonProps}
            >
              <span className={clsx("has-text-weight-semibold is-fullwidth is-size-6", styles.placeholder)}>
                { buttonProps.placeholder ? buttonProps.placeholder : start && end ? `${moment(start).format('MM/DD/YY')} - ${moment(end).format('MM/DD/YY')}` : 'Date range'}
              </span>
              <span className="icon is-small pb-5">
                <FontAwesomeIcon icon={faSortDown} color={gray700} />
              </span>
            </button>
          </div>
          <div className={"dropdown-menu"} id="dropdown-menu" role="menu" ref={popupRef}>
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
                isOutsideRange={(day) => day.isAfter(moment())}
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
  buttonProps: {},
};

DateRangeSelector.propTypes = {
  start: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
  setStartDate: PropTypes.func.isRequired,
  setEndDate: PropTypes.func.isRequired,
  isRight: PropTypes.bool,
  buttonProps: PropTypes.object,
};

export default DateRangeSelector;
