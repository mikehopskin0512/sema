import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { compact, findIndex, uniqBy, isEmpty } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import ActivityItem from '../item';
import CustomSelect from '../select';

import { ReactionList, TagList } from '../../../data/activity';

const defaultAvatar = '/img/default-avatar.jpg';

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
    pr: [],
  });
  // TODO: it will be better to use useReducer here
  const [filterUserList, setFilterUserList] = useState([]);
  const [filterRequesterList, setFilterRequesterList] = useState([]);
  const [filterPRList, setFilterPRList] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);

  useEffect(() => {
    if (!overview?.smartcomments?.length) {
      return;
    }
    const requesters = overview.smartcomments
      .filter((item) => item.githubMetadata.requester)
      .map((({ githubMetadata }) => ({
        label: githubMetadata.requester,
        value: githubMetadata.requester,
        img: defaultAvatar,
      })))
    const users = overview.smartcomments.filter((item) => item.userId).map((item) => {
      const { firstName = '', lastName = '', _id = '', avatarUrl = '', username = 'User@email.com' } = item.userId;
      return {
        label: isEmpty(firstName) && isEmpty(lastName) ? username.split('@')[0] : `${firstName} ${lastName}`,
        value: _id,
        img: isEmpty(avatarUrl) ? defaultAvatar : avatarUrl,
      };
    });
    const prs = overview.smartcomments.filter((item) => item.githubMetadata).map((item) => {
        const { githubMetadata: { head, title = '', pull_number: pullNum = '' } } = item;
        const prName = title || head || 'PR'
        return {
          label: `${prName} #${pullNum || ''}`,
          value: pullNum,
        };
      });

    setFilterRequesterList(uniqBy(requesters, 'value'))
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
        !isEmpty(filter.search) ||
        !isEmpty(filter.pr)
      ) {
        filtered = overview.smartcomments.filter((item) => {
          const fromIndex = item?.userId ? findIndex(filter.from, { value: item.userId._id }) : -1;
          const toIndex = item?.githubMetadata ? findIndex(filter.to, { value: item?.githubMetadata?.requester }) : -1;
          const prIndex = item?.githubMetadata ? findIndex(filter.pr, { value: item?.githubMetadata?.pull_number }) : -1;
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
          if (!isEmpty(filter.pr)) {
            filterBool = filterBool && prIndex !== -1;
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
