import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Sidebar from './Sidebar';
import styles from './Layout.module.css';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  return (
    <div className={styles.wrapper}>
      <Sidebar />
      <div className={styles.main}>
        <div className={styles.content}>
          {children}
        </div>
        <button 
          className={styles.fab}
          onClick={() => navigate('/editor')}
        >
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
};

export default Layout;
