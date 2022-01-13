import clsx from 'clsx';
import React from 'react';

const InputField = ({
  title,
  value,
  isRequired = false,
  onChange,
  disabled = false,
  type = 'text',
  error,
  iconLeft,
  iconRight,
  placeholder = '',
}) => {
  return (
    <div className="aui-is-full-width">
      {title && (
        <label className="aui-label aui-mb-4">
          {title}
          {isRequired && <span className="aui-has-text-red-500"> *</span>}
        </label>
      )}
      <div className={clsx(
        'aui-control',
        iconRight && 'aui-has-icons-right',
        iconLeft && 'aui-has-icons-left',
      )}>
        <input
          type={type}
          disabled={disabled}
          className={clsx(
            'aui-input',
            error && 'aui-has-text-red-500 aui-has-background-red-50 aui-is-red-500',
          )}
          value={value}
          onChange={({ target }) => onChange(target.value)}
          placeholder={placeholder}
        />
        {iconLeft && (
          <span className={clsx(
            'aui-icon aui-is-small aui-is-left aui-is-clickable',
            error && 'aui-has-text-red-500',
          )}>
            {iconLeft}
          </span>
        )}
        {iconRight && (
          <span className={clsx(
            'aui-icon aui-is-small aui-is-right aui-is-clickable',
            error && 'aui-has-text-red-500',
          )}>
            {iconRight}
          </span>
        )}
        {error && (
          <div className="aui-mt-4 aui-is-size-8 aui-has-text-red-500">{error}</div>
        )}
      </div>
    </div>
  );
};

export default InputField;
