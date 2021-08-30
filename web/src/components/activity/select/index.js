/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortDown } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import Select, { components } from 'react-select';
import styles from './select.module.scss';

const CustomSelect = (props) => {
  const {
    label, selectProps, filter, showCheckbox,
  } = props;

  const { value } = selectProps;

  const node = useRef();
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const handleClick = (e) => {
    if (node.current.contains(e.target)) {
      return;
    }
    setMenuIsOpen(false);
  };

  useEffect(() => {
    // add when mounted
    document.addEventListener('mousedown', handleClick);
    // return function to be called when unmounted
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  const toggleMenu = () => setMenuIsOpen(!menuIsOpen);

  const Control = (p) => (filter ? (
    <div className={clsx('', styles.control)}>
      <div className="p-20 has-background-white border-radius-4px">
        <components.Control {...p} />
      </div>
    </div>
  ) : null);

  const IndicatorSeparator = () => null;

  const DropdownIndicator = () => null;

  const Placeholder = (p) => <components.Placeholder {...p} className={clsx('has-text-weight-semibold', styles.placeholder)} />;

  const Menu = (p) => {
    const { children } = p;
    return (
      <components.Menu {...p} className={clsx('mt-neg5', styles.menu)}>
        {children}
      </components.Menu>
    );
  };

  const Option = (p) => {
    const { isSelected, data: { label: optionLabel, img, value, emoji } } = p;
    return (
      <components.Option {...p} className={isSelected ? 'has-background-white' : ''}>
        { showCheckbox ? (
          <label className="checkbox is-flex is-align-items-center py-5">
            <input type="checkbox" className="mr-8" checked={isSelected} />
            <span className="is-size-7 mr-5">{emoji ? `${emoji} ` : ''}</span>
            <span className="is-size-7 has-text-deep-black"><div dangerouslySetInnerHTML={{ __html: optionLabel }} /></span>
          </label>
        ) : (
          <div className="is-flex is-align-items-center">
            {img && <img className={clsx('mr-8', styles.img)} src={img} alt={value} /> }
            <span className="is-size-7 has-text-weight-semibold has-text-deep-black">{optionLabel}</span>
          </div>
        ) }

      </components.Option>
    );
  };

  const Input = (p) => <components.Input className="p-0 is-size-8 has-text-weight-semibold has-text-dee-black" {...p} />;

  const MultiValue = (p) => (
    <components.MultiValue
      {...p}
      className="px-5 py-2 is-size-8 has-text-weight-semibold has-text-deep-black has-background-gray-2"
    />
  );

  const MultiValueRemove = () => null;

  return (
    <div className="is-flex is-flex-direction-column is-align-items-stretch" ref={node}>
      <button
        type="button"
        onClick={toggleMenu}
        className={clsx(
          'has-background-gray-2 border-radius-4px border-none is-flex is-justify-content-space-between is-align-items-center py-10 px-15',
          styles.select,
        )}>
        <div className="is-flex is-align-items-center">
          <span className={clsx('has-text-weight-semibold is-size-6 mr-10', styles.placeholder)}>{label}</span>
          {value && value.length > 0 && (
            <span className={
              clsx(
                'is-size-8 has-text-weight-semibold has-background-primary has-text-white is-flex is-align-items-center is-justify-content-center',
                styles.badge,
              )
            }>
              {value.length}
            </span>
          )}
        </div>
        <span className="icon is-small pb-5">
          <FontAwesomeIcon icon={faSortDown} color="#394A64" />
        </span>
      </button>
      {menuIsOpen && (
        <div className={clsx('has-background-white is-absolute mt-50', styles['select-container'])}>
          <Select
            components={{
              Control,
              IndicatorSeparator,
              Placeholder,
              DropdownIndicator,
              Menu,
              Option,
              MultiValue,
              Input,
              MultiValueRemove,
            }}
            menuIsOpen={menuIsOpen}
            {...selectProps}
          />
        </div>
      ) }

    </div>

  );
};

CustomSelect.defaultProps = {
  filter: true,
  showCheckbox: false,
};

CustomSelect.propTypes = {
  label: PropTypes.string.isRequired,
  selectProps: PropTypes.object.isRequired,
  filter: PropTypes.bool,
  showCheckbox: PropTypes.bool,
};

export default CustomSelect;
