/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { get, find, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { EMOJIS } from './constants';
import styles from './item.module.scss';

const defaultAvatar = 'https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255710-stock-illustration-avatar-vector-male-profile-gray.jpg';

const ActivityItem = (props) => {
  const {
    comment = '',
    reaction = '',
    tags = [],
    createdAt = '',
    userId: user = {
      firstName: '',
      avatarUrl: '',
      lastName: '',
    },
    githubMetadata = {
      title: '',
      url: '#',
      user: {
        login: '',
      },
      pull_number: '',
      commentId: '',
    },
  } = props;

  const { title, url, user: { login = '' }, pull_number, commentId, } = githubMetadata;

  const [dateCreated] = useState(!isEmpty(createdAt) ? format(new Date(createdAt), 'dd MMM, yyyy') : '');

  const getPRName = (pull_num, pr_name) => {
    let prName = '';
    if (!isEmpty(pull_num)) {
      prName = `PR #${pull_num} `;
    }
    if (!isEmpty(pr_name)) {
      prName += pr_name;
    }
    if (isEmpty(prName)) {
      return 'a pull request';
    }
    return prName;
  }

  const getPRUrl = () => {
    let prUrl = url;
    if (!isEmpty(commentId)) {
      prUrl += `#${commentId}`
    }
    return prUrl;
  }

  const renderEmoji = () => {
    const { emoji, title: emojiTitle } = find(EMOJIS, { _id: reaction });
    return (
      <>
        <span className="mr-8">{emoji}</span>
        <div dangerouslySetInnerHTML={{ __html: emojiTitle }} />
      </>
    );
  };

  return (
    <div className="has-background-white py-20 px-25 border-radius-4px is-flex">
      {user ? (
        <img className={clsx("is-rounded border-radius-35px mr-10 is-hidden-mobile", styles.avatar)} src={isEmpty(user.avatarUrl) ? defaultAvatar : user.avatarUrl} alt="user_icon" />
      ) : null }
      <div className="is-flex-grow-1">
        <div className="is-flex is-justify-content-space-between is-flex-wrap-wrap">
          <div className="is-flex is-flex-wrap-no-wrap is-align-items-center">
            <img className={clsx('is-rounded border-radius-24px is-hidden-desktop mr-5', styles.avatar)} src={isEmpty(user.avatarUrl) ? defaultAvatar : user.avatarUrl} alt="user_icon" />
            <p className="is-size-7 has-text-deep-black">
              { user && !isEmpty(user.firstName) ?
                <a href={`https://github.com/${login}`} className="has-text-deep-black is-underlined" target="_blank" rel="noreferrer">{user.firstName} {user.lastName}</a> :
                <span className="has-text-deep-black is-underlined">User</span>}
              {' reviewed '}
              <a href={getPRUrl()} className="has-text-deep-black is-underlined" target="_blank" rel="noreferrer">
                {getPRName(pull_number, title)}
              </a>
            </p>
          </div>
          <p className={clsx('is-size-8 is-hidden-mobile', styles.date)}>{dateCreated}</p>
        </div>
        <div className="is-flex is-align-items-center is-flex-wrap-wrap">
          <div className="has-text-deep-black has-text-weight-semibold is-size-5 is-size-7-mobile is-flex">
            {renderEmoji()}
          </div>
          { tags.length > 0 ? (
            <>
              <div className="is-divider-vertical" />
              <div className="is-flex is-flex-wrap-wrap">
                {tags.map(({ label }) => (
                  <span key={`tag-${label}`} className="tag is-dark is-rounded is-italic has-text-weight-bold is-size-8 mr-5 my-2">{label}</span>
                ))}
              </div>
            </>
          ) : <div className="py-25" />}
        </div>
        <div className="my-10">
          <p className="is-size-7 has-text-deep-black">{comment}</p>
        </div>
        <p className={clsx('is-size-8 is-hidden-desktop has-text-align-right', styles.date)}>{dateCreated}</p>
      </div>
    </div>
  );
};

ActivityItem.defaultProps = {
  tags: [],
  user: {
    firstName: '',
    lastName: '',
    avatarUrl: '',
  },
  githubMetadata: {
    title: '',
    url: '',
  },
};

ActivityItem.propTypes = {
  comment: PropTypes.string.isRequired,
  reaction: PropTypes.string.isRequired,
  tags: PropTypes.array,
  createdAt: PropTypes.string.isRequired,
  user: PropTypes.object,
  githubMetadata: PropTypes.object,
};

export default ActivityItem;
