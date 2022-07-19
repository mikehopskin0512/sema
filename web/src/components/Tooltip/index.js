import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import styles from './tooltip.module.scss';

function Tooltip({
  isActive, children, direction, text, showDelay, hideDelay, className
}) {
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
      {isActive && active && (
        <div className={clsx(styles['Tooltip-Tip'], styles[direction])} dangerouslySetInnerHTML={{ __html: text }} />
      )}
    </div>
  );
}

Tooltip.defaultProps = {
  showDelay: 400,
  hideDelay: 0,
  direction: 'top',
  isActive: true,
  className: '',
};

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
  direction: PropTypes.string,
  showDelay: PropTypes.number,
  hideDelay: PropTypes.number,
  isActive: PropTypes.bool,
  className: PropTypes.string,
};

export default Tooltip;
