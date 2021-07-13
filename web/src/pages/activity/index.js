import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import ActivityItem from '../../components/activity/item';
import CustomSelect from '../../components/activity/select';
import Sidebar from '../../components/sidebar';
import withLayout from '../../components/layout';

import { ReactionList, TagList, UserList } from './data';

const ActivityLogs = () => {
  const [filter, setFilter] = useState({
    from: [],
    to: [],
    reactions: [],
    tags: [],
  });

  const onChangeFilter = (type, value) => {
    setFilter({
      ...filter,
      [type]: value,
    });
  };

  return (
    <div>
      <Sidebar>
        <div className="has-background-white border-radius-4px px-25 py-10 is-flex is-flex-wrap-wrap">
          <div className="field is-flex-grow-1 px-5 my-5">
            <p className="control has-icons-left">
              <input className="input has-background-white" type="text" placeholder="Search" />
              <span className="icon is-small is-left">
                <FontAwesomeIcon icon={faSearch} />
              </span>
            </p>
          </div>
          <div className="is-flex-grow-1 is-flex is-flex-wrap-wrap">
            <div className="is-flex-grow-1 px-5 my-5">
              <CustomSelect
                selectProps={{
                  options: UserList,
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
                  options: UserList,
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
          </div>
        </div>
        <div className="my-10">
          <ActivityItem />
        </div>
      </Sidebar>
    </div>
  );
};

export default withLayout(ActivityLogs);
