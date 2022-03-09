import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import styles from './tooltip.module.scss';

const Tooltip = ({
  children, direction, text, showDelay, hideDelay,
}) => {
  let timeout;
  const [active, setActive] = useState(false);

  const showTip = () => {
    timeout = setTimeout(() => {
      setActive(true);
    }, showDelay);
  };

  const hideTip = () => {
    clearTimeout(timeout);
    setActive(false);
  };

  return (
    <div
      className={clsx(styles['tooltip-Wrapper'])}
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
    >
      {/* Wrapping */}
      {children}
      {active && (
        <div className={clsx(styles['Tooltip-Tip'], styles[direction])}>
          {/* Content */}
          {text}
        </div>
      )}
    </div>
  );
};

Tooltip.defaultProps = {
  showDelay: 400,
  hideDelay: 0,
  direction: 'top',
};

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
  direction: PropTypes.string,
  showDelay: PropTypes.number,
  hideDelay: PropTypes.number,
};

export default Tooltip;
