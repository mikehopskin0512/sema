import React from 'react';
import { format } from 'date-fns';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import styles from './suggestedCommentCard.module.scss';

const defaultDate = '07/01/2021';

const SuggestedCommentCard = ({ data }) => {
  const {
    author, comment, tags, source, title, createdAt = defaultDate,
  } = data;

  return (
    <div className={clsx('has-background-white border-radius-4px px-40 py-20 my-20', styles.container)}>
      <div className={clsx('is-flex is-justify-content-space-between is-align-items-flex-start', styles.title)}>
        <p className="has-text-weight-semibold is-size-5 has-text-deep-black pr-10">{title}</p>
        <div className="is-flex is-flex-wrap-wrap">
          {tags.map((item) => (
            <div
              key={`tag-${item.label}`}
              className={clsx('tag is-rounded is-uppercase m-5 is-light is-normal', styles.language)}>
              {item.label}
            </div>
          ))}
        </div>
      </div>
      <div className="is-flex is-justify-content-space-between is-align-items-center my-10 is-flex-wrap-wrap">
        <div className="is-flex is-align-items-center">
          <img src="/android-chrome-192x192.png" alt="user avatar" className={styles.avatar} />
          <p className="is-size-6 mx-10 has-text-deep-black">{isEmpty(author) ? 'user' : author}</p>
          <div className={styles.vl} />
          <p className="has-text-deep-black is-size-6 mx-10"><b>Source: </b> {source.name}</p>
        </div>
        <a href={source.url} target="_blank" rel="noreferrer">
          <button className="button is-text is-small p-0 has-text-deep-black" type="button">{source.name}</button>
        </a>
      </div>
      <p className="has-text-deep-black is-size-6 my-20">
        {comment}
      </p>
      {/* Needs data for supporting documents and date created */}
      <div className="is-flex is-justify-content-space-between is-align-items-center mt-10 is-flex-wrap-wrap">
        <p className="has-text-deep-black is-size-6"><b>Supporting Documents:</b> Document-007-Props Naming</p>
        <p className="is-size-8 has-text-black-6">{format(new Date(createdAt), 'dd MMM, yyyy')}</p>
      </div>
    </div>
  );
};

SuggestedCommentCard.propTypes = {
  data: PropTypes.object.isRequired,
};

export default SuggestedCommentCard;
