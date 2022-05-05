import React from 'react';
import { format } from 'date-fns';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import styles from './suggestedCommentCard.module.scss';
import ActionMenu from './actionMenu';
import Checkbox from '../../checkbox';
import PreviewableLink from "./previewableLink";
import Markdown from 'markdown-to-jsx';

const defaultDate = '07/01/2021';

const SuggestedCommentCard = ({ data, selected, onSelectChange, collectionId, isEditable }) => {
  const {
    author = '',
    comment = '',
    tags = [],
    source = {
      name: '',
      url: '',
    },
    sourceMetadata = null,
    title = '',
    createdAt = defaultDate,
    engGuides = [],
    _id,
  } = data;

  return (
    <div className={clsx('has-background-white border-radius-4px px-40 py-20 my-20', styles.container)}>
      <div className={clsx('is-flex is-justify-content-space-between is-align-items-flex-start', styles.title)}>
        <div className="is-flex is-align-items-center">
          { isEditable && (
            <div className={clsx(styles.checkbox)}>
              <Checkbox value={selected} onChange={(value) => onSelectChange(_id, value)} />
            </div>
          ) }
          <p className="has-text-weight-semibold is-size-5 has-text-black-950">{title}</p>
        </div>
        <div className="is-flex">
          <div className="is-flex is-flex-wrap-wrap mr-10">
            {tags.map((item) => (
              <div
                key={`tag-${item.label}`}
                className={clsx('tag is-rounded is-uppercase m-5 is-light is-normal', styles.language)}>
                {item.label}
              </div>
            ))}
          </div>
          {isEditable && (
            <ActionMenu comment={data} />
          )}
        </div>
      </div>
      { isEmpty(author) && isEmpty(source?.name) ? null : (
        <div className="is-flex is-justify-content-space-between is-align-items-center is-flex-wrap-wrap">
          <div className="is-flex is-align-items-center">
            { isEmpty(author) ? null : (
              <>
                <p className="is-size-6 mr-10 has-text-black-950">{isEmpty(author) ? 'user' : author}</p>
                <div className={clsx('mr-10', styles.vl)} />
              </>
            )}
            { isEmpty(source?.name) ? null : (
              <a href={source?.url} target="_blank" rel="noreferrer">
                <button className="button is-text p-0 has-text-black-950" type="button">{source?.name}</button>
              </a>
            ) }
          </div>
        </div>
      ) }
      <p className="has-text-black-950 is-size-6 my-20">
        <Markdown>
          {comment}
        </Markdown>
      </p>
      <div className="is-flex is-justify-content-space-between is-align-items-center mt-10 is-flex-wrap-wrap">
        {/* No data for supporting documents yet */}
        {source && source.url && (
          <p className="is-flex is-size-6 has-text-black-950">
            <b className="mr-5">Related Link:</b>
            <PreviewableLink source={source} sourceMetadata={sourceMetadata}/>
          </p>
        )}
        <span />

        <p className="is-size-8">{format(new Date(createdAt), 'dd MMM, yyyy')}</p>
      </div>
    </div>
  );
};

SuggestedCommentCard.propTypes = {
  data: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
  onSelectChange: PropTypes.func.isRequired,
  collectionId: PropTypes.string.isRequired,
};

export default SuggestedCommentCard;
