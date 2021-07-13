/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { find } from 'lodash';
import PropTypes from 'prop-types';
import { EMOJIS, TAGS } from './constants';
import styles from './item.module.scss';

const ActivityItem = (props) => {
  const { comment, reaction, tags, createdAt } = props;

  const [emojiReaction] = useState(find(EMOJIS, { _id: reaction }));
  const [dateCreated] = useState(format(new Date(createdAt), 'dd MMM, yyyy'));

  return (
    <div className="has-background-white py-20 px-25 border-radius-4px is-flex">
      <figure className="image is-64x64 mr-20 is-hidden-mobile">
        <img className="is-rounded" src="https://bulma.io/images/placeholders/64x64.png" alt="user_icon" />
      </figure>
      <div className="is-flex-grow-1">
        <div className="is-flex is-justify-content-space-between is-flex-wrap-wrap">
          <div className="is-flex is-flex-wrap-no-wrap">
            <figure className="image is-48x48 mt-5 mr-5 is-hidden-desktop">
              <img className="is-rounded" src="https://bulma.io/images/placeholders/64x64.png" alt="user_icon" />
            </figure>
            <p className="is-size-7 has-text-deep-black">
              <a href="#" className="has-text-deep-black is-underlined">John Smith</a>
              {' reviewed '}
              <a href="#" className="has-text-deep-black is-underlined">PHX-1010 Script</a>
            </p>
          </div>
          <p className={clsx('is-size-8', styles.date)}>{dateCreated}</p>
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
                  <span className="tag is-dark is-rounded is-italic has-text-weight-bold is-size-8 mr-5">{find(TAGS, { _id }).label}</span>
                ))}
              </div>
            </>
          ) : <div className="py-25" />}
        </div>
        <div className="my-10">
          <p className="is-size-7 has-text-deep-black">{comment}</p>
        </div>
      </div>
    </div>
  );
};

ActivityItem.defaultProps = {
  tags: [],
};

ActivityItem.propTypes = {
  comment: PropTypes.string.isRequired,
  reaction: PropTypes.string.isRequired,
  tags: PropTypes.array,
  createdAt: PropTypes.string.isRequired,
};

export default ActivityItem;
