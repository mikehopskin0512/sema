import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';

const RoleSelect = ({ value, onChange, options }) => {
  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
    />
  );
};

RoleSelect.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default RoleSelect;
