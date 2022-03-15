import React, { ReactChildren } from 'react';
import styles from './modal.module.scss';

interface IModal {
  isActive?: boolean;
  children: ReactChildren,
}

const Modal = ({ isActive = false, children }: IModal) => {
  if (!isActive) {
    return null;
  }
  return (
    <div className={styles.modal}>
      {children}
    </div>
  );
};

export default Modal;
