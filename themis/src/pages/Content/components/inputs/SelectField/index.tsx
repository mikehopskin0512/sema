import React from 'react';
import styles from './SelectField.module.scss';

interface ISelectField {
  title?: string;
  isRequired?: boolean;
  value: string;
  options: Array<{ label: string; value: number }>;
  onInput: (v: number | string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const SelectField = ({
  title = '',
  value,
  isRequired = false,
  onInput,
  disabled = false,
  options,
  placeholder = '',
}: ISelectField) => (
  <div className={styles.wrapper}>
    {title && (
    <p className={styles.title}>
      <b>
        {title}
        {isRequired && <span> *</span>}
      </b>
    </p>
    )}
    <select
      disabled={disabled}
      placeholder={placeholder}
      className={styles.select}
      value={value}
      onChange={({ target }: React.ChangeEvent<HTMLSelectElement>) => onInput(target.value)}
    >
      {!value && <option>{placeholder || 'Select value'}</option>}
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
        >
          {option.label}
        </option>
      ))}
    </select>
    <div className={styles['select-arrow']} />
  </div>
);

export default SelectField;
