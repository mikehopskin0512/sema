import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import styles from './statsFilter.module.scss';
import DateRangeSelector from '../dateRangeSelector';
import CustomSelect from '../activity/select';
import { ReactionList, TagList } from '../../data/activity';
import { isEmpty } from 'lodash';
import { addDays, format } from 'date-fns';
import { SearchIcon } from '../Icons';
import { InputField } from 'adonis';
import { gray500 } from '../../../styles/_colors.module.scss';

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
  const [toggleSearch, setToggleSearch] = useState(false);

  const onChangeFilter = (type, value) => {
    setFilter({
      ...filter,
      [type]: value,
    });
  };

  const handleSearchToggle = () => {
    setToggleSearch(toggle => !toggle);
  }

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
      <div className="tile mt-20 mb-0">
        <div className="tile border-radius-4px is-flex is-flex-wrap-wrap">
          <div
            className="is-flex is-flex-wrap-wrap is-align-items-stretch is-relative is-full-width"
            style={{ zIndex: 2 }}
          >
            <div className={clsx("my-5 ml-0 mr-5 is-relative")}>
              <DateRangeSelector
                start={startDate}
                end={endDate}
                onChange={onDateChange}
                outlined
              />
            </div>
            <div className={clsx("my-5 ml-5 mr-5", styles['filter-container'])}>
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
                outlined
              />
            </div>
            <div className={clsx("my-5 mr-5 ml-5", styles['filter-container'])}>
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
                outlined
              />
            </div>
            <div className={clsx("my-5 mr-5 ml-5", styles['filter-container'])}>
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
                outlined
              />
            </div>
            <div className={clsx("my-5 mr-5 ml-5", styles['filter-container'])}>
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
                outlined
              />
            </div>
            <div className={clsx("my-5 mr-5 ml-5", styles['filter-container'])}>
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
                outlined
              />
            </div>
            <div className={clsx("my-5 mr-5 ml-5", styles['filter-container'])}>
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
                outlined
              />
            </div>
            <div className="field px-5 my-5 is-flex-grow-1 is-flex is-align-items-center is-justify-content-end">
              <SearchIcon color={gray500} size="medium" className="is-clickable" onClick={handleSearchToggle} />
            </div>
          </div>
          {toggleSearch && <div className={clsx(`field mt-0 mb-0 is-flex-grow-1 ${styles['search-bar']}`)}>
            <InputField
              className="has-background-white"
              type="text"
              placeholder="Search"
              onChange={(value) => onChangeFilter('search', value)}
              value={filter.search}
              iconLeft={<SearchIcon />}
            />
          </div>}
          <hr className={`has-background-gray-400 is-full-width ${styles.separator}`} />
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
  filterRepoList: [],
};

StatsFilter.propTypes = {
  filterUserList: PropTypes.array.isRequired,
  filterRequesterList: PropTypes.array.isRequired,
  filterPRList: PropTypes.array.isRequired,
  filteredComments: PropTypes.array.isRequired,
  filterRepoList: PropTypes.array.isRequired,
};

export default StatsFilter;
