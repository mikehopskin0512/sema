import React from 'react';
import PropTypes from 'prop-types';
import CreatableSelect from 'react-select/creatable';
import { components } from 'react-select';
import { ArrowDropdownIcon } from '../../Icons';

const Control = ({ children, selectProps, error, ...rest }) => {
  if (!selectProps.isSearchable) {
    return null;
  }
  return (
    <components.Control className={error ? 'has-background-red-50 has-border-red-500 shadow-none' : ''} {...rest}>
      {children}
    </components.Control>
  );
};

Control.defaultProps = {
  error: '',
};

Control.propTypes = {
  children: PropTypes.any.isRequired,
  selectProps: PropTypes.any.isRequired,
  error: PropTypes.string,
};

const EmailsInput = ({
  options,
  value,
  placeholder,
  onChange,
  error,
}) => {
  const DropdownIndicator = () => (
    <div className="is-flex is-align-items-center text-gray-700 mr-5">
      <ArrowDropdownIcon />
    </div>
  );

  const IndicatorSeparator = () => null;

  return (
    <CreatableSelect
      options={options}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      isMulti
      isSearchable
      components={{
        DropdownIndicator,
        IndicatorSeparator,
        Control: (props) => <Control error={error} {...props} />,
      }}
    />
  );
};

EmailsInput.defaultProps = {
  options: [],
  placeholder: '',
  value: [],
  onChange: () => {},
  error: '',
};

EmailsInput.propTypes = {
  options: PropTypes.array,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.string,
};

export default EmailsInput;
