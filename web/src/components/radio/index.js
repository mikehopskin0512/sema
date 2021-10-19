import React from 'react';
import clsx from 'clsx';
import styles from './radio.module.scss';

const CustomRadio = ({ label, value, ...props }) => {
  return(
    <label className={clsx("radio mr-20 is-flex is-align-items-center", styles.container)}>
      <input type="radio" className="mr-5 is-hidden" value={value} {...props} />
      <div className={clsx("mr-5", styles.radio)} />
      {label}
    </label>
  )
}

export default CustomRadio;