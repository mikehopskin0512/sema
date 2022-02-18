/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortDown } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import Select, { components } from 'react-select';
import styles from './select.module.scss';
import { gray700 } from '../../../../styles/_colors.module.scss';

const Menu = ({ selectAll, deselectAll, isMulti, small, width, ...p }) => {
  const { children } = p;
  return (
    <components.Menu {...p} className={clsx('mt-neg5', styles.menu)} style={{ width }}>
      { isMulti && (
        <div className={clsx("mx-12 mt-10 is-flex is-flex-wrap-wrap is-size-7")} >
          <div className="is-clickable has-text-link" onClick={selectAll}>Select all</div>
          <div className="mx-5">|</div>
          <div className="is-clickable has-text-link" onClick={deselectAll}>Deselect all</div>
        </div>
      ) }
      {children}
    </components.Menu>
  );
};

const Control = ({ children, selectProps, ...rest }) => {
  if (!selectProps.isSearchable) {
    return null;
  }
  return (
    <div className={clsx('', styles.control)}>
      <div className="py-20 px-12 has-background-white border-radius-4px">
        <components.Control {...rest}>
          {children}
        </components.Control>
      </div>
    </div>
  )
};

const CustomSelect = (props) => {
  const {
    label, selectProps, filter, showCheckbox, outlined = false, small = false, width = '100%'
  } = props;

  const { value, onChange, options, isMulti } = selectProps;

  const node = useRef();
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const handleClick = (e) => {
    if (node.current.contains(e.target)) {
      return;
    }
    setMenuIsOpen(false);
  };

  const handleKeypress = (e) => {
    if (e.charCode === 13) {
      setMenuIsOpen(false);
    }
  };

  useEffect(() => {
    // add when mounted
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keypress', handleKeypress);
    // return function to be called when unmounted
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.addEventListener('keypress', handleKeypress);
    };
  }, []);

  const selectAll = () => {
    onChange(options);
  }

  const deselectAll = () => {
    onChange([]);
  }

  const toggleMenu = () => setMenuIsOpen(!menuIsOpen);

  const IndicatorSeparator = () => null;

  const DropdownIndicator = () => null;

  const Placeholder = (p) => <components.Placeholder {...p} className={clsx('has-text-weight-semibold', styles.placeholder)} />;

  const Option = (p) => {
    const { isSelected, data: { label: optionLabel, img, value, emoji } } = p;
    return (
      <components.Option {...p} className={isSelected ? 'has-background-white' : ''}>
        { showCheckbox ? (
          <label className="checkbox is-flex is-align-items-center py-5">
            <input type="checkbox" className="mr-8" checked={isSelected} />
            {img && <img className={clsx('mr-8', styles.img)} src={img} alt={value} /> }
            <span className="is-size-7 mr-5">{emoji ? `${emoji} ` : ''}</span>
            <span className="is-size-7 has-text-weight-semibold has-text-black-950"><div dangerouslySetInnerHTML={{ __html: optionLabel }} /></span>
          </label>
        ) : (
          <div className="is-flex is-align-items-center">
            {img && <img className={clsx('mr-8', styles.img)} src={img} alt={value} /> }
            <span className="is-size-7 has-text-weight-semibold has-text-black-950">{optionLabel}</span>
          </div>
        ) }

      </components.Option>
    );
  };

  // const Input = (p) => (
  //   <components.Input className="p-0 is-size-8 has-text-weight-semibold has-text-black-950 is-fullwidth" {...p} />
  // );

  const MultiValue = (p) => (
    <components.MultiValue
      {...p}
      className="px-5 py-2 is-size-8 has-text-weight-semibold has-text-black-950 has-background-gray-100"
    />
  );

  const MultiValueRemove = () => null;

  const IndicatorsContainer = () => null;

  const ValueContainer = (p) => (
    <components.ValueContainer
      {...p}
      style={{ ...p.style }}
      className={clsx('is-flex is-fullwidth', styles['value-container'], p.class)}
    />
  );

  const RenderMenu = useCallback((p) => Menu({
    ...p,
    selectAll,
    deselectAll,
    isMulti,
    small,
    width,
  }), [menuIsOpen]);

  return (
    <div className="is-flex is-flex-direction-column is-align-items-stretch is-relative" ref={node}>
      <button
        type="button"
        onClick={toggleMenu}
        style={{ width }}
        className={clsx(
          'border-radius-4px is-flex is-justify-content-space-between is-align-items-center is-clickable',
          styles.select,
          outlined ? styles['select-outlined'] : 'has-background-white border-none',
          outlined ? 'has-background-white' : null,
          small ? 'py-5 px-10' : 'py-10 px-15'
        )}>
        <div className="is-flex is-align-items-center">
          <span className={clsx('has-text-weight-semibold mr-10', styles.placeholder, small ? 'is-size-7' : 'is-size-')}>{label}</span>
          {value && value.length > 0 ? (
            <span className={
              clsx(
                'is-size-8 has-text-weight-semibold has-background-primary has-text-white is-flex is-align-items-center is-justify-content-center px-5 is-radius-full',
                styles.badge,
              )
            }>
              {value.length}
            </span>
          ) : (<div className={styles.badge} />)}
        </div>
        <span className="icon is-small pb-5">
          <FontAwesomeIcon icon={faSortDown} color={gray700} />
        </span>
      </button>

      {menuIsOpen && (
        <div className={clsx('has-background-white is-absolute mt-50 is-full-width', styles['select-container'])}>
          <Select
            components={{
              Control,
              IndicatorSeparator,
              Placeholder,
              DropdownIndicator,
              Option,
              MultiValue,
              MultiValueRemove,
              IndicatorsContainer,
              Menu: RenderMenu,
              ValueContainer,
              // Input,
            }}
            menuIsOpen={menuIsOpen}
            blurInputOnSelect
            width={width}
            {...selectProps}
            onChange={(data) => {
              selectProps.onChange(data)
              if (selectProps.closeMenuOnSelect) {
                setMenuIsOpen(false);
              }
            }}
          />
        </div>
      ) }

    </div>

  );
};

CustomSelect.defaultProps = {
  filter: true,
  showCheckbox: false,
  small: false,
  width: '100%'
};

CustomSelect.propTypes = {
  label: PropTypes.string.isRequired,
  selectProps: PropTypes.object.isRequired,
  filter: PropTypes.bool,
  showCheckbox: PropTypes.bool,
  small: PropTypes.bool,
  width: PropTypes.number
};

export default React.memo(CustomSelect);
