import React from 'react';
import styles from './Input.module.css';
import { clsx } from 'clsx';

const Input = ({ label, icon: Icon, error, className, ...props }) => {
  return (
    <div className={clsx(styles.container, className)}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={clsx(styles.wrapper, error && styles.wrapperError)}>
        {Icon && <Icon size={20} className={styles.icon} />}
        <input className={styles.input} {...props} />
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};

export default Input;
