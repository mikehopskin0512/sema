import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { InputField } from 'adonis';
import useDebounce from '../../hooks/useDebounce';
import styles from './organizationStatsFilter.module.scss';
import DateRangeSelector from '../dateRangeSelector';
import CustomSelect from '../activity/select';
import { DROPDOWN_SORTING_TYPES } from '../../utils/constants';
import { YEAR_MONTH_DAY_FORMAT } from '../../utils/constants/date';
import { ReactionList, TagList } from '../../data/activity';
import { addDays, endOfDay, format, startOfDay } from 'date-fns';
import { SearchIcon, GhRefreshIcon } from '../Icons';
import { gray500 } from '../../../styles/_colors.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { organizationsOperations } from '../../state/features/organizations[new]';

const { fetchOrgReposFilters } =
  organizationsOperations;

const OrganizationStatsFilter = ({
  filter,
  individualFilter,
  commentView,
  handleFilter,
}) => {
  const dispatch = useDispatch();
  // TODO: Need to update the naming for the organizationNew related code.
  const { auth, organizations } = useSelector((state) => ({
    auth: state.authState,
    organizations: state.organizationsNewState,
  }));
  const { token } = auth;
  const { repos: orgRepos, filterValues } = organizations;
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

  const formatDate = date =>
    date ? format(addDays(new Date(date), 1), YEAR_MONTH_DAY_FORMAT) : null;

  const onDateChange = ({ startDate, endDate }) => {
    setStartDate(startDate);
    setEndDate(endDate);
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

  useEffect(() => {
    const isInitialDatesNeeded = !filter.startDate && !filter.endDate && startDate && endDate;
    if (isInitialDatesNeeded) {
      handleFilter({...filter, startDate, endDate})
    }

    if (orgRepos.length) {
      const repoIds = orgRepos.map((repo) => repo.externalId);
      const { startDate: start, endDate: end } = filter
      if ((start && end) || (!start && !end)) {
        const sDate = start ? startOfDay(new Date(start)) : undefined;
        const eDate = end ? endOfDay(new Date(end)) : undefined;
        dispatch(fetchOrgReposFilters(repoIds, { startDate: sDate, endDate: eDate }, token));
      }
    }
  }, [orgRepos, filter, startDate, endDate])

  return (
    <>
      <div className="tile mt-20 mb-10 has-background-gray-200">
        <div className="tile border-radius-4px is-flex is-flex-wrap-wrap has-background-gray-200">
          <div
            className="is-flex is-flex-wrap-wrap is-align-items-stretch is-relative"
            style={{ zIndex: 2 }}
          >
            <div className={clsx('my-5 mr-10 is-flex is-align-content-flex-end', styles['filter-container'])}>
              <DateRangeSelector
                start={startDate}
                end={endDate}
                onChange={onDateChange}
                onChangeFilter={onChangeFilter} a
                additionalStyle={styles['filter-border']}
              />
            </div>
            {commentView === 'received' && individualFilter && (
              <div
                className={clsx('my-5 ml-40 mr-10', styles['filter-container'])}
              >
                <CustomSelect
                  selectProps={{
                    options: filterValues.authors,
                    placeholder: '',
                    isMulti: true,
                    onChange: value => onChangeFilter('from', value),
                    value: filter.from,
                    maxDisplayableCount: 2,
                    hideSelectedOptions: false,
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
                    options: filterValues.requesters,
                    placeholder: '',
                    isMulti: true,
                    onChange: value => onChangeFilter('to', value),
                    value: filter.to,
                    maxDisplayableCount: 2,
                    hideSelectedOptions: false,
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
                  value: filter.reactions,
                  maxDisplayableCount: 2
                }}
                sortType={DROPDOWN_SORTING_TYPES.NO_SORT}
                label="Summaries"
                showCheckbox
              />
            </div>
            <div
              className={clsx(
                'my-5 mr-10 ml-5',
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
                  hideSelectedOptions: false,
                  maxDisplayableCount: 2,
                }}
                sortType={DROPDOWN_SORTING_TYPES.NO_SORT}
                label="Tags"
                showCheckbox
              />
            </div>
            <div
              className={clsx(
                'my-5 ml-5 mr-10',
                styles['filter-container']
              )}
            >
              <CustomSelect
                selectProps={{
                  options: filterValues.repos,
                  placeholder: '',
                  isMulti: true,
                  onChange: value => onChangeFilter('repo', value),
                  value: filter.repo,
                  maxDisplayableCount: 2,
                  hideSelectedOptions: false,
                }}
                label="Repos"
                showCheckbox
              />
            </div>
            <div
              className={clsx(
                'my-5 ml-5',
                styles['filter-container']
              )}
            >
              <CustomSelect
                selectProps={{
                  options: filterValues.pullRequests,
                  placeholder: '',
                  isMulti: true,
                  onChange: value => onChangeFilter('pr', value),
                  value: filter.pr,
                  maxDisplayableCount: 2,
                  hideSelectedOptions: false,
                }}
                sortType={DROPDOWN_SORTING_TYPES.CHRONOLOGICAL_SORT}
                label="Pull requests"
                showCheckbox
              />
            </div>
          </div>
          <div className="field px-5 mt-30 my-5 is-flex-grow-1 is-flex is-align-items-center is-justify-content-end pr-25">
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
            iconRight={searchString.length ?
                <span
                  className='mr-100 is-clickable has-text-gray-700 is-whitespace-nowrap is-flex is-align-items-center'
                  onClick={() => setSearchString('')}
                >
                  <GhRefreshIcon size="small" className="mr-5" />
                  Clear Search
                </span>
                : null
              }
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
  filteredComments: [],
  commentView: 'received',
  individualFilter: true
};

OrganizationStatsFilter.propTypes = {
  filteredComments: PropTypes.array.isRequired,
  commentView: PropTypes.string,
  individualFilter: PropTypes.bool
};

export default OrganizationStatsFilter;
