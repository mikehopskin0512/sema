import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './statusFilter.module.scss';

const statusList = ['Active', 'Waitlisted', 'Blocked', 'Disabled'];

function StatusFilter({ onChange, value }) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    Waitlisted: false,
    Active: false,
    Blocked: false,
    Disabled: false,
  });

  useEffect(() => {
    setFilters(value);
  }, [value]);

  const onFilterChange = (name, checked) => {
    const newFilter = {
      ...filters,
      [name]: checked,
    };

    setFilters(newFilter);
    onChange(newFilter);
  };

  const handleButtonClick = (e) => {
    setIsOpen(!isOpen);
    e.stopPropagation();
  };

  const handleClickOutSideOfMenu = (e) => {
    const menuPopup = document.getElementById('status-filter-popup');

    if (!e.path.includes(menuPopup) && isOpen) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('click', handleClickOutSideOfMenu);
    } else {
      window.removeEventListener('click', handleClickOutSideOfMenu);
    }
  }, [isOpen]);

  return (
    <div className={styles.statusFilter}>
      <FontAwesomeIcon
        icon={!isOpen ? 'caret-down' : 'caret-up'}
        onClick={handleButtonClick}
        size="lg"
      />
      {
        isOpen && (
          <div className={styles.popup} id="status-filter-popup">
            {
              statusList.map((status) => (
                <label key={status} className={styles.listItem}>
                  <input
                    type="checkbox"
                    checked={filters[status]}
                    onChange={(e) => onFilterChange(status, e.target.checked)}
                  />
                  {status}
                </label>
              ))
            }
          </div>
        )
      }
    </div>
  );
}

StatusFilter.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.object.isRequired,
};

export default StatusFilter;
