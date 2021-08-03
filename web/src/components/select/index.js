import React, { useCallback, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import useDebounce from '../../hooks/useDebounce';
import usePopup from '../../hooks/usePopup';

const Select = ({
  options = [],
  value,
  onChange,
  placeholder,
  searchPlaceholder,
  searchValue,
  onChangeSearchValue,
}) => {
  const debouncedSearchTerm = useDebounce(searchValue, 300);
  const popupRef = useRef(null);
  const { isOpen, toggleMenu, closeMenu } = usePopup(popupRef);

  const getLabel = useCallback((v) => {
    if (!options) return '';
    const option = options.find((o) => o.value === v);
    return option ? option.label : '';
  }, [options]);

  const onChangeValue = (v) => {
    onChange(v);
    closeMenu();
  };

  const suggestOptions = useMemo(() => options.filter((option) => option.label
    .toLowerCase()
    .indexOf(debouncedSearchTerm.toLowerCase()) !== -1), [options, debouncedSearchTerm]);

  return (
    <div className={`dropdown ${isOpen && 'is-active'}`}>
      <div className="dropdown-trigger">
        <button
          type="button"
          className="has-no-border has-background-white is-clickable outline-none p-5 is-size-4 has-text-weight-bold"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          onClick={toggleMenu}
        >
          <span>{ value ? getLabel(value) : placeholder }</span>
          <span className="icon is-small is-size-5 ml-15">
            <FontAwesomeIcon icon={faCaretDown} />
          </span>
        </button>
      </div>
      <div className="dropdown-menu" ref={popupRef} role="menu">
        <div className="dropdown-content">
          <div className="dropdown-item">
            <input
              className="input has-background-white is-size-6 px-15 py-10"
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onChangeSearchValue(e.target.value)}
            />
          </div>
          <hr className="dropdown-divider" />
          {
            suggestOptions.map((option, index) => (
              <>
                <button
                  type="button"
                  key={option.value}
                  className={`button py-10 has-no-border dropdown-item is-size-6 is-clickable outline-none ${option.value === value && 'is-light'}`}
                  onClick={() => onChangeValue(option.value)}
                >
                  {option.label}
                </button>
                {
                  suggestOptions.length - 1 !== index && (
                    <hr className="dropdown-divider m-0" />
                  )
                }
              </>
            ))
          }
        </div>
      </div>
    </div>
  );
};

Select.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  searchPlaceholder: PropTypes.string.isRequired,
  searchValue: PropTypes.string.isRequired,
  onChangeSearchValue: PropTypes.func.isRequired,
};

export default Select;
