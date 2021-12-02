import React from 'react';
import styles from './InputField.module.scss';

interface IInputField {
  title: string,
  isRequired?: boolean,
  value: string,
  onInput: (v: string) => typeof v;
  placeholder?: string
  isTextarea?: boolean
}

const InputField = (
  {
    title,
    value,
    isRequired = false,
    onInput,
    isTextarea = false,
    placeholder = '',
  }: IInputField,
) => (
  <div>
    <p className={styles.title}>
      <b>
        {title}
        {isRequired && <span> *</span>}
      </b>
    </p>
    {isTextarea ? (
      <textarea
        className={styles.input}
        value={value}
        onInput={({ target }: React.ChangeEvent<HTMLTextAreaElement>) => onInput(target.value)}
        placeholder={placeholder}
      />
    ) : (
      <input
        className={styles.input}
        value={value}
        onInput={({ target }: React.ChangeEvent<HTMLInputElement>) => onInput(target.value)}
        placeholder={placeholder}
      />
    )}
  </div>
);

export default InputField;
