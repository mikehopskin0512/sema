/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { find, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import Markdown from 'markdown-to-jsx';
import { DEFAULT_AVATAR } from '../../../utils/constants';
import { EMOJIS } from './constants';
import styles from './item.module.scss';
import { DotIcon } from '../../Icons';

const ActivityItem = (props) => {
  const {
    className,
    comment = '',
    reaction = '',
    tags = [],
    createdAt = '',
    userId: user,
    githubMetadata: {
      title = '',
      url = '#',
      user: {
        login = '',
      },
      pull_number = '',
      commentId = '',
      requester = 'Github User',
    },
    isSnapshot = false,
  } = props;

  const {
    username = 'User@email.com',
    firstName = '',
    lastName = '',
    avatarUrl = DEFAULT_AVATAR,
  } = user || {};

  const [dateCreated] = useState(!isEmpty(createdAt) ? format(new Date(createdAt), 'MMM dd, yyyy hh:mm aa') : '');

  const getPRName = (pull_num, pr_name) => {
    let prName = '';
    if (!isEmpty(pr_name)) {
      prName = pr_name;
    } else {
      prName = 'Pull Request';
    }
    if (!isEmpty(pull_num)) {
      prName += ` (#${pull_num})`;
    }
    return prName;
  };

  const getPRUrl = () => {
    let prUrl = url;
    prUrl = prUrl.replace("/files", "");
    
    if (prUrl.includes("pullrequestreview")) {
      const slug = prUrl.split("#").pop();
      prUrl = prUrl.replace(`#${slug}`, "");
    }

    if (!isEmpty(commentId)) {
      if (/^r/i.test(commentId)) {
        return prUrl += `#discussion_${commentId}`;
      }
      prUrl += `#${commentId}`;
    }
    return prUrl;
  };

  const renderEmoji = () => {
    const { title: emojiTitle, Icon } = find(EMOJIS, { _id: reaction });
    return (
      <>
        <Icon className="mr-8" />
        <div className="has-text-black-950 has-text-weight-semibold" dangerouslySetInnerHTML={{ __html: emojiTitle }} />
      </>
    );
  };

  return (
    <div className={clsx(`has-background-white py-20 ${isSnapshot ? 'px-10 mr-15' : 'px-25'} border-radius-4px is-flex`, className)}>
      <img className={clsx("is-rounded border-radius-35px mr-10 is-hidden-touch", styles.avatar)} src={avatarUrl} alt="user_icon" />
      <div className="is-flex-grow-1">
        <div className="is-flex is-justify-content-space-between is-flex-wrap-wrap">
          <div className="is-flex is-flex-wrap-no-wrap is-align-items-center">
            <img className={clsx('is-rounded border-radius-24px is-hidden-desktop mr-5', styles.avatar)} src={avatarUrl} alt="user_icon" />
            <p className="is-size-7 has-text-black-950">
              {!isEmpty(firstName) ?
                <a href={`https://github.com/${login}`} className="has-text-black-950 has-text-weight-semibold" target="_blank" rel="noreferrer">{firstName} {lastName}</a> :
                <span className="has-text-black-950 has-text-weight-semibold">{username.split('@')[0] || 'User'}</span>}
              <span className='has-text-gray-700'>{' reviewed '}</span>
              <a href={getPRUrl()} className="has-text-black-950 has-text-weight-semibold" target="_blank" rel="noreferrer">
                {getPRName(pull_number, title)}
              </a>
              {` by ${requester}`}
            </p>
          </div>
          <p className={clsx('is-size-8 is-hidden-touch', styles.date)}>{dateCreated}</p>
        </div>
        <div className="mt-8 is-flex is-align-items-center is-flex-wrap-wrap">
          <div className="is-size-5 is-size-7-mobile is-flex">
            {renderEmoji()}
          </div>
          {tags.length > 0 ? (
            <>
              <DotIcon size="tiny" className="mx-24 has-text-black-950" />
              <div className="is-flex is-flex-wrap-wrap">
                {tags.map(({ label }) => (
                  <span key={`tag-${label}`} className="tag has-background-gray-200 has-text-black-950 has-text-weight-bold is-size-7 mr-5 my-2">{label}</span>
                ))}
              </div>
            </>
          ) : <div className={isSnapshot ? '' : 'py-25'} />}
        </div>
        <div className={clsx(isSnapshot ? 'my-3' : 'my-8', 'is-size-7 has-text-black-950', styles['item-comment'])}>
          <Markdown>
            {comment}
          </Markdown>
        </div>
        <p className={clsx('is-size-8 is-hidden-desktop has-text-align-right', styles.date)}>{dateCreated}</p>
      </div>
    </div>
  );
};

ActivityItem.defaultProps = {
  className: '',
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
  isSnapshot: false,
};

ActivityItem.propTypes = {
  className: PropTypes.string,
  comment: PropTypes.string.isRequired,
  reaction: PropTypes.string.isRequired,
  tags: PropTypes.array,
  createdAt: PropTypes.string.isRequired,
  user: PropTypes.object,
  githubMetadata: PropTypes.object,
  userId: PropTypes.string.isRequired,
  isSnapshot: PropTypes.bool,
};

export default ActivityItem;
