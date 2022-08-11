import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import CustomSelect from '../../../../activity/select';
import { DROPDOWN_SORTING_TYPES } from '../../../../../utils/constants';
import SearchFilter from '../SearchFilter';
import DateRangeSelector from '../../../../dateRangeSelector';
import { ReactionList, TagList } from '../../../../../data/activity';
import { SearchIcon } from '../../../../Icons';
import { InputField } from 'adonis';
import styles from './FilterBar.module.scss';
import { DEFAULT_FILTER_STATE } from '../../../../../utils/constants/filter';

const FilterBar = ({
  filter,
  startDate,
  endDate,
  onDateChange,
  onChangeFilter,
  tab,
  onSearch,
}) => {
  const { repositories } = useSelector((state) => ({
    repositories: state.repositoriesState,
  }));
  const {
    data: { filterValues },
  } = repositories;
  const [searchKeyword, setSearchKeyword] = useState('');
  const [toggleSearch, setToggleSearch] = useState(false);

  const handleSearchToggle = () => {
    setToggleSearch((toggle) => !toggle);
  };

  const handleKeyPress = (event) => {
    const isEnterKey = event?.key === 'Enter';
    if (isEnterKey) {
      onSearch(searchKeyword)
    }
  }

  return (
    <div>
      <div className="border-radius-4px is-flex is-justify-content-space-between px-5">
        <div className="is-flex is-full-width is-flex-wrap-wrap">
          <div className="px-5 my-5 is-flex">
            <DateRangeSelector
              start={startDate}
              end={endDate}
              onChange={onDateChange}
              outlined
              onChangeFilter={onChangeFilter}
              selectedTab={tab}
            />
          </div>
          {tab === 'activity' && (
            <>
              <div className="px-5 my-5">
                <CustomSelect
                  selectProps={{
                    options: filterValues.authors,
                    placeholder: '',
                    isMulti: true,
                    onChange: (value) => onChangeFilter('from', value),
                    value: filter.from,
                  }}
                  sortType={
                    DROPDOWN_SORTING_TYPES.ALPHABETICAL_USER_PRIORIY_SORT
                  }
                  label="From"
                  showCheckbox
                  outlined
                />
              </div>
              <div className="px-5 my-5">
                <CustomSelect
                  selectProps={{
                    options: filterValues.requesters,
                    placeholder: '',
                    isMulti: true,
                    onChange: (value) => onChangeFilter('to', value),
                    value: filter.to,
                  }}
                  sortType={
                    DROPDOWN_SORTING_TYPES.ALPHABETICAL_USER_PRIORIY_SORT
                  }
                  label="To"
                  showCheckbox
                  outlined
                />
              </div>
            </>
          )}
          <div className="px-5 my-5">
            <CustomSelect
              selectProps={{
                options: ReactionList,
                placeholder: '',
                hideSelectedOptions: false,
                isMulti: true,
                onChange: (value) => onChangeFilter('reactions', value),
                value: filter.reactions,
              }}
              sortType={DROPDOWN_SORTING_TYPES.NO_SORT}
              label="Summaries"
              showCheckbox
              outlined
            />
          </div>
          <div className="px-5 my-5">
            <CustomSelect
              selectProps={{
                options: TagList,
                placeholder: '',
                isMulti: true,
                onChange: (value) => onChangeFilter('tags', value),
                value: filter.tags,
                hideSelectedOptions: false,
              }}
              sortType={DROPDOWN_SORTING_TYPES.NO_SORT}
              label="Tags"
              showCheckbox
              outlined
            />
          </div>
          { tab !== 'stats' && (<>
          <div className="px-5 my-5">
            <CustomSelect
              selectProps={{
                options: filterValues.pullRequests,
                placeholder: '',
                isMulti: true,
                onChange: (value) => onChangeFilter('pr', value),
                value: filter.pr,
                hideSelectedOptions: false,
              }}
              sortType={DROPDOWN_SORTING_TYPES.CHRONOLOGICAL_SORT}
              label="Pull requests"
              showCheckbox
              outlined
            />
          </div>
          <div className="field px-5 my-5 is-flex-grow-1 is-flex is-align-items-center is-justify-content-end mt-20">
            <SearchIcon
              color={'#B7C0C6'}
              size="medium"
              className="is-clickable"
              onClick={handleSearchToggle}
            />
          </div>
          </>)}
        </div>
      </div>
      {toggleSearch && (
        <div className="is-flex">
          <div
            className={clsx(
              `field mt-0 mx-8 is-flex-grow-1 ${styles['search-bar']}`
            )}
          >
            <InputField
              className="has-background-white"
              type="text"
              placeholder="Search"
              onChange={(value) => setSearchKeyword(value)}
              value={searchKeyword}
              iconLeft={<SearchIcon />}
              onKeyPress={(event) => handleKeyPress(event)}
            />
          </div>
          {onSearch && <button class="button is-primary" onClick={() => onSearch(searchKeyword)}>Search</button>}
        </div>
      )}
    </div>
  );
};

FilterBar.defaultProps = {
  filter: {},
  startDate: new Date(),
  endDate: new Date(),
  onDateChange: () => {},
  onChangeFilter: () => {},
  tab: '',
};

FilterBar.propTypes = {
  filter: PropTypes.any,
  startDate: PropTypes.any,
  endDate: PropTypes.any,
  onDateChange: PropTypes.func,
  onChangeFilter: PropTypes.func,
  tab: PropTypes.string,
};

export default FilterBar;
