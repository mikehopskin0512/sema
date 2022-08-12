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
  textSizeClassName ='',
  rows = 3,
  className = '',
  onKeyPress,
  ...otherProps
}) => {
  return (
    <div className={clsx("aui-is-full-width", className)}>
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
        {isMultiLine ? (
          <textarea
            rows={rows}
            disabled={disabled}
            className={clsx(
              'aui-textarea',
              textSizeClassName,
              error && 'aui-has-text-red-500 aui-has-background-red-50 aui-is-red-500',
            )}
            value={value}
            onChange={({ target }) => onChange(target.value)}
            onKeyPress={(event) => onKeyPress(event)}
            placeholder={placeholder}
            {...otherProps}
          />
        ) : (
        <input
          type={type}
          disabled={disabled}
          className={clsx(
            'aui-input',
            textSizeClassName,
            error && 'aui-has-text-red-500 aui-has-background-red-50 aui-is-red-500',
          )}
          value={value}
          onChange={({ target }) => onChange(target.value)}
          onKeyPress={(event) => onKeyPress(event)}
          placeholder={placeholder}
          {...otherProps}
        />)}
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
