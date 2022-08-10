import React, { useEffect, useState, forwardRef, useRef } from 'react';
import PropTypes from 'prop-types';
import { isElementOverflow } from '../../../utils';
import Tooltip from '../index';
import styles from "../tooltip.module.scss"

const OverflowTooltip = ({ text, typographyStyle = '' }) => {
  const ref = useRef()
  const [refState, setRefState] = useState(null);

  useEffect(() => {
    /* 
      The state is needed here because some features of our app removes the DOM and renders it again
      and we need to save the state of the reference on first render so the tooltip could work.
    */
    if (ref?.current) {
      setRefState(ref.current);
    }
  }, [ref])

  return (
    <>
      <Tooltip className={styles['overflow-tooltip']} text={text} isActive={isElementOverflow(refState)}>
        <p ref={ref} className={typographyStyle}>{text}</p>
      </Tooltip>
    </>
  )
};

OverflowTooltip.propTypes = {
  typographyStyle: PropTypes.string,
  text: PropTypes.string.isRequired,
};

export default OverflowTooltip;
