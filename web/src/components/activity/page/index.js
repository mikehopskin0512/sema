import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { compact, findIndex, uniqBy, isEmpty } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import ActivityItem from '../item';
import CustomSelect from '../select';

import { ReactionList, TagList } from '../../../data/activity';

const defaultAvatar = 'https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255710-stock-illustration-avatar-vector-male-profile-gray.jpg';

const ActivityPage = () => {
  const { repositories } = useSelector((state) => ({
    repositories: state.repositoriesState,
  }));
  const { data: { overview } } = repositories;

  const [filter, setFilter] = useState({
    from: [],
    to: [],
    reactions: [],
    tags: [],
    search: '',
  });
  const [filterUserList, setFilterUserList] = useState([]);
  const [filterPRList, setFilterPRList] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);

  useEffect(() => {
    if (!overview?.smartcomments?.length) {
      return;
    }
    const users = overview.smartcomments.map((item) => {
      const { userId: user } = item;
      if (user) {
        const { firstName = '', lastName = '', _id = '', avatarUrl = '', username = 'User@email.com' } = user;
        return {
          label: isEmpty(firstName) && isEmpty(lastName) ? username.split('@')[0] : `${firstName} ${lastName}`,
          value: _id,
          img: isEmpty(avatarUrl) ? defaultAvatar : avatarUrl,
        };
      }
    });
    const prs = overview.smartcomments.map((item) => {
      if (item && item.githubMetadata) {
        const { githubMetadata: { title = '', pull_number: pullNum = '' } } = item;
        return {
          label: `${title || 'PR'} #${pullNum || ''}`,
          value: pullNum,
        };
      }
      return null;
    });
    setFilterUserList(uniqBy(users, 'value'));
    setFilterPRList(uniqBy(compact(prs), 'value'));
  }, [overview]);

  useEffect(() => {
    if (overview && overview.smartcomments) {
      let filtered = overview.smartcomments || [];
      if (
        !isEmpty(filter.from) ||
        !isEmpty(filter.to) ||
        !isEmpty(filter.reactions) ||
        !isEmpty(filter.tags) ||
        !isEmpty(filter.search)
      ) {
        filtered = overview.smartcomments.filter((item) => {
          const fromIndex = item?.userId ? findIndex(filter.from, { value: item.userId._id }) : -1;
          const toIndex = item?.githubMetadata ? findIndex(filter.to, { value: item?.githubMetadata?.pull_number }) : -1;
          const reactionIndex = findIndex(filter.reactions, { value: item?.reaction });
          const tagsIndex = item?.tags ? findIndex(filter.tags, (tag) => findIndex(item.tags, (commentTag) => commentTag._id === tag.value) !== -1) : -1;
          const searchBool = item?.comment?.toLowerCase().includes(filter.search.toLowerCase());
          let filterBool = true;
          if (!isEmpty(filter.from)) {
            filterBool = filterBool && fromIndex !== -1;
          }
          if (!isEmpty(filter.to)) {
            filterBool = filterBool && toIndex !== -1;
          }
          if (!isEmpty(filter.reactions)) {
            filterBool = filterBool && reactionIndex !== -1;
          }
          if (!isEmpty(filter.tags)) {
            filterBool = filterBool && tagsIndex !== -1;
          }
          if (!isEmpty(filter.search)) {
            filterBool = filterBool && searchBool;
          }
          return filterBool;
        });
      }
      setFilteredComments(filtered);
    }
  }, [overview, filter]);

  const onChangeFilter = (type, value) => {
    setFilter({
      ...filter,
      [type]: value,
    });
  };

  return(
    <>
      <div className="has-background-white border-radius-4px px-25 py-10 is-flex is-flex-wrap-wrap">
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
                options: filterPRList,
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
      {filteredComments.length ? filteredComments.map((item) => (
        <div className="my-10" key={`activity-${item._id}`} >
          <ActivityItem {...item} />
        </div>
      )) : (
        <div className="my-10 p-20 has-background-white">
          <p>No activity found!</p>
        </div>
      )}
    </>
  )
}

export default ActivityPage;
