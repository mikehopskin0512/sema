import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './tooltip.module.scss';

const Tooltip = ({ text, children }) => {
  return (
    <div className={styles['tooltip']}>
      <div className={styles['tooltip_text']}>{text}</div>
      {children}
    </div>
  );
};

Tooltip.propTypes = {
  text: PropTypes.string.isRequired,
};


export default Tooltip;
