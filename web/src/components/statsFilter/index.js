import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSortDown } from '@fortawesome/free-solid-svg-icons';
import styles from './statsFilter.module.scss';
import DateRangeSelector from '../dateRangeSelector';
import CustomSelect from '../activity/select';
import { ReactionList, TagList } from '../../data/activity';
import { groupBy, isEmpty } from 'lodash';
import { format } from 'date-fns';

const StatsFilter = ({ filterUserList, filterRequesterList, filterPRList, handleFilter }) => {
  const [filter, setFilter] = useState({
    search: '',
    from: [],
    to: [],
    reactions: [],
    tags: [],
    pr: [],
  });
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const onChangeFilter = (type, value) => {
    setFilter({
      ...filter,
      [type]: value,
    });
  };

  useEffect(() => {
    if (!isEmpty(filter)) {
      handleFilter(filter)
    }
  }, [filter])

  useEffect(() => {
    if (startDate) {
      setFilter({startDate: format(new Date(startDate), 'yyyy-MM-dd hh:mm:ss'), ...filter})
    }
  }, [startDate])

  useEffect(() => {
    if (endDate) {
      setFilter({endDate: format(new Date(endDate), 'yyyy-MM-dd hh:mm:ss'), ...filter})
    }
  }, [endDate])

  return (
    <>
    <div className="tile my-20">
      <div className="tile has-background-white border-radius-4px is-flex is-flex-wrap-wrap box">
        <div className="field is-flex-grow-1 px-5 my-5">
          <p className="control has-icons-left">
            <input
              className="input has-background-white"
              type="text"
              placeholder="Search"
              onChange={(e) => onChangeFilter('search', e.target.value)}
              value={filter.search}
            />
            <span className="icon is-small is-left">
              <FontAwesomeIcon icon={faSearch} />
            </span>
          </p>
        </div>
        <div
          className="is-flex is-flex-wrap-wrap is-align-items-stretch is-relative"
          style={{zIndex: 2}}
        >
          <div className={clsx("m-5", styles['filter-container'])}>
            <DateRangeSelector
              start={startDate}
              end={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
            />
          </div>
          <div className={clsx("m-5", styles['filter-container'])}>
            <CustomSelect
              selectProps={{
                options: filterUserList,
                placeholder: '',
                isMulti: true,
                onChange: ((value) => onChangeFilter('from', value)),
                value: filter.from,
              }}
              label="From"
            />
          </div>
          <div className={clsx("m-5", styles['filter-container'])}>
            <CustomSelect
              selectProps={{
                options: filterRequesterList,
                placeholder: '',
                isMulti: true,
                onChange: ((value) => onChangeFilter('to', value)),
                value: filter.to,
              }}
              label="To"
            />
          </div>
          <div className={clsx("m-5", styles['filter-container'])}>
            <CustomSelect
              selectProps={{
                options: ReactionList,
                placeholder: '',
                hideSelectedOptions: false,
                isMulti: true,
                onChange: ((value) => onChangeFilter('reactions', value)),
                value: filter.reactions,
              }}
              filter={false}
              label="Reactions"
              showCheckbox
            />
          </div>
          <div className={clsx("m-5", styles['filter-container'])}>
            <CustomSelect
              selectProps={{
                options: TagList,
                placeholder: '',
                isMulti: true,
                onChange: ((value) => onChangeFilter('tags', value)),
                value: filter.tags,
                hideSelectedOptions: false,
              }}
              label="Tags"
              showCheckbox
            />
          </div>
          <div  className={clsx("m-5", styles['filter-container'])}>
            <CustomSelect
              selectProps={{
                options: filterPRList,
                placeholder: '',
                isMulti: true,
                onChange: ((value) => onChangeFilter('pr', value)),
                value: filter.pr,
              }}
              label="Pull requests"
            />
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
StatsFilter.defaultProps = {
  filterUserList: [],
  filterRequesterList: [],
  filterPRList: [],
  filteredComments: [],
};

StatsFilter.propTypes = {
  filterUserList: PropTypes.array.isRequired,
  filterRequesterList: PropTypes.array.isRequired,
  filterPRList: PropTypes.array.isRequired,
  filteredComments: PropTypes.array.isRequired
};

export default StatsFilter
