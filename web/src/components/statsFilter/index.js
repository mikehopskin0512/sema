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
import { addDays, format } from 'date-fns';

const StatsFilter = ({ filterRepoList, filterUserList, filterRequesterList, filterPRList, handleFilter }) => {
  const [filter, setFilter] = useState({
    startDate: null,
    endDate: null,
    search: '',
    from: [],
    to: [],
    reactions: [],
    tags: [],
    pr: [],
    repo: [],
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const onChangeFilter = (type, value) => {
    setFilter({
      ...filter,
      [type]: value,
    });
  };

  useEffect(() => {
    if (!isEmpty(filter)) {
      handleFilter(filter);
    }
  }, [filter]);

  const onDateChange = ({ startDate, endDate }) => {
    setStartDate(startDate);
    setEndDate(endDate);
    const formatDate = (date) => date ? format(addDays(new Date(date), 1), `yyyy-MM-dd`) : null
    setFilter({
      ...filter,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    });
  }

  return (
    <>
    <div className="tile my-20">
      <div className="tile has-background-white border-radius-4px is-flex is-flex-wrap-wrap box">
        <div className="field is-flex-grow-1 px-5 my-5">
          <div className="control has-icons-left is-flex">
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
            <div className={clsx("mx-5 is-flex", styles['filter-container'])}>
              <DateRangeSelector
                start={startDate}
                end={endDate}
                onChange={onDateChange}
                isRight
              />
            </div>
          </div>
        </div>
        <div
          className="is-flex is-flex-wrap-wrap is-align-items-stretch is-relative"
          style={{zIndex: 2}}
        >
          <div className={clsx("my-5 ml-5 mr-10", styles['filter-container'])}>
            <CustomSelect
              selectProps={{
                options: filterUserList,
                placeholder: '',
                isMulti: true,
                onChange: ((value) => onChangeFilter('from', value)),
                value: filter.from,
              }}
              label="From"
              showCheckbox
            />
          </div>
          <div className={clsx("my-5 mr-10 ml-5", styles['filter-container'])}>
            <CustomSelect
              selectProps={{
                options: filterRequesterList,
                placeholder: '',
                isMulti: true,
                onChange: ((value) => onChangeFilter('to', value)),
                value: filter.to,
              }}
              label="To"
              showCheckbox
            />
          </div>
          <div className={clsx("my-5 mr-10 ml-5", styles['filter-container'])}>
            <CustomSelect
              selectProps={{
                options: ReactionList,
                placeholder: '',
                hideSelectedOptions: false,
                isMulti: true,
                onChange: ((value) => onChangeFilter('reactions', value)),
                value: filter.reactions,
              }}
              label="Summaries"
              showCheckbox
            />
          </div>
          <div className={clsx("my-5 mr-10 ml-5", styles['filter-container'])}>
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
          <div  className={clsx("my-5 mr-10 ml-5", styles['filter-container'])}>
            <CustomSelect
              selectProps={{
                options: filterPRList,
                placeholder: '',
                isMulti: true,
                onChange: ((value) => onChangeFilter('pr', value)),
                value: filter.pr,
              }}
              label="Pull requests"
              showCheckbox
            />
          </div>
          <div className={clsx("my-5 ml-5", styles['filter-container'])}>
            <CustomSelect
              selectProps={{
                options: filterRepoList,
                placeholder: '',
                isMulti: true,
                onChange: ((value) => onChangeFilter('repo', value)),
                value: filter.repo,
              }}
              label="Repos"
              showCheckbox
            />
          </div>
        </div>
      </div>
    </div>
    </>
  );
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
