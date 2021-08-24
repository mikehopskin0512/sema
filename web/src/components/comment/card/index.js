/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import styles from './card.module.scss';

import { authOperations } from '../../../state/features/auth';

const { setCollectionIsActive } = authOperations;

const Card = ({ isActive, collectionData, addNewComment }) => {
  const router = useRouter();
  const { token } = useSelector((state) => state.authState);
  const dispatch = useDispatch();

  const { asPath } = router;

  const [active, setActive] = useState(isActive ? 'checked' : false);

  const onClickChild = (e) => {
    e.stopPropagation();
  };

  if (collectionData) {
    const { _id = '', name = '', description = '', comments = [] } = collectionData;

    const onChangeToggle = (cb) => {
      cb.stopPropagation();
      setActive(cb.checked);
      dispatch(setCollectionIsActive(_id, token));
    };
  
    const onClickAddComment = () => {
      if (addNewComment) {
        addNewComment(_id);
      }
    };

    const clickOnCard = () => {
      if (asPath === '/collections') {
        window.location = `/collections/${_id}`;
      }
      if (asPath === '/guides') {
        window.location = `/guides/${_id}`;
      }
    };

    return (
      <div className={clsx('p-10 is-flex is-flex-grow-1 is-clickable', styles.card)} onClick={clickOnCard} aria-hidden="true">
        <div className="box has-background-white is-full-width p-0 border-radius-2px is-clipped is-flex is-flex-direction-column">
          <div className="has-background-gray-300 is-flex is-justify-content-space-between p-12 is-align-items-center">
            <p className={clsx('has-text-black-2 has-text-weight-semibold is-size-5 pr-10', styles.title)}>{name}</p>
            { asPath === '/collections' && (
              <div className="field" onClick={onClickChild} aria-hidden>
                <input id={`activeSwitch-${_id}`} type="checkbox" onClick={onChangeToggle} name={`activeSwitch-${_id}`} className="switch is-rounded" checked={active} />
                <label htmlFor={`activeSwitch-${_id}`} />
              </div>
            ) }
          </div>
          <div className="is-flex-grow-1 is-flex is-flex-direction-column is-justify-content-space-between">
            <p className={clsx('is-size-7 is-clipped is-fullwidth mr-20 p-12')}>{description}</p>
            <div className="is-flex is-justify-content-flex-start is-flex-wrap-wrap">
              <div className="p-12 is-flex-grow-2 is-flex-flex-wrap is-flex is-align-items-flex-end">
                <div className={clsx(
                  'has-background-gray-4 border-radius-8px p-10 is-flex is-align-items-center',
                )}>
                  <p className="is-size-5 has-text-weight-semibold has-text-black mr-8">{comments.length}</p>
                  <p className={clsx('is-size-8 has-text-weight-semibold has-text-stat is-uppercase')}>comments</p>
                </div>
              </div>
              {name.toLowerCase() === 'my comments' || name.toLowerCase() === 'custom comments' ? (
                <div className={clsx('py-12 is-flex is-flex-grow-1 pl-12 pr-12')} onClick={onClickChild} aria-hidden>
                  <div
                    className={clsx('button is-primary is-outlined is-clickable is-fullwidth has-text-weight-semibold py-20',
                      styles['add-button'])}
                    onClick={onClickAddComment}
                    aria-hidden
                  >
                    <FontAwesomeIcon icon={faPlus} className="mr-10" />
                    Add a comment
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
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
