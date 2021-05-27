import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
    <div className={`dropdown is-right ml-5 ${isOpen && 'is-active'}`}>
      <div className="dropdown-trigger">
        <FontAwesomeIcon
          className='is-clickable'
          icon={!isOpen ? 'caret-down' : 'caret-up'}
          onClick={handleButtonClick}
          size="lg"
        />
      </div>
      <div className='dropdown-menu' id="status-filter-popup" role="menu" style={{ minWidth: 'initial' }}>
        <div className={'dropdown-content px-15 py-10 is-background-white'}>
          {
            statusList.map((status) => (
              <label key={status} className='is-flex is-align-items-center my-5'>
                <input
                  className="mr-10"
                  type="checkbox"
                  checked={filters[status]}
                  onChange={(e) => onFilterChange(status, e.target.checked)}
                />
                {status}
              </label>
            ))
          }
        </div>
      </div>
    </div>
  );
}

StatusFilter.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.object.isRequired,
};

export default StatusFilter;
