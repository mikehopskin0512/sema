/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortDown } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import Select, { components } from 'react-select';
import styles from './select.module.scss';
import { gray700 } from '../../../../styles/_colors.module.scss';
import { DROPDOWN_SORTING_TYPES, SORTING_TYPES } from '../../../utils/constants';
import { getPriorityListFromUser, sortWithPriority } from '../../../utils/sorts';
import { ReplayArrowIcon } from '@/components/Icons';

const sortDropdown = (options, sortType, user) => {
  switch (sortType) {
    case DROPDOWN_SORTING_TYPES.CHRONOLOGICAL_SORT:
      return sortWithPriority(
        options,
        'updated_at',
        [],
        SORTING_TYPES.DEFAULT_COMPARE_SORT
      );
    case DROPDOWN_SORTING_TYPES.ALPHABETICAL_USER_PRIORIY_SORT:
      return sortWithPriority(
        options,
        'label',
        getPriorityListFromUser(user),
        SORTING_TYPES.ALPHABETICAL_SORT
      );
  case DROPDOWN_SORTING_TYPES.SELECTED_FIRST:
    return options;
  case DROPDOWN_SORTING_TYPES.NO_SORT:
      return options;
    default:
      return sortWithPriority(options, 'label', [], sortType);
  }
};

const Menu = ({ selectAll, deselectAll, isMulti, small, width, ...p }) => {
  const { children } = p;
  return (
    <components.Menu
      {...p}
      className={clsx('mt-neg5', styles.menu)}
      style={{ width }}
    >
      {children}
      <div className={styles['clear-all-section']}>
        <div onClick={deselectAll}>
          <ReplayArrowIcon />
          <span>Clear All</span>
        </div>
      </div>
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
        <components.Control {...rest}>{children}</components.Control>
      </div>
    </div>
  );
};

const ValueContainer = ({ children, ...p }) => (
  <components.ValueContainer
    {...p}
    style={{ ...p.style }}
    className={clsx('is-flex is-fullwidth', styles['value-container'], p.class)}
  >
    {children}
  </components.ValueContainer>
);

const IndicatorSeparator = () => null;

const DropdownIndicator = () => null;

const Placeholder = p => (
  <components.Placeholder
    {...p}
    className={clsx('has-text-weight-semibold', styles.placeholder)}
  />
);

const CustomSelect = props => {
  const {
    label,
    selectProps,
    sortType,
    filter,
    showCheckbox,
    outlined = false,
    small = false,
    width = '100%'
  } = props;

  const { value, onChange, options, isMulti } = selectProps;
  const { user } = useSelector(state => ({
    user: state.authState.user
  }));
  const optionsSorted = useMemo(() => sortDropdown(options, sortType, user), [
    options,
    sortType,
    user
  ]);
  const selectPropsPrepared = { ...selectProps, options: optionsSorted };

  const node = useRef();
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const handleClick = e => {
    if (node.current.contains(e.target)) {
      return;
    }
    setMenuIsOpen(false);
  };

  const handleKeypress = e => {
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
      document.removeEventListener('keypress', handleKeypress);
    };
  }, []);

  const selectAll = useCallback(() => {
    onChange(optionsSorted);
  }, [onChange, optionsSorted]);

  const deselectAll = useCallback(() => {
    onChange([]);
  }, [onChange]);

  const toggleMenu = () => setMenuIsOpen(!menuIsOpen);

  const Option = p => {
    const {
      isSelected,
      data: { label: optionLabel, img, value, emoji }
    } = p;
    return (
      <components.Option
        {...p}
        className={isSelected ? styles['selected-option'] : ''}
      >
        {showCheckbox ? (
          <label className="checkbox is-flex is-align-items-center py-5">
            <input type="checkbox" className="mr-8" checked={isSelected} />
            {img && (
              <img className={clsx('mr-8', styles.img)} src={img} alt={value} />
            )}
            <span className="is-size-7 mr-5">{emoji ? `${emoji} ` : ''}</span>
            <span
              className={`is-size-7 has-text-weight-semibold has-text-black-950 ${styles['item-label']}`}
            >
              {optionLabel}
            </span>
          </label>
        ) : (
          <div className="is-flex is-align-items-center">
            {img && (
              <img className={clsx('mr-8', styles.img)} src={img} alt={value} />
            )}
            <span className="is-size-7 has-text-weight-semibold has-text-black-950">
              {optionLabel}
            </span>
          </div>
        )}
      </components.Option>
    );
  };

  // const Input = (p) => (
  //   <components.Input className="p-0 is-size-8 has-text-weight-semibold has-text-black-950 is-fullwidth" {...p} />
  // );

  const MultiValueRemove = () => null;

  const IndicatorsContainer = () => null;

  const removeSelectedValue = (e, id) => {
    e.stopPropagation();
    onChange(value.filter(({ value: itemId }) => itemId !== id));
  };

  const MultiValue = p => (
    <div className="tag px-5 py-2 is-size-8 has-text-weight-semibold has-text-black-950 has-background-gray-100">
      {p.data.label}
      <button
        type="button"
        className="delete is-small"
        onClick={e => removeSelectedValue(e, p.data.value)}
        aria-label="remove-multi-value"
      />
    </div>
  );

  const RenderMenu = useCallback(
    p =>
      Menu({
        ...p,
        selectAll,
        deselectAll,
        isMulti,
        small,
        width
      }),
    [deselectAll, isMulti, selectAll, small, width]
  );

  return (
    <div
      className={clsx("is-flex is-flex-direction-column is-align-items-stretch is-relative", styles['wrapper'])}
      ref={node}
    >
      <button
        type="button"
        onClick={toggleMenu}
        style={{ width }}
        className={clsx(
          'border-radius-4px is-flex is-justify-content-space-between is-align-items-center is-clickable',
          styles.select,
          outlined
            ? styles['select-outlined']
            : 'has-background-white border-none',
          outlined ? 'has-background-white' : null,
          small ? 'py-5 px-10' : 'py-10 px-15'
        )}
      >
        <div className="is-flex is-align-items-center">
          <span
            className={clsx(
              'has-text-weight-semibold mr-10',
              styles.placeholder,
              small ? 'is-size-7' : 'is-size-'
            )}
          >
            {label}
          </span>
          {value && value.length > 0 ? (
            <span
              className={clsx(
                'is-size-8 has-text-weight-semibold has-background-primary has-text-white is-flex is-align-items-center is-justify-content-center px-5 is-radius-full',
                styles.badge
              )}
            >
              {value.length}
            </span>
          ) : (
            <div className={styles.badge} />
          )}
        </div>
        <span className="icon is-small pb-5">
          <FontAwesomeIcon icon={faSortDown} color={gray700} />
        </span>
      </button>

      {menuIsOpen && (
        <div
          className={clsx(
            'has-background-white is-absolute mt-50 is-full-width',
            styles['select-container']
          )}
        >
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
              ValueContainer
              // Input,
            }}
            menuIsOpen={menuIsOpen}
            width={width}
            {...selectPropsPrepared}
            onChange={data => {
              selectPropsPrepared.onChange(data);
              if (selectPropsPrepared.closeMenuOnSelect) {
                setMenuIsOpen(false);
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

CustomSelect.defaultProps = {
  sortType: DROPDOWN_SORTING_TYPES.ALPHABETICAL_SORT,
  filter: true,
  showCheckbox: false,
  small: false,
  width: '100%'
};

CustomSelect.propTypes = {
  sortType: PropTypes.string,
  label: PropTypes.string.isRequired,
  selectProps: PropTypes.object.isRequired,
  filter: PropTypes.bool,
  showCheckbox: PropTypes.bool,
  small: PropTypes.bool,
  width: PropTypes.number
};

export default React.memo(CustomSelect);
