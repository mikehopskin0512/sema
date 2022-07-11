import React, { useState } from 'react';
import styles from './styles.module.scss';
import { CloseIcon } from '../../../components/Icons';
import { black900 } from '../../../../styles/_colors.module.scss';

const TagInput = ({
  tagData,
  setTagData,
  label,
  placeholder,
  errorText,
  validation,
}) => {
  const [isError, setIsError] = useState('');

  const removeTagData = indexToRemove => {
    setTagData([...tagData.filter((_, index) => index !== indexToRemove)]);
    setIsError('');
  };
  const addTagData = event => {
    const value = event.target.value;
    if (!!value.length) {
      if (validation && !validation.test(value)) {
        setIsError(errorText);
        return;
      }
      setTagData([...tagData, event.target.value]);
      event.target.value = '';
      setIsError('')
    }
  };

  return (
    <>
      <label htmlFor='tags-input' className={styles['tag-input-label']}>{label}</label>
      <div className={styles['tag-input']}>
        <ul className={styles['tags']}>
          {tagData.map((tag, index) => (
            <li key={index} className={styles['tag']}>
              <span className={styles['tag-title']}>{tag}</span>
              <span
                className={styles['tag-close-icon']}
                onClick={() => removeTagData(index)}
              >
              <CloseIcon size='small' color={black900} />
            </span>
            </li>
          ))}
        </ul>
        <input
          id='tags-input'
          type='text'
          onKeyUp={event => (event.key === 'Enter' ? addTagData(event) : null)}
          placeholder={placeholder}
        />
      </div>
      {Boolean(isError) && <span className={styles['error-text']}>{errorText}</span>}
    </>
  );
};

export default TagInput;
