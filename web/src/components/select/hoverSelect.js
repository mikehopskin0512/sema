import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Select, { components } from 'react-select';
import clsx from 'clsx';
import styles from './hoverSelect.module.scss';

const HoverSelect = ({
  options,
  value,
  openOnMouseOver,
  onChange,
  className,
  ...selectProps
}) => {
  const [props, setProps] = useState({ ...selectProps });
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);
  
  const onMouseHover = useCallback((e) => {
    if (openOnMouseOver && !isOpen) {
      setIsOpen(true);
    }
  }, [isOpen, openOnMouseOver]);
  
  const onMouseLeave = useCallback(() => {
    if (openOnMouseOver && isOpen) {
      setIsOpen(false);
    }
  }, [isOpen, openOnMouseOver]);
  
  useEffect(() => {
    if (openOnMouseOver) {
      setProps({
        menuIsOpen: isOpen,
        ...selectProps,
      });
    } else {
      setProps({ ...selectProps });
    }
  }, [isOpen]);
  
  useEffect(() => {
    const element = popupRef.current;
    if (openOnMouseOver) {
      if (element) {
        element.addEventListener('mouseover', onMouseHover);
        element.addEventListener('mouseleave', onMouseLeave);
      }
      
      return () => {
        element.removeEventListener('mouseover', onMouseHover);
        element.removeEventListener('mouseleave', onMouseLeave);
      };
    }
    
    return () => null;
  }, [onMouseHover, onMouseLeave, popupRef, isOpen, openOnMouseOver]);
  
  const onChangeValue = (v) => {
    onChange(v);
    setIsOpen(false);
  };
  
  const Control = (controlProps) => (
    <components.Control
      {...controlProps}
      className={clsx('has-background-white has-text-weight-semibold has-text-primary is-size-3 is-size-5-mobile p-0', styles['select-control'])}
    />
  );
  
  const IndicatorSeparator = () => null;
  
  return (
    <div
      ref={popupRef}
      className={styles['select-wrapper']}
    >
      <Select
        onChange={onChangeValue}
        className={`${className} ${styles['select-container']}`}
        value={value}
        options={options}
        components={{ Control, IndicatorSeparator }}
        isOptionDisabled={(option) => option.disabled}
        {...props}
      />
    </div>
  );
};

HoverSelect.propTypes = {
  className: PropTypes.string,
  options: PropTypes.array,
  openOnMouseOver: PropTypes.bool,
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

HoverSelect.defaultProps = {
  className: '',
  options: [],
  openOnMouseOver: false,
};

export default HoverSelect;
