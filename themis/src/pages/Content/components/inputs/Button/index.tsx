import React, { CSSProperties, ReactChildren } from 'react';
import styles from './Button.module.scss';

interface IButton {
  onClick?: () => void;
  secondary?: boolean;
  type?: 'submit' | 'button' | 'reset';
  style?: CSSProperties;
  children: ReactChildren;
}

const Button = ({
  onClick,
  secondary = false,
  style = undefined,
  children,
  type = 'button',
}: IButton) => (
  <button
    type={type}
    style={style}
    className={`${styles.button} ${secondary && styles['button--secondary']}`}
    onClick={onClick}
  >
    {children}
  </button>
);

export default Button;
