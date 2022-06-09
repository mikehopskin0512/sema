import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { InputField } from 'adonis';
import useDebounce from '../../hooks/useDebounce';
import styles from './organizationStatsFilter.module.scss';
import DateRangeSelector from '../dateRangeSelector';
import CustomSelect from '../activity/select';
import { DROPDOWN_SORTING_TYPES } from '../../utils/constants';
import { ReactionList, TagList } from '../../data/activity';
import { addDays, format } from 'date-fns';
import { SearchIcon } from '../Icons';
import { gray500 } from '../../../styles/_colors.module.scss';

const OrganizationStatsFilter = ({
  filter,
  individualFilter,
  commentView,
  filterRepoList,
  filterUserList,
  filterRequesterList,
  filterPRList,
  handleFilter
}) => {
  const [searchString, setSearchString] = useState(filter.search ?? '');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [toggleSearch, setToggleSearch] = useState(false);

  const debouncedSearchString = useDebounce(searchString, 500);

  const onChangeFilter = (type, value) => {
    handleFilter({
      ...filter,
      [type]: value
    });
  };

  const onDateChange = ({ startDate, endDate }) => {
    setStartDate(startDate);
    setEndDate(endDate);
    const formatDate = date =>
      date ? format(addDays(new Date(date), 1), `yyyy-MM-dd`) : null;
    handleFilter({
      ...filter,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate)
    });
  };

  useEffect(() => {
    onChangeFilter('search', debouncedSearchString);
  }, [debouncedSearchString]);

  const handleSearchToggle = () => {
    setToggleSearch(toggle => !toggle);
  };

  return (
    <>
      <div className="tile mt-20 mb-10 has-background-gray-200">
        <div className="tile border-radius-4px is-flex is-flex-wrap-wrap has-background-gray-200">
          <div
            className="is-flex is-flex-wrap-wrap is-align-items-stretch is-relative"
            style={{ zIndex: 2 }}
          >
            <div className={clsx('my-5 mr-10', styles['filter-container'])}>
              <DateRangeSelector
                start={startDate}
                end={endDate}
                onChange={onDateChange}
                onChangeFilter={onChangeFilter}
              />
            </div>
            {commentView === 'received' && individualFilter && (
              <div
                className={clsx('my-5 ml-40 mr-10', styles['filter-container'])}
              >
                <CustomSelect
                  selectProps={{
                    options: filterUserList,
                    placeholder: '',
                    isMulti: true,
                    onChange: value => onChangeFilter('from', value),
                    value: filter.from
                  }}
                  sortType={
                    DROPDOWN_SORTING_TYPES.ALPHABETICAL_USER_PRIORIY_SORT
                  }
                  label="From"
                  showCheckbox
                />
              </div>
            )}
            {commentView === 'given' && individualFilter && (
              <div
                className={clsx('my-5 mr-10 ml-40', styles['filter-container'])}
              >
                <CustomSelect
                  selectProps={{
                    options: filterRequesterList,
                    placeholder: '',
                    isMulti: true,
                    onChange: value => onChangeFilter('to', value),
                    value: filter.to
                  }}
                  sortType={
                    DROPDOWN_SORTING_TYPES.ALPHABETICAL_USER_PRIORIY_SORT
                  }
                  label="To"
                  showCheckbox
                />
              </div>
            )}
            <div
              className={clsx(
                `my-5 mr-10 ${individualFilter ? 'ml-5' : 'ml-40'}`,
                styles['filter-container']
              )}
            >
              <CustomSelect
                selectProps={{
                  options: ReactionList,
                  placeholder: '',
                  hideSelectedOptions: false,
                  isMulti: true,
                  onChange: value => onChangeFilter('reactions', value),
                  value: filter.reactions
                }}
                sortType={DROPDOWN_SORTING_TYPES.NO_SORT}
                label="Summaries"
                showCheckbox
              />
            </div>
            <div
              className={clsx(
                'my-5 mr-10 ml-5 has-background-white',
                styles['filter-container']
              )}
            >
              <CustomSelect
                selectProps={{
                  options: TagList,
                  placeholder: '',
                  isMulti: true,
                  onChange: value => onChangeFilter('tags', value),
                  value: filter.tags,
                  hideSelectedOptions: false
                }}
                sortType={DROPDOWN_SORTING_TYPES.NO_SORT}
                label="Tags"
                showCheckbox
              />
            </div>
            <div
              className={clsx(
                'my-5 ml-5 mr-10 has-background-white',
                styles['filter-container']
              )}
            >
              <CustomSelect
                selectProps={{
                  options: filterRepoList,
                  placeholder: '',
                  isMulti: true,
                  onChange: value => onChangeFilter('repo', value),
                  value: filter.repo
                }}
                label="Repos"
                showCheckbox
              />
            </div>
            <div
              className={clsx(
                'my-5 ml-5 has-background-white',
                styles['filter-container']
              )}
            >
              <CustomSelect
                selectProps={{
                  options: filterPRList,
                  placeholder: '',
                  isMulti: true,
                  onChange: value => onChangeFilter('pr', value),
                  value: filter.pr
                }}
                sortType={DROPDOWN_SORTING_TYPES.CHRONOLOGICAL_SORT}
                label="Pull requests"
                showCheckbox
              />
            </div>
          </div>
          <div className="field px-5 my-5 is-flex-grow-1 is-flex is-align-items-center is-justify-content-end">
            <SearchIcon
              color={gray500}
              size="medium"
              className="is-clickable"
              onClick={handleSearchToggle}
            />
          </div>
        </div>
      </div>
      {toggleSearch && (
        <div
          className={clsx(
            `field mt-0 mb-0 is-flex-grow-1 ${styles['search-bar']}`
          )}
        >
          <InputField
            className="has-background-white"
            type="text"
            placeholder="Search"
            onChange={value => setSearchString(value)}
            value={searchString}
            iconLeft={<SearchIcon />}
          />
        </div>
      )}
      <hr
        className={`has-background-gray-400 is-full-width ${styles.separator}`}
      />
    </>
  );
};
OrganizationStatsFilter.defaultProps = {
  filterUserList: [],
  filterRequesterList: [],
  filterPRList: [],
  filteredComments: [],
  filterRepoList: [],
  commentView: 'received',
  individualFilter: true
};

OrganizationStatsFilter.propTypes = {
  filterUserList: PropTypes.array.isRequired,
  filterRequesterList: PropTypes.array.isRequired,
  filterPRList: PropTypes.array.isRequired,
  filteredComments: PropTypes.array.isRequired,
  filterRepoList: PropTypes.array.isRequired,
  commentView: PropTypes.string,
  individualFilter: PropTypes.bool
};

export default OrganizationStatsFilter;