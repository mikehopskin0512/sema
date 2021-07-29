import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { compact, findIndex, uniqBy, isEmpty } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import ActivityItem from '../../../components/activity/item';
import CustomSelect from '../../../components/activity/select';
import Sidebar from '../../../components/sidebar';
import withLayout from '../../../components/layout';
import { commentsOperations } from '../../../state/features/comments';

import { ReactionList, TagList } from '../data';

const { fetchSmartComments } = commentsOperations;

const ActivityLogs = () => {
  const dispatch = useDispatch();
  const { comments, auth } = useSelector((state) => ({
    comments: state.commentsState,
    auth: state.authState,
  }));
  const { token } = auth;

  const {
    query: { repoId },
  } = useRouter();

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
    dispatch(fetchSmartComments(repoId, token));
  }, [dispatch, repoId]);

  useEffect(() => {
    const users = comments.smartComments.map((item) => {
      const { userId } = item;
      if (userId) {
        const { firstName, lastName, _id, avatarUrl } = item;
        return {
          label: `${firstName} ${lastName}`,
          value: _id,
          img: avatarUrl,
        };
      }
    });
    const prs = comments.smartComments.map((item) => {
      const { githubMetadata: { title, pull_number: pullNum } } = item;
      return {
        label: `${title || 'PR'} #${pullNum}`,
        value: pullNum,
      };
    });
    setFilterUserList(uniqBy(users, 'value'));
    setFilterPRList(uniqBy(prs, 'value'));
  }, [comments]);

  useEffect(() => {
    let filtered = comments.smartComments;
    if (
      !isEmpty(filter.from) ||
      !isEmpty(filter.to) ||
      !isEmpty(filter.reactions) ||
      !isEmpty(filter.tags) ||
      !isEmpty(filter.search)
    ) {
      filtered = comments.smartComments.filter((item) => {
        const fromIndex = findIndex(filter.from, { value: item.userId._id });
        const toIndex = findIndex(filter.to, { value: item.githubMetadata.pull_number });
        const reactionIndex = findIndex(filter.reactions, { value: item.reaction });
        const tagsIndex = findIndex(filter.tags, (tag) => item.tags.includes(tag.value));
        const searchBool = item.comment.toLowerCase().includes(filter.search.toLowerCase());
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
  }, [comments.smartComments, filter]);

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
          <div className="is-flex-grow-1 is-flex is-flex-wrap-wrap">
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
        {filteredComments.length > 0 ? filteredComments.map((item) => (
          <div className="my-10">
            <ActivityItem {...item} />
          </div>
        )) : (
          <div className="my-10 p-20 has-background-white">
            <p>No activity found!</p>
          </div>
        )}
      </Sidebar>
    </div>
  );
};

export default withLayout(ActivityLogs);
