import React, { useEffect, useState, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { isElementOverflow } from '../../../utils';
import Tooltip from '../index';

const OverflowTooltip = forwardRef(({ text, children }, ref) => {
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
      <Tooltip text={text} isActive={isElementOverflow(refState)}>
        {children}
      </Tooltip>
    </>
  )
});

OverflowTooltip.propTypes = {
  children: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
};

export default OverflowTooltip;
