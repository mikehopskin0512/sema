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
  isMultiLine = false,
}) => {
  return (
    <div className="is-full-width">
      {title && (
        <label className="label mb-4">
          {title}
          {isRequired && <span className="has-text-red-500"> *</span>}
        </label>
      )}
      <div className={clsx(
        'control',
        iconRight && 'has-icons-right',
        iconLeft && 'has-icons-left',
      )}>
        {isMultiLine ? (
          <textarea
            disabled={disabled}
            className={clsx(
              'textarea',
              error && 'has-text-red-500 has-background-red-50 is-red-500',
            )}
            value={value}
            onChange={({ target }) => onChange(target.value)}
            placeholder={placeholder}
          />
        ) : (
          <input
            type={type}
            disabled={disabled}
            className={clsx(
              'input',
              error && 'has-text-red-500 has-background-red-50 is-red-500',
            )}
            value={value}
            onChange={({ target }) => onChange(target.value)}
            placeholder={placeholder}
          />
        )}
        {iconLeft && (
          <span className={clsx(
            'icon is-small is-left is-clickable',
            error && 'has-text-red-500',
          )}>
            {iconLeft}
          </span>
        )}
        {iconRight && (
          <span className={clsx(
            'icon is-small is-right is-clickable',
            error && 'has-text-red-500',
          )}>
            {iconRight}
          </span>
        )}
        {error && (
          <div className="mt-4 is-size-8 has-text-red-500">{error}</div>
        )}
      </div>
    </div>
  );
};

export default InputField;
