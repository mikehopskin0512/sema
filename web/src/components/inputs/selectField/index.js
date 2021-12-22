import clsx from 'clsx';
import React from 'react';
import Select from 'react-select';
import { red50, red500 } from '../../../../styles/_colors.module.scss';

const SelectField = ({
  title,
  value,
  options,
  isRequired = false,
  onChange,
  disabled = false,
  error,
  isMulti,
  placeholder = '',
}) => {
  const styles = {
    control: (styles) => (error ? {
      ...styles,
      backgroundColor: red50,
      borderColor: red500,
    } : styles),
    input: (styles) => (error ? {
      ...styles,
      color: red500,
    } : styles),
  };
  return (
    <div className="is-full-width">
      {title && (
        <label className="label mb-4">
          {title}
          {isRequired && <span className="has-text-red-500"> *</span>}
        </label>
      )}
      <div className={clsx('control')}>
        <Select
          isMulti={isMulti}
          disabled={disabled}
          options={options}
          placeholder={placeholder}
          value={value}
          styles={styles}
          onChange={onChange}
        />
        {error && (
          <div className="mt-4 is-size-8 has-text-red-500">{error}</div>
        )}
      </div>
    </div>
  );
};

export default SelectField;
