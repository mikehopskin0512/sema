/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { find } from 'lodash';
import PropTypes from 'prop-types';
import { EMOJIS, TAGS } from './constants';
import styles from './item.module.scss';

const ActivityItem = (props) => {
  const {
    comment, reaction, tags, createdAt, userId, githubMetadata,
  } = props;

  const {
    firstName,
    lastName,
    avatarUrl,
  } = userId;

  const { title, url, user: { login } } = githubMetadata;

  const [emojiReaction] = useState(find(EMOJIS, { _id: reaction }));
  const [dateCreated] = useState(format(new Date(createdAt), 'dd MMM, yyyy'));

  return (
    <div className="has-background-white py-20 px-25 border-radius-4px is-flex">
      <figure className="image is-64x64 mr-20 is-hidden-mobile">
        <img className="is-rounded" src={avatarUrl} alt="user_icon" />
      </figure>
      <div className="is-flex-grow-1">
        <div className="is-flex is-justify-content-space-between is-flex-wrap-wrap">
          <div className="is-flex is-flex-wrap-no-wrap is-align-items-center">
            <img className={clsx('is-rounded border-radius-24px is-hidden-desktop mr-5', styles.avatar)} src={avatarUrl} alt="user_icon" />
            <p className="is-size-7 has-text-deep-black">
              <a href={`https://github.com/${login}`} className="has-text-deep-black is-underlined" target="_blank" rel="noreferrer">{firstName} {lastName}</a>
              {' reviewed '}
              <a href={url} className="has-text-deep-black is-underlined" target="_blank" rel="noreferrer">{title || 'a pull request'}</a>
            </p>
          </div>
          <p className={clsx('is-size-8 is-hidden-mobile', styles.date)}>{dateCreated}</p>
        </div>
        <div className="is-flex is-align-items-center is-flex-wrap-wrap">
          <div className="has-text-deep-black has-text-weight-semibold is-size-5 is-size-7-mobile is-flex">
            <span className="mr-8">{emojiReaction.emoji}</span>
            <div dangerouslySetInnerHTML={{ __html: emojiReaction.title }} />
          </div>
          { tags.length > 0 ? (
            <>
              <div className="is-divider-vertical" />
              <div className="is-flex is-flex-wrap-wrap">
                {tags.map((_id) => (
                  <span className="tag is-dark is-rounded is-italic has-text-weight-bold is-size-8 mr-5 my-2">{find(TAGS, { _id }).label}</span>
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
  userId: {
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
  userId: PropTypes.object,
  githubMetadata: PropTypes.object,
};

export default ActivityItem;
