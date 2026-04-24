import React from 'react';
import styles from './GlassPanel.module.css';
import { clsx } from 'clsx';

const GlassPanel = ({ children, className, blur = 'md', ...props }) => {
  return (
    <div 
      className={clsx(
        styles.panel, 
        styles[`blur-${blur}`],
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassPanel;
