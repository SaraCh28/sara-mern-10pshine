import React, { useState } from 'react';
import { 
  Smartphone, 
  ShieldCheck, 
  Bell, 
  Database,
  ChevronRight
} from 'lucide-react';
import GlassPanel from '../../components/common/GlassPanel';
import styles from '../Profile/Profile.module.css';

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    localStorage.getItem('notifications') !== 'false'
  );

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
      <h1 className={styles.title}>Settings</h1>

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
    </div>
  );
};

export default Settings;
