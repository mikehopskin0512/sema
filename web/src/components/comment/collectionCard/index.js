import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import styles from './collectionCard.module.scss';

const CollectionCard = ({ name }) => {
  const renderStats = (label, value) => (
    <div className={clsx(
      'has-background-gray-4 border-radius-8px p-10 is-full-width is-flex is-flex-direction-column is-justify-content-space-between',
    )}>
      <p className={clsx('is-size-8 has-text-weight-semibold has-text-stat is-uppercase')}>{label}</p>
      <p className="is-size-4 has-text-weight-semibold has-text-black">{value}</p>
    </div>
  );
  return (
    <div className={clsx('p-10 is-flex is-flex-grow-1', styles.card)}>
      <div className="box has-background-white is-full-width p-0 border-radius-2px is-clipped is-flex is-flex-direction-column">
        <div className="has-background-gray-300 is-flex is-justify-content-space-between p-12 is-align-items-center">
          <p className="has-text-black-2 has-text-weight-semibold is-size-5">{name}</p>
          {/* SWITCH */}
        </div>
        <div className="is-flex-grow-1 is-flex is-flex-direction-column is-justify-content-space-between">
          <p className={clsx('is-size-7 is-clipped is-fullwidth mr-20 p-12')}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer laoreet vehicula sodales. Donec vestibulum sodales porta. Praesent pellentesque, magna a lacinia vehicula, orci velit hendrerit urna, ut tristique ante urna sed ligula. Duis quis euismod erat, quis hendrerit dolor. Vivamus semper fringilla ipsum, et tempus mauris.
          </p>
          <div className="is-flex is-justify-content-flex-start is-flex-wrap-wrap">
            <div className={clsx('my-12 is-flex pl-12', styles.stat)}>
              {renderStats('Suggested Comments', 20)}
            </div>
            <div className={clsx('my-12 is-flex pl-12', styles.stat)}>
              {renderStats('Favorited', 20)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CollectionCard.defaultProps = {
  name: 'Collection',
};

CollectionCard.propTypes = {
  name: PropTypes.string,
};

export default CollectionCard;
