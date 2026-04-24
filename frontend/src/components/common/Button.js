import React from 'react';
import styles from './Button.module.css';
import { clsx } from 'clsx';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  isLoading,
  ...props 
}) => {
  return (
    <button 
      className={clsx(
        styles.button, 
        styles[variant], 
        styles[size], 
        isLoading && styles.loading,
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? <div className={styles.spinner} /> : children}
    </button>
  );
};

export default Button;
