/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import styles from './card.module.scss';

import { authOperations } from '../../../state/features/auth';

const { setCollectionIsActive } = authOperations;

const Tag = ({ tag, _id, type }) => (
  <div
    className={
      clsx(
        'tag is-uppercase is-rounded is-size-7 has-text-weight-semibold mr-5',
        type === 'language' ? 'has-text-primary has-background-primary-light' : 'is-light'
      )
    }
    key={`${type}-${tag}-${_id}`}>
    {tag}
  </div>
)

const Card = ({ isActive, collectionData, addNewComment }) => {
  const router = useRouter();
  const { token } = useSelector((state) => state.authState);
  const dispatch = useDispatch();
  const { asPath } = router;

  const renderStats = (label, value) => (
    <div className={clsx(
      'has-background-gray-4 border-radius-8px p-10 is-full-width is-flex is-flex-direction-column is-justify-content-space-between mb-5',
    )}>
      <p className={clsx('is-size-8 has-text-weight-semibold has-text-stat is-uppercase')}>{label}</p>
      <p className="is-size-4 has-text-weight-semibold has-text-black">{value}</p>
    </div>
  );

  const onClickChild = (e) => {
    e.stopPropagation();
  };

  if (collectionData) {
    const { _id = '', name = '', description = '', comments = [], author = '', source, guides = [], languages = [] } = collectionData;
    const onChangeToggle = (e) => {
      e.stopPropagation();
      // TODO: would be great to add error handling here in case of network error
      dispatch(setCollectionIsActive(_id, token));
    };

    const onClickAddComment = () => {
      if (addNewComment) {
        addNewComment(_id);
      }
    };

    const isMyComments = name.toLowerCase() === 'my comments' || name.toLowerCase() === 'custom comments';

    return (
      <Link href={`?cid=${_id}`}>
        <div className={clsx('p-10 is-flex is-flex-grow-1 is-clickable', styles.card)} aria-hidden="true">
          <div className="box has-background-white is-full-width p-0 border-radius-2px is-clipped is-flex is-flex-direction-column">
            <div className="has-background-gray-300 is-flex is-justify-content-space-between p-12 is-align-items-center">
              <p className={clsx('has-text-black-2 has-text-weight-semibold is-size-5 pr-10', styles.title)}>{name}</p>
              { asPath === '/suggested-comments' && (
                <div className="field" onClick={onClickChild} aria-hidden>
                  <input
                    id={`activeSwitch-${_id}`}
                    type="checkbox"
                    onChange={onChangeToggle}
                    name={`activeSwitch-${_id}`}
                    className="switch is-rounded"
                    checked={isActive}
                  />
                  <label htmlFor={`activeSwitch-${_id}`} />
                </div>
              ) }
            </div>
            <div className="is-flex-grow-1 is-flex is-flex-direction-column is-justify-content-space-between">
              <div className="px-12 pt-12 has-text-gray-900 is-size-6 mr-20">
                <p className={clsx("is-fullwidth", styles.title)}>{description}</p>
                {!isMyComments && (
                  <div className="mt-10">
                    <p><span className="has-text-weight-semibold">Source:</span> {source}</p>
                    <p><span className="has-text-weight-semibold">Author:</span> {author}</p>
                  </div>
                )}
              </div>
              <div className="is-flex is-justify-content-space-between">
                <div className="p-12 is-flex-grow-3 is-flex">
                  <div className={clsx(
                    'has-background-gray-4 border-radius-8px p-10 is-flex is-align-items-center',
                  )}>
                    <p className="is-size-5 has-text-weight-semibold has-text-black mr-8">{comments.length}</p>
                    <p className={clsx('is-size-8 has-text-weight-semibold has-text-stat is-uppercase')}>comments</p>
                  </div>
                </div>
                {isMyComments ? (
                  <div className={clsx('py-12 is-flex is-flex-grow-1 pl-12 pr-12')} onClick={onClickChild} aria-hidden>
                    <div
                      className={clsx('button is-primary is-outlined is-clickable is-fullwidth has-text-weight-semibold',
                        styles['add-button'])}
                      onClick={onClickAddComment}
                      aria-hidden
                    >
                      <FontAwesomeIcon icon={faPlus} className="mr-10" />
                      Add a comment
                    </div>
                  </div>
                ) : (
                  <div className="is-flex is-flex-wrap-wrap is-align-items-center mr-10 is-justify-content-flex-end mb-10">
                    {languages.slice(0, 2).map((language) => <Tag tag={language} _id={_id} type="language" />)}
                    {languages.length > 2 && (<Tag tag={`${languages.length-2}+`} _id={_id} type="language" />)}
                    {guides.slice(0, 2).map((guide) => <Tag tag={guide} _id={_id} type="guide" />)}
                    {guides.length > 2 && (<Tag tag={`${guides.length-2}+`} _id={_id} type="guide" />)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }
  return null;
};

Card.propTypes = {
  isActive: PropTypes.bool.isRequired,
  collectionData: PropTypes.object.isRequired,
  addNewComment: PropTypes.func.isRequired,
};

export default Card;
