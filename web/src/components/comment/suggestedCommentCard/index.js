import React from 'react';
import { format } from 'date-fns';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import styles from './suggestedCommentCard.module.scss';

const defaultDate = '07/01/2021';

const SuggestedCommentCard = ({ data }) => {
  const {
    author = '',
    comment = '',
    tags = [],
    source,
    title = '',
    createdAt = defaultDate,
    engGuides = [],
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
      { isEmpty(author) && isEmpty(source.name) ? null : (
        <div className="is-flex is-justify-content-space-between is-align-items-center is-flex-wrap-wrap">
          <div className="is-flex is-align-items-center">
            { isEmpty(author) ? null : (
              <>
                <p className="is-size-6 mr-10 has-text-deep-black">{isEmpty(author) ? 'user' : author}</p>
                <div className={clsx('mr-10', styles.vl)} />
              </>
            )}
            { isEmpty(source.name) ? null : (
              <p className="has-text-deep-black is-size-6"><b>Source: </b> {source.name}</p>
            ) }
          </div>
          { isEmpty(source.name) ? null : (
            <a href={source.url} target="_blank" rel="noreferrer">
              <button className="button is-text is-small p-0 has-text-deep-black" type="button">{source.name}</button>
            </a>
          )}
        </div>
      ) }
      <p className="has-text-deep-black is-size-6 my-20">
        {comment}
      </p>
      <div className="is-flex is-justify-content-space-between is-align-items-center mt-10 is-flex-wrap-wrap">
        {/* No data for supporting documents yet */}
        { engGuides.length > 0 ? (
          <p className="is-size-6 has-text-deep-black">
            <b className="mr-5">Related Eng. Guides:</b>
            <a href={`/engineering/guide/${engGuides[0].engGuide?._id}`}>
              <span className="is-underlined has-text-deep-black">{engGuides[0].engGuide?.title}</span>
            </a>
          </p>
        ) : null }
        <span />
        <p className="is-size-8 has-text-black-6">{format(new Date(createdAt), 'dd MMM, yyyy')}</p>
      </div>
    </div>
  );
};

SuggestedCommentCard.propTypes = {
  data: PropTypes.object.isRequired,
};

export default SuggestedCommentCard;
