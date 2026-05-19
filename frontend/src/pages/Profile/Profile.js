import React, { useState, useEffect } from 'react';
import { 
  User, 
  LogOut, 
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
  const [editGender, setEditGender] = useState('');
  const [editAge, setEditAge] = useState('');
  const [editOccupation, setEditOccupation] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditEmail(user.email || '');
      setEditGender(user.gender || '');
      setEditAge(user.age !== undefined && user.age !== null ? user.age.toString() : '');
      setEditOccupation(user.occupation || '');
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
      const updateData = {
        name: editName,
        gender: editGender || null,
        age: editAge ? parseInt(editAge, 10) : null,
        occupation: editOccupation || null
      };
      const data = await authService.updateProfile(updateData);
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
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem', textAlign: 'left' }}>Full Name</label>
                  <input 
                    type="text" 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)}
                    className={styles.editInput}
                    placeholder="Full Name"
                  />
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem', textAlign: 'left' }}>Email Address (Uneditable)</label>
                  <input 
                    type="email" 
                    value={editEmail} 
                    className={styles.editInput}
                    disabled
                    style={{ opacity: 0.6, cursor: 'not-allowed' }}
                  />
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem', textAlign: 'left' }}>Gender</label>
                  <select
                    value={editGender}
                    onChange={(e) => setEditGender(e.target.value)}
                    className={styles.editInput}
                    style={{ background: 'var(--bg-dark)', color: 'var(--text-primary)', width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-glass)', marginBottom: '0.75rem' }}
                  >
                    <option value="" style={{ background: 'var(--bg-dark)' }}>Select Gender</option>
                    <option value="Female" style={{ background: 'var(--bg-dark)' }}>Female</option>
                    <option value="Male" style={{ background: 'var(--bg-dark)' }}>Male</option>
                    <option value="Non-binary" style={{ background: 'var(--bg-dark)' }}>Non-binary</option>
                    <option value="Other" style={{ background: 'var(--bg-dark)' }}>Other</option>
                    <option value="Prefer not to say" style={{ background: 'var(--bg-dark)' }}>Prefer not to say</option>
                  </select>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem', textAlign: 'left' }}>Age</label>
                  <input 
                    type="number" 
                    value={editAge} 
                    onChange={(e) => setEditAge(e.target.value)}
                    className={styles.editInput}
                    placeholder="Age"
                    min="0"
                    max="150"
                  />
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem', textAlign: 'left' }}>Occupation</label>
                  <input 
                    type="text" 
                    value={editOccupation} 
                    onChange={(e) => setEditOccupation(e.target.value)}
                    className={styles.editInput}
                    placeholder="Occupation"
                  />
                  {error && <p className={styles.errorText} style={{ color: '#ff6b6b', fontSize: '0.875rem', marginTop: '0.25rem' }}>{error}</p>}
                </div>
              ) : (
                <>
                  <h2 className={styles.userName}>{user?.name || 'User'}</h2>
                  <p className={styles.userEmail}>{user?.email || 'user@example.com'}</p>
                  
                  <div className={styles.metadataFields} style={{ margin: '0.75rem 0', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'left' }}>
                    {user?.gender && <div><strong>Gender:</strong> {user.gender}</div>}
                    {user?.age && <div><strong>Age:</strong> {user.age}</div>}
                    {user?.occupation && <div><strong>Occupation:</strong> {user.occupation}</div>}
                  </div>

                  <div className={styles.badges}>
                    <span className={styles.badge} title="Complimentary Lifetime Premium for founding editors">PREMIUM MEMBER</span>
                    <span className={styles.badge}>EDITOR SINCE {user?.created_at ? new Date(user.created_at).getFullYear() : 2023}</span>
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

      <div className={styles.dangerZone}>
        <h3 className={styles.dangerTitle}>Archive or Delete Account</h3>
        <p className={styles.dangerText}>Once you delete your account, there is no going back. Please be certain before taking this action.</p>
        <button className={styles.deleteAccountBtn} onClick={handleDeleteAccount}>DELETE ACCOUNT</button>
      </div>
    </div>
  );
};

export default Profile;
