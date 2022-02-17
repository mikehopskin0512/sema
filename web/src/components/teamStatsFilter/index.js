import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import styles from './teamStatsFilter.module.scss';
import DateRangeSelector from '../dateRangeSelector';
import CustomSelect from '../activity/select';
import { ReactionList, TagList } from '../../data/activity';
import { addDays, format } from 'date-fns';
import { gray400, black900 } from '../../../styles/_colors.module.scss';
import { SearchIcon } from '../Icons';

const TeamStatsFilter = ({ filter, individualFilter, commentView, filterRepoList, filterUserList, filterRequesterList, filterPRList, handleFilter }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const onChangeFilter = (type, value) => {
    handleFilter({
      ...filter,
      [type]: value,
    });
  };

  const onDateChange = ({ startDate, endDate }) => {
    setStartDate(startDate);
    setEndDate(endDate);
    const formatDate = (date) => date ? format(addDays(new Date(date), 1), `yyyy-MM-dd`) : null
    handleFilter({
      ...filter,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    });
  }

  return (
    <>
    <div className="tile my-20 has-background-gray-200">
      <div className="tile border-radius-4px is-flex is-flex-wrap-wrap has-background-gray-200">
        <div
          className="is-flex is-flex-wrap-wrap is-align-items-stretch is-relative"
          style={{zIndex: 2}}
        >
          <div className={clsx("my-5 mr-10", styles['filter-container'])}>
              <DateRangeSelector
                start={startDate}
                end={endDate}
                onChange={onDateChange}
              />
          </div>
          {commentView === 'received' && individualFilter && <div className={clsx("my-5 ml-40 mr-10", styles['filter-container'])}>
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
          </div>}
          {commentView === 'given' && individualFilter && <div className={clsx("my-5 mr-10 ml-40", styles['filter-container'])}>
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
          </div>}
          <div className={clsx(`my-5 mr-10 ${individualFilter ? 'ml-5' : 'ml-40'}`, styles['filter-container'])}>
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
          <div className={clsx("my-5 mr-10 ml-5 has-background-white", styles['filter-container'])}>
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
          <div className={clsx("my-5 ml-5 mr-10 has-background-white", styles['filter-container'])}>
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
          <div  className={clsx("my-5 ml-5 has-background-white", styles['filter-container'])}>
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
          <div className="pt-15 pl-15 mr-40">
            <SearchIcon size="small" color={black900} />
          </div>
        </div>
        <div className=" px-5 my-5 is-fullwidth field is-flex-grow-2" style={{width: '100%'}}>
          <div className="control is-flex is-fullwidth">
            <input
              className="input has-no-border has-background-gray-200"
              style={{boxShadow: 'none', outline: 'none', borderBottom: `1px solid ${gray400}`}}
              type="text"
              placeholder=""
              onChange={(e) => onChangeFilter('search', e.target.value)}
              value={filter.search}
            />
          </div>
        </div> 
      </div>
    </div>
    </>
  );
}
TeamStatsFilter.defaultProps = {
  filterUserList: [],
  filterRequesterList: [],
  filterPRList: [],
  filteredComments: [],
  filterRepoList: [],
  commentView: 'received',
  individualFilter: true,
};

TeamStatsFilter.propTypes = {
  filterUserList: PropTypes.array.isRequired,
  filterRequesterList: PropTypes.array.isRequired,
  filterPRList: PropTypes.array.isRequired,
  filteredComments: PropTypes.array.isRequired,
  filterRepoList: PropTypes.array.isRequired,
  commentView: PropTypes.string,
  individualFilter: PropTypes.bool,
};

export default TeamStatsFilter;
