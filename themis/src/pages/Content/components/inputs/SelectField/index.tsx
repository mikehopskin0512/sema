import React from 'react';
import styles from './SelectField.module.scss';
// @ts-ignore
import { getActiveThemeClass } from '../../../../../../utils/theme';

interface ISelectField {
  title?: string;
  isRequired?: boolean;
  value: string;
  options: Array<{ label: string; value: number }>;
  onInput: (v: number | string) => void;
  placeholder?: string;
  disabled?: boolean;
  isSpecialTheme?: boolean;
}

const SelectField = ({
  title = '',
  value,
  isRequired = false,
  onInput,
  disabled = false,
  options,
  placeholder = '',
  isSpecialTheme = false,
}: ISelectField) => (
  <div className={styles.wrapper}>
    {title && (
    <p className={`${styles[getActiveThemeClass()]} ${styles.title}`}>
      <b>
        {title}
        {isRequired && <span> *</span>}
      </b>
    </p>
    )}
    <select
      disabled={disabled}
      placeholder={placeholder}
      className={`${styles[getActiveThemeClass()]} ${styles.select} ${isSpecialTheme ? styles.specialSelectText : ''}`}
      value={value}
      onChange={({ target }: React.ChangeEvent<HTMLSelectElement>) => onInput(target.value)}
    >
      {!value && <option className={`${isSpecialTheme ? styles.specialSelectText : ''}`}>{placeholder || 'Select value'}</option>}
      {options.map((option) => (
        <option
          className={`${isSpecialTheme ? styles.specialSelectText : ''}`}
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
