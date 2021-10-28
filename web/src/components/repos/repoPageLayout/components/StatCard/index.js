import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Tooltip from '../../../../Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import styles from './StatCard.module.scss'

const StatCard = ({ title, value, tooltip }) => (
  <div className={clsx('column mx-20 m-5 border-radius-4px', styles['card'])}>
    <div className={clsx('is-size-7', styles['card-title'])}>
      <span className="mr-8 is-uppercase">{title}</span>
      <Tooltip text={tooltip}>
        <FontAwesomeIcon icon={faInfoCircle} />
      </Tooltip>
    </div>
    <div
      className={clsx('is-size-3 has-text-weight-semibold has-text-deep-black', styles['card-subtitle'])}>{value}</div>
  </div>
);


StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  tooltip: PropTypes.string.isRequired,
};

export default StatCard;
