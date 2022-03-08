import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { isElementOverflow } from '../../../utils';
import Tooltip from '../index';

const OverflowTooltip = ({ text, children, childRef }) => {
  const renderComponent = useCallback(() => {
    if (childRef.current && isElementOverflow(childRef.current)) {
      return (
        <Tooltip text={text} isActive={isElementOverflow(childRef.current)}>
          {children}
        </Tooltip>
      );
    }
    return children;
  }, [children, childRef, text]);

  return (
    <>
      {renderComponent()}
    </>
  );
};

OverflowTooltip.propTypes = {
  children: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
  childRef: PropTypes.object.isRequired,
};

export default OverflowTooltip;
