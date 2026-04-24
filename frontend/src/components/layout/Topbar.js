import React from 'react';
import { Search, Bell, User, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Topbar.module.css';

const Topbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className={styles.topbar}>
      <div className={styles.searchWrapper}>
        <Search size={18} className={styles.searchIcon} />
        <input 
          type="text" 
          placeholder="Search your mind..." 
          className={styles.searchInput} 
        />
      </div>

      <div className={styles.actions}>
        <button 
          className={styles.createBtn}
          onClick={() => navigate('/editor')}
        >
          <Plus size={18} />
          <span>New Note</span>
        </button>

        <button className={styles.iconBtn}>
          <Bell size={20} />
        </button>

        <div className={styles.profile} onClick={() => navigate('/profile')}>
          <div className={styles.avatar}>
            {user?.name?.charAt(0) || <User size={18} />}
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.name || 'User'}</span>
            <span className={styles.userRole}>Premium Member</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
