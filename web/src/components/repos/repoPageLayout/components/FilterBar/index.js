import React from 'react';
import PropTypes from 'prop-types';
import CustomSelect from '../../../../activity/select';
import SearchFilter from '../SearchFilter';
import DateRangeSelector from '../../../../dateRangeSelector';
import { ReactionList, TagList } from '../../../../../data/activity';

const FilterBar = ({
  filter,
  startDate,
  endDate,
  onDateChange,
  filterUserList,
  onChangeFilter,
  filterRequesterList,
  filterPRList,
  tab,
}) => (
  <div className="border-radius-4px mb-20 is-flex is-justify-content-space-between px-5">
    <div className="is-flex">
      <div className="px-5 my-5 is-flex">
        <DateRangeSelector
          start={startDate}
          end={endDate}
          onChange={onDateChange}
          outlined
        />
      </div>
      {
        tab === 'activity' && (
          <>
            <div className="px-5 my-5">
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
            <div className="px-5 my-5">
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
          </>
        )
      }
      <div className="px-5 my-5">
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
      <div className="px-5 my-5">
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
      <div className="px-5 my-5">
        <CustomSelect
          selectProps={{
            options: filterPRList,
            placeholder: '',
            isMulti: true,
            onChange: ((value) => onChangeFilter('pr', value)),
            value: filter.pr,
            hideSelectedOptions: false,
          }}
          label="Pull requests"
          showCheckbox
          outlined
        />
      </div>
    </div>
    <SearchFilter
      className="is-flex is-justify-content-flex-end"
      value={filter.search}
      onChange={(value) => onChangeFilter('search', value)}
    />
  </div>
);

FilterBar.defaultProps = {
  filter: {},
  startDate: new Date(),
  endDate: new Date(),
  onDateChange: () => {},
  filterUserList: [],
  onChangeFilter: () => {},
  filterRequesterList: [],
  filterPRList: [],
  tab: '',
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
  tab: PropTypes.string,
};

export default FilterBar;
