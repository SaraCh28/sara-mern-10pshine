import React from 'react';
import { Tag } from 'lucide-react';
import styles from '../Dashboard/Dashboard.module.css'; // Reusing Dashboard styles

const Tags = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <p className={styles.greeting}>TAGS</p>
          <h1 className={styles.title}>All Tags</h1>
        </div>
      </header>

      <div className={styles.empty}>
        <Tag size={48} color="#ccc" style={{ marginBottom: '1rem' }} />
        <h3>Tags coming soon</h3>
        <p>Easily filter notes by labels in a future update.</p>
      </div>
    </div>
  );
};

export default Tags;
