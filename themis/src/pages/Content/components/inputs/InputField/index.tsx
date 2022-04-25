import React from 'react';
import styles from './InputField.module.scss';
// @ts-ignore
import { getActiveThemeClass } from '../../../../../../utils/theme';

interface IInputField {
  title: string,
  isRequired?: boolean,
  value: string,
  onInput: (v: string) => typeof v;
  placeholder?: string
  isTextarea?: boolean
  error: string,
}

const InputField = (
  {
    title,
    value,
    isRequired = false,
    onInput,
    isTextarea = false,
    error,
    placeholder = '',
  }: IInputField,
) => (
  <div>
    <p className={`${styles[getActiveThemeClass()]} ${styles.title}`}>
      <b>
        {title}
        {isRequired && <span> *</span>}
      </b>
    </p>
    {isTextarea ? (
      <textarea
        className={`${styles[getActiveThemeClass()]} ${styles.input}`}
        value={value}
        onInput={({ target }: React.ChangeEvent<HTMLTextAreaElement>) => onInput(target.value)}
        placeholder={placeholder}
      />
    ) : (
      <input
        className={`${styles[getActiveThemeClass()]} ${styles.input}`}
        value={value}
        onInput={({ target }: React.ChangeEvent<HTMLInputElement>) => onInput(target.value)}
        placeholder={placeholder}
      />
    )}
    {error && <div className={styles.error}>{error}</div>}
  </div>
);

export default InputField;
