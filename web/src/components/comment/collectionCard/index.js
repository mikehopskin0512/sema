/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import styles from './collectionCard.module.scss';

import { authOperations } from '../../../state/features/auth';

const { setCollectionIsActive } = authOperations;

const CollectionCard = ({ isActive, collectionData }) => {
  const { token } = useSelector((state) => state.authState);
  const dispatch = useDispatch();

  const [active, setActive] = useState(isActive ? 'checked' : false);
  const { _id, name, description, comments = [] } = collectionData;

  const onChangeToggle = (cb) => {
    cb.stopPropagation();
    setActive(cb.checked);
    dispatch(setCollectionIsActive(_id, token));
  };

  const renderStats = (label, value) => (
    <div className={clsx(
      'has-background-gray-4 border-radius-8px p-10 is-full-width is-flex is-flex-direction-column is-justify-content-space-between',
    )}>
      <p className={clsx('is-size-8 has-text-weight-semibold has-text-stat is-uppercase')}>{label}</p>
      <p className="is-size-4 has-text-weight-semibold has-text-black">{value}</p>
    </div>
  );
  // TODO: Favorited

  const clickOnCard = () => {
    window.location = `/collections/${_id}`;
  };

  const onClickChild = (e) => {
    e.stopPropagation();
  };

  return (
    <div className={clsx('p-10 is-flex is-flex-grow-1 is-clickable', styles.card)} onClick={clickOnCard} aria-hidden="true">
      <div className="box has-background-white is-full-width p-0 border-radius-2px is-clipped is-flex is-flex-direction-column">
        <div className="has-background-gray-300 is-flex is-justify-content-space-between p-12 is-align-items-center">
          <p className="has-text-black-2 has-text-weight-semibold is-size-5">{name}</p>
          <div className="field" onClick={onClickChild} aria-hidden>
            <input id={`activeSwitch-${_id}`} type="checkbox" onClick={onChangeToggle} name={`activeSwitch-${_id}`} className="switch is-rounded" checked={active} />
            <label htmlFor={`activeSwitch-${_id}`} />
          </div>
        </div>
        <div className="is-flex-grow-1 is-flex is-flex-direction-column is-justify-content-space-between">
          <p className={clsx('is-size-7 is-clipped is-fullwidth mr-20 p-12')}>{description}</p>
          <div className="is-flex is-justify-content-flex-start is-flex-wrap-wrap">
            <div className={clsx('my-12 is-flex pl-12', styles.stat)}>
              {renderStats('Suggested Comments', comments.length)}
            </div>
            <div className={clsx('my-12 is-flex pl-12', styles.stat)}>
              {renderStats('Favorited', 0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CollectionCard.propTypes = {
  isActive: PropTypes.bool.isRequired,
  collectionData: PropTypes.object.isRequired,
};

export default CollectionCard;
