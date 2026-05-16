import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  StickyNote, 
  Star, 
  Archive, 
  Tag, 
  Book,
  Settings, 
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: StickyNote, label: 'All Notes', path: '/' },
    { icon: Star, label: 'Favorites', path: '/favorites' },
    { icon: Book, label: 'Notebooks', path: '/notebooks' },
    { icon: Archive, label: 'Archive', path: '/archive' },
    { icon: Tag, label: 'Tags', path: '/tags' },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoArea}>
        <div className={styles.logoIcon}>J</div>
        <h2 className={styles.logoText}>Journally</h2>
      </div>

      <nav className={styles.nav}>
        <div className={styles.sectionLabel}>LIBRARY</div>
        {menuItems.map((item) => (
          <NavLink 
            key={item.label} 
            to={item.path} 
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        <NavLink to="/settings" className={styles.footerItem}>
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
