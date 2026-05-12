import React, { useState, useEffect } from 'react';
import { 
  User, 
  LogOut, 
  Smartphone, 
  ShieldCheck, 
  Bell, 
  Database,
  ChevronRight,
  Edit2,
  Check,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/api';
import GlassPanel from '../../components/common/GlassPanel';
import Button from '../../components/common/Button';
import styles from './Profile.module.css';

const Profile = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  // Edit Mode States
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Settings States
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    localStorage.getItem('notifications') !== 'false'
  );

  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditEmail(user.email || '');
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      setError('');
      const data = await authService.updateProfile({ name: editName, email: editEmail });
      if (data && data.data) {
        login(data.data.user, data.data.token);
        setIsEditing(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
      try {
        await authService.deleteAccount();
        logout();
        navigate('/login');
      } catch (err) {
        alert('Failed to delete account. Please try again.');
      }
    }
  };

  const toggleNotifications = () => {
    const newVal = !notificationsEnabled;
    setNotificationsEnabled(newVal);
    localStorage.setItem('notifications', newVal.toString());
  };

  const settingsGroups = [
    {
      title: 'Preferences',
      items: [
        { icon: Smartphone, label: 'Appearance', detail: 'Current Theme', value: 'MIDNIGHT DEPTH' },
        { icon: ShieldCheck, label: 'Security', detail: 'Last Password Change', value: '3 months ago' },
        { 
          icon: Bell, 
          label: 'Notifications', 
          detail: 'Push Notifications', 
          value: notificationsEnabled ? 'Active' : 'Disabled', 
          isToggle: true,
          isActive: notificationsEnabled,
          onClick: toggleNotifications
        },
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
            </div>
            <div className={styles.userDetails}>
              {isEditing ? (
                <div className={styles.editForm}>
                  <input 
                    type="text" 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)}
                    className={styles.editInput}
                    placeholder="Full Name"
                  />
                  <input 
                    type="email" 
                    value={editEmail} 
                    onChange={(e) => setEditEmail(e.target.value)}
                    className={styles.editInput}
                    placeholder="Email Address"
                  />
                  {error && <p className={styles.errorText} style={{ color: '#ff6b6b', fontSize: '0.875rem', marginTop: '0.25rem' }}>{error}</p>}
                </div>
              ) : (
                <>
                  <h2 className={styles.userName}>{user?.name || 'User'}</h2>
                  <p className={styles.userEmail}>{user?.email || 'user@example.com'}</p>
                  <div className={styles.badges}>
                    <span className={styles.badge}>PREMIUM MEMBER</span>
                    <span className={styles.badge}>EDITOR SINCE 2023</span>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className={styles.userActions}>
            {isEditing ? (
              <>
                <Button variant="primary" className={styles.editBtn} onClick={handleSaveProfile} disabled={isSaving}>
                  {isSaving ? 'Saving...' : <><Check size={16} style={{marginRight: '0.5rem'}} /> Save</>}
                </Button>
                <Button variant="secondary" className={styles.editBtn} onClick={() => { setIsEditing(false); setError(''); }}>
                  <X size={16} style={{marginRight: '0.5rem'}} /> Cancel
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" className={styles.editBtn} onClick={() => setIsEditing(true)}>
                  <Edit2 size={16} style={{marginRight: '0.5rem'}} /> Edit Profile
                </Button>
                <button className={styles.logoutAction} onClick={handleLogout}>
                  <LogOut size={18} /> Logout
                </button>
              </>
            )}
          </div>
        </GlassPanel>
      </div>

      {settingsGroups.map(group => (
        <div key={group.title} className={styles.settingsGroup}>
          <h3 className={styles.groupTitle}>{group.title}</h3>
          <div className={styles.settingsGrid}>
            {group.items.map(item => (
              <GlassPanel key={item.label} className={styles.settingsCard} onClick={item.onClick} style={{ cursor: item.onClick ? 'pointer' : 'default' }}>
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
                    <div className={styles.toggle} style={{ background: item.isActive ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)' }}>
                      <div className={styles.toggleKnob} style={{ transform: item.isActive ? 'translateX(20px)' : 'translateX(0)', width: '18px', height: '18px', background: '#fff', borderRadius: '50%', transition: 'transform 0.2s' }} />
                    </div>
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
        <button className={styles.deleteAccountBtn} onClick={handleDeleteAccount}>DELETE ACCOUNT</button>
      </div>
    </div>
  );
};

export default Profile;
