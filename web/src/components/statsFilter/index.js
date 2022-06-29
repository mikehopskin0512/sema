import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import styles from './statsFilter.module.scss';
import DateRangeSelector from '../dateRangeSelector';
import CustomSelect from '../activity/select';
import { DROPDOWN_SORTING_TYPES, YEAR_MONTH_DAY_FORMAT } from '../../utils/constants';
import { ReactionList, TagList } from '../../data/activity';
import { isEmpty } from 'lodash';
import { addDays, format } from 'date-fns';
import { SearchIcon } from '../Icons';
import { InputField } from 'adonis';
import { gray500 } from '../../../styles/_colors.module.scss';
import { repositoriesOperations } from '../../state/features/repositories';

const { fetchRepoFilters } =
  repositoriesOperations;

const StatsFilter = ({
  filterRepoList,
  handleFilter
}) => {
  const dispatch = useDispatch();
  const { auth, repositories } = useSelector((state) => ({
    auth: state.authState,
    repositories: state.repositoriesState,
  }));
  const {
    data: { filterValues },
  } = repositories;
  const { token, user: { identities } } = auth;
  const userRepos = identities?.length ? identities[0].repositories : [];
  const [filter, setFilter] = useState({
    startDate: null,
    endDate: null,
    search: '',
    from: [],
    to: [],
    reactions: [],
    tags: [],
    pr: [],
    repo: []
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [toggleSearch, setToggleSearch] = useState(false);

  const onChangeFilter = (type, value) => {
    setFilter({
      ...filter,
      [type]: value
    });
  };

  const handleSearchToggle = () => {
    setToggleSearch(toggle => !toggle);
  };

  useEffect(() => {
    if (!isEmpty(filter)) {
      handleFilter(filter);
    }
  }, [filter]);

  const onDateChange = ({ startDate, endDate }) => {
    setStartDate(startDate);
    setEndDate(endDate);
    const formatDate = date =>
      date ? format(new Date(date), YEAR_MONTH_DAY_FORMAT) : null;
    setFilter({
      ...filter,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate)
    });
  };

  useEffect(() => {
    if (userRepos?.length) {
      const repoIds = userRepos.map((repo) => repo.id);
      (async () => await dispatch(fetchRepoFilters(repoIds, { startDate: filter.startDate, endDate: filter.endDate }, token)))();
    }
  }, [userRepos, filter])

  return (
    <>
      <div className="tile mt-20 mb-0">
        <div className="tile border-radius-4px is-flex is-flex-wrap-wrap">
          <div
            className="is-flex is-flex-wrap-wrap is-align-items-stretch is-relative is-full-width"
            style={{ zIndex: 2 }}
          >
            <div className={clsx('my-5 ml-0 mr-10 is-relative')}>
              <DateRangeSelector
                start={startDate}
                end={endDate}
                onChange={onDateChange}
                outlined
                onChangeFilter={onChangeFilter}
              />
            </div>
            <div className={clsx('my-5 ml-10 mr-10', styles['filter-container'])}>
              <CustomSelect
                selectProps={{
                  options: filterValues.authors,
                  placeholder: '',
                  isMulti: true,
                  onChange: value => onChangeFilter('from', value),
                  value: filter.from,
                  maxDisplayableCount: 1,
                  hideSelectedOptions: false,
                }}
                sortType={DROPDOWN_SORTING_TYPES.ALPHABETICAL_USER_PRIORIY_SORT}
                label="From"
                showCheckbox
                outlined
              />
            </div>
            <div className={clsx('my-5 ml-10 mr-10', styles['filter-container'])}>
              <CustomSelect
                selectProps={{
                  options: filterValues.requesters,
                  placeholder: '',
                  isMulti: true,
                  onChange: value => onChangeFilter('to', value),
                  value: filter.to,
                  maxDisplayableCount: 1,
                  hideSelectedOptions: false,
                }}
                sortType={DROPDOWN_SORTING_TYPES.ALPHABETICAL_USER_PRIORIY_SORT}
                label="To"
                showCheckbox
                outlined
              />
            </div>
            <div className={clsx('my-5 ml-10 mr-10', styles['filter-container'])}>
              <CustomSelect
                selectProps={{
                  options: ReactionList,
                  placeholder: '',
                  hideSelectedOptions: false,
                  isMulti: true,
                  onChange: value => onChangeFilter('reactions', value),
                  value: filter.reactions,
                  maxDisplayableCount: 1
                }}
                sortType={DROPDOWN_SORTING_TYPES.NO_SORT}
                label="Summaries"
                showCheckbox
                outlined
              />
            </div>
            <div className={clsx('my-5 ml-10 mr-10', styles['filter-container'])}>
              <CustomSelect
                selectProps={{
                  options: TagList,
                  placeholder: '',
                  isMulti: true,
                  onChange: value => onChangeFilter('tags', value),
                  value: filter.tags,
                  hideSelectedOptions: false,
                  maxDisplayableCount: 1
                }}
                sortType={DROPDOWN_SORTING_TYPES.NO_SORT}
                label="Tags"
                showCheckbox
                outlined
              />
            </div>
            <div className={clsx('my-5 ml-10 mr-10', styles['filter-container'])}>
              <CustomSelect
                selectProps={{
                  options: filterRepoList,
                  placeholder: '',
                  isMulti: true,
                  onChange: value => onChangeFilter('repo', value),
                  value: filter.repo,
                  maxDisplayableCount: 1,
                  hideSelectedOptions: false,
                }}
                label="Repos"
                showCheckbox
                outlined
              />
            </div>
            <div className={clsx('my-5 ml-10 mr-10', styles['filter-container'])}>
              <CustomSelect
                selectProps={{
                  options: filterValues.pullRequests,
                  placeholder: '',
                  isMulti: true,
                  onChange: value => onChangeFilter('pr', value),
                  value: filter.pr,
                  maxDisplayableCount: 1,
                  hideSelectedOptions: false,
                }}
                sortType={DROPDOWN_SORTING_TYPES.CHRONOLOGICAL_SORT}
                label="Pull requests"
                showCheckbox
                outlined
              />
            </div>
            <div className="field px-5 my-5 is-flex-grow-1 is-flex is-align-items-center is-justify-content-end is-align-items-center pt-20">
              <SearchIcon
                color={gray500}
                size="medium"
                className="is-clickable"
                onClick={handleSearchToggle}
              />
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
                onChange={value => onChangeFilter('search', value)}
                value={filter.search}
                iconLeft={<SearchIcon />}
              />
            </div>
          )}
          <hr
            className={`has-background-gray-400 is-full-width ${styles.separator}`}
          />
        </div>
      </div>
    </>
  );
};
StatsFilter.defaultProps = {
  filterUserList: [],
  filterRequesterList: [],
  filterPRList: [],
  filteredComments: [],
  filterRepoList: []
};

StatsFilter.propTypes = {
  filterUserList: PropTypes.array.isRequired,
  filterRequesterList: PropTypes.array.isRequired,
  filterPRList: PropTypes.array.isRequired,
  filteredComments: PropTypes.array.isRequired,
  filterRepoList: PropTypes.array.isRequired
};

export default StatsFilter;
