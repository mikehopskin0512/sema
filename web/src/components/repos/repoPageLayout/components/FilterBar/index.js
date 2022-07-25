import React, { useState } from 'react';
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

const FilterBar = ({
  filter,
  startDate,
  endDate,
  onDateChange,
  filterUserList,
  onChangeFilter,
  filterRequesterList,
  filterPRList,
  tab
}) => {
  const [toggleSearch, setToggleSearch] = useState(false);

  const handleSearchToggle = () => {
    setToggleSearch(toggle => !toggle);
  };

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
            />
          </div>
          {tab === 'activity' && (
            <>
              <div className="px-5 my-5">
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
                  outlined
                />
              </div>
              <div className="px-5 my-5">
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
                onChange: value => onChangeFilter('reactions', value),
                value: filter.reactions
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
                onChange: value => onChangeFilter('tags', value),
                value: filter.tags,
                hideSelectedOptions: false
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
                options: filterPRList,
                placeholder: '',
                isMulti: true,
                onChange: value => onChangeFilter('pr', value),
                value: filter.pr,
                hideSelectedOptions: false
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
        <div
          className={clsx(
            `field mt-0 mx-8 is-flex-grow-1 ${styles['search-bar']}`
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
    </div>
  );
};

FilterBar.defaultProps = {
  filter: {},
  startDate: new Date(),
  endDate: new Date(),
  onDateChange: () => {},
  filterUserList: [],
  onChangeFilter: () => {},
  filterRequesterList: [],
  filterPRList: [],
  tab: ''
};

FilterBar.propTypes = {
  filter: PropTypes.any,
  startDate: PropTypes.any,
  endDate: PropTypes.any,
  onDateChange: PropTypes.func,
  filterUserList: PropTypes.array,
  onChangeFilter: PropTypes.func,
  filterRequesterList: PropTypes.array,
  filterPRList: PropTypes.array,
  tab: PropTypes.string
};

export default FilterBar;
