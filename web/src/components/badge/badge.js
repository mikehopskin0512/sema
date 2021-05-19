import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import styles from './badge.module.scss';

const Badge = ({ color, label }) => (
  <div className={clsx(styles.badge, styles[color])}>
    {label}
  </div>
);

Badge.propTypes = {
  color: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default Badge;
