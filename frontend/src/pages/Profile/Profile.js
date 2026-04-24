import React from 'react';
import { 
  User, 
  LogOut, 
  Smartphone, 
  ShieldCheck, 
  Bell, 
  Database,
  ChevronRight,
  Edit2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GlassPanel from '../../components/common/GlassPanel';
import Button from '../../components/common/Button';
import styles from './Profile.module.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const settingsGroups = [
    {
      title: 'Preferences',
      items: [
        { icon: Smartphone, label: 'Appearance', detail: 'Current Theme', value: 'MIDNIGHT DEPTH' },
        { icon: ShieldCheck, label: 'Security', detail: 'Last Password Change', value: '3 months ago' },
        { icon: Bell, label: 'Notifications', detail: 'Push Notifications', value: 'Active', isToggle: true },
        { icon: Database, label: 'Storage', detail: 'Usage', value: '0.8 GB of 10 GB', isProgress: true, progress: 8 },
      ]
    }
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Account & Profile</h1>

      <div className={styles.profileSection}>
        <GlassPanel className={styles.userCard}>
          <div className={styles.userInfo}>
            <div className={styles.avatarWrapper}>
              <div className={styles.avatar}>
                {user?.name?.charAt(0) || <User size={40} />}
              </div>
              <button className={styles.editAvatar}><Edit2 size={14} /></button>
            </div>
            <div className={styles.userDetails}>
              <h2 className={styles.userName}>{user?.name || 'Julian Sterling'}</h2>
              <p className={styles.userEmail}>{user?.email || 'j.sterling@midnight.io'}</p>
              <div className={styles.badges}>
                <span className={styles.badge}>PREMIUM MEMBER</span>
                <span className={styles.badge}>EDITOR SINCE 2023</span>
              </div>
            </div>
          </div>
          <div className={styles.userActions}>
            <Button variant="secondary" className={styles.editBtn}>Edit Profile</Button>
            <button className={styles.logoutAction} onClick={handleLogout}>
              <LogOut size={18} /> Logout
            </button>
          </div>
        </GlassPanel>
      </div>

      {settingsGroups.map(group => (
        <div key={group.title} className={styles.settingsGroup}>
          <h3 className={styles.groupTitle}>{group.title}</h3>
          <div className={styles.settingsGrid}>
            {group.items.map(item => (
              <GlassPanel key={item.label} className={styles.settingsCard}>
                <div className={styles.settingsHeader}>
                  <div className={styles.settingsIcon}>
                    <item.icon size={20} />
                  </div>
                  <div className={styles.settingsLabelWrapper}>
                    <span className={styles.settingsLabel}>{item.label}</span>
                    <span className={styles.settingsDetail}>{item.detail}</span>
                  </div>
                </div>
                <div className={styles.settingsValue}>
                  {item.isToggle ? (
                    <div className={styles.toggle} />
                  ) : item.isProgress ? (
                    <div className={styles.progressArea}>
                      <span className={styles.valueText}>{item.value}</span>
                      <div className={styles.progressBar}><div style={{ width: `${item.progress}%` }} /></div>
                    </div>
                  ) : (
                    <span className={styles.valueText}>{item.value}</span>
                  )}
                  {!item.isToggle && !item.isProgress && <ChevronRight size={16} color="var(--text-muted)" />}
                </div>
              </GlassPanel>
            ))}
          </div>
        </div>
      ))}

      <div className={styles.dangerZone}>
        <h3 className={styles.dangerTitle}>Archive or Delete Account</h3>
        <p className={styles.dangerText}>Once you delete your account, there is no going back. Please be certain before taking this action.</p>
        <button className={styles.deleteAccountBtn}>DELETE ACCOUNT</button>
      </div>
    </div>
  );
};

export default Profile;
