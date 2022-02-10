import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { InfoOutlineIcon } from '../../../../Icons';
import Tooltip from '../../../../Tooltip';
import styles from './StatCard.module.scss';

const StatCard = ({ title, value, tooltip }) => (
  <div className={clsx('column my-5 mx-10 border-radius-4px has-background-white', styles.card)}>
    <div className={clsx('is-size-7', styles['card-title'])}>
      <span className="mr-8 is-uppercase">{title}</span>
      <Tooltip text={tooltip}>
        <InfoOutlineIcon size="small" />
      </Tooltip>
    </div>
    <div
      className={clsx('is-size-3 has-text-weight-semibold has-text-black-950', styles['card-subtitle'])}>{value}</div>
  </div>
);


StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  tooltip: PropTypes.string.isRequired,
};

export default StatCard;
