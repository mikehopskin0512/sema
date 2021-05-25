import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import styles from './badge.module.scss';

const Badge = ({ label }) => {
  let className = '';
  switch (label) {
    case 'Active':
      className = 'has-text-success has-background-success-light';
      break;
    case 'Waitlisted':
      className = 'has-text-link has-background-link-light';
      break;
    case 'Blocked':
      className = 'has-text-danger has-background-danger-light';
      break;
    case 'Disabled':
      className = 'has-text-dark has-background-danger-light';
      break;
    default:
      className = 'has-text-dark has-background-danger-light';
      break;
  }

  return (
    <div className={clsx(styles.badge, className)}>
      {label}
    </div>
  );
};

Badge.propTypes = {
  label: PropTypes.string.isRequired,
};

export default Badge;
