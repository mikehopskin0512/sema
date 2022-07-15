/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useMemo, useState } from 'react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { capitalize, find, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import Markdown from 'markdown-to-jsx';
import { DEFAULT_AVATAR } from '../../../utils/constants';
import { DATE_TIME_FORMAT } from '../../../utils/constants/date';
import { EMOJIS } from './constants';
import styles from './item.module.scss';
import { DotIcon } from '../../Icons';

function ActivityItem(props) {
  const {
    className,
    comment = '',
    reaction = '',
    tags = [],
    createdAt = '',
    userId: user,
    source: {
      createdAt: sourceCreatedAt = '',
    },
    githubMetadata: {
      title = '',
      url = '#',
      user: { login = '' },
      pull_number: pullNumber = '',
      commentId = '',
      requester = 'Github User',
      repo,
      created_at = ''
    },
    isSnapshot = false,
  } = props;

  const {
    username = 'User@email.com',
    firstName = '',
    lastName = '',
    avatarUrl = DEFAULT_AVATAR,
  } = user || {};

  const dateCreated = useMemo(() => {
    const date = isEmpty(created_at) ? sourceCreatedAt : created_at;
    if (!isEmpty(date)) {
      return format(new Date(date), DATE_TIME_FORMAT)
    }
    return ''
  }, [created_at, sourceCreatedAt])

  const getPRName = (number, name) => {
    let prName = '';
    if (!isEmpty(name)) {
      prName = name;
    } else {
      prName = 'Pull Request';
    }
    if (!isEmpty(number)) {
      prName += ` (#${number})`;
    }
    return prName;
  };

  const getPRUrl = () => {
    let prUrl = url;
    prUrl = prUrl.replace('/files', '');

    if (prUrl.includes('pullrequestreview')) {
      const slug = prUrl.split('#').pop();
      prUrl = prUrl.replace(`#${slug}`, '');
    }

    if (!prUrl.includes('/pull/')) {
      prUrl += `/pull/${pullNumber}`;
    }

    if (!isEmpty(commentId)) {
      if (/^r/i.test(commentId)) {
        prUrl += `#discussion_${commentId}`;
        return prUrl;
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
        <div
          className="has-text-black-950 has-text-weight-semibold"
          dangerouslySetInnerHTML={{ __html: emojiTitle }}
        />
      </>
    );
  };

  return (
    <div
      className={clsx(
        `has-background-white py-20 ${
          isSnapshot ? 'px-20 mr-15' : 'px-25'
        } border-radius-4px is-flex`,
        styles['comment-wrapper'],
        className
      )}
    >
      <img
        className={clsx(
          'is-rounded border-radius-35px mr-10 is-hidden-touch',
          styles.avatar
        )}
        src={avatarUrl}
        alt="user_icon"
      />
      <div className="is-flex-grow-1">
        <div
          className={clsx(
            'is-flex is-justify-content-space-between is-flex-wrap-wrap is-full-width',
            styles['comment-meta']
          )}
        >
          <div className="is-flex is-flex-wrap-no-wrap is-align-items-center">
            <img
              className={clsx(
                'is-rounded border-radius-24px is-hidden-desktop mr-5',
                styles.avatar
              )}
              src={avatarUrl}
              alt="user_icon"
            />
            <div className={styles['header-info-wrapper']}>
              <p className="has-text-black-950">
                {!isEmpty(firstName) ? (
                  <a
                    href={`https://github.com/${login}`}
                    className="has-text-black-950 has-text-weight-semibold"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {firstName} {lastName}
                  </a>
                ) : (
                  <span className="has-text-black-950 has-text-weight-semibold">
                    {username.split('@')[0] || 'User'}
                  </span>
                )}
                <span className="has-text-gray-700">{' reviewed '}</span>
                <a
                  href={getPRUrl()}
                  className="has-text-black-950 has-text-weight-semibold"
                  target="_blank"
                  rel="noreferrer"
                >
                  {getPRName(pullNumber, title)}
                </a>
                {` by ${requester}`}
              </p>
              <p
                className={clsx(
                  'is-size-8 is-hidden-desktop has-text-align-right',
                  styles['date-info-wrapper'],
                  styles.date
                )}
              >
                {repo && (
                  <span className="has-text-black-950 has-text-weight-semibold">
                    {capitalize(repo)} |
                  </span>
                )}{' '}
                {dateCreated}
              </p>
            </div>
          </div>
          <p className={clsx('is-size-8 is-hidden-touch', styles.date)}>
            {repo && (
              <span className="has-text-black-950 has-text-weight-semibold">
                {capitalize(repo)} |
              </span>
            )}{' '}
            {dateCreated}
          </p>
        </div>
        <div className="mt-8 is-flex is-align-items-center is-flex-wrap-wrap">
          <div className="is-size-5 is-flex">{renderEmoji()}</div>
          {tags.length > 0 ? (
            <>
              <DotIcon size="tiny" className="mx-24 has-text-black-950" />
              <div className="is-flex is-flex-wrap-wrap">
                {tags.map(({ label }) => (
                  <span
                    key={`tag-${label}`}
                    className="tag has-background-gray-200 has-text-black-950 has-text-weight-bold is-size-7 mr-5 my-2"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div className={isSnapshot ? '' : 'py-25'} />
          )}
        </div>
        <div
          className={clsx(
            isSnapshot ? 'my-3' : 'my-8',
            'is-size-7 has-text-black-950',
            styles['item-comment']
          )}
        >
          <Markdown>{comment}</Markdown>
        </div>
      </div>
    </div>
  );
}

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
