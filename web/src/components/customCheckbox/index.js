import React from 'react';
import styles from './customCheckbox.module.scss';

const CustomCheckbox = ({ label, ...inputProps }) => {
  return(
    <label className={styles.container}>
      <p>{label}</p>
      <input type="checkbox" {...inputProps} />
      <span className={styles.checkmark}></span>
    </label>
  )
}

export default CustomCheckbox;