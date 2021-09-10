import React, { useState } from 'react'
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import CustomSelect from '../activity/select';
import { ReactionList, TagList } from '../../data/activity';

const StatsFilter = ({filterUserList, filterRequesterList, filterPRList,}) => {
  const [filter, setFilter] = useState({});

  const onChangeFilter = (type, value) => {
    setFilter({
      ...filter,
      [type]: value,
    });
  };

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
          className="is-flex-grow-1 is-flex is-flex-wrap-wrap is-relative"
          style={{zIndex: 2}}
        >
          <div className="is-flex-grow-1 px-5 my-5">
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
          <div className="is-flex-grow-1 px-5 my-5">
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
          <div className="is-flex-grow-1 px-5 my-5">
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
          <div className="is-flex-grow-1 px-5 my-5">
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
          <div  className="is-flex-grow-1 px-5 my-5">
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
