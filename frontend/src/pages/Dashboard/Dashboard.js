import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, User, Inbox } from 'lucide-react';
import NoteCard from '../../components/notes/NoteCard';
import { notesService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const data = await notesService.getAllNotes();
      const activeNotes = (data.data || []).filter(note => !note.is_archived);
      setNotes(activeNotes);
    } catch (err) {
      setError('Failed to load notes. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNoteClick = (note) => {
    navigate(`/editor/${note.id}`);
  };

// New handlers for note actions
  const handleFavorite = async (noteId) => {
    try {
      const note = notes.find(n => n.id === noteId);
      await notesService.updateNote(noteId, { is_pinned: !note.is_pinned });
      fetchNotes();
    } catch (e) {
      console.error('Favorite error', e);
    }
  };

  const handleArchive = async (noteId) => {
    try {
      const note = notes.find(n => n.id === noteId);
      await notesService.updateNote(noteId, { is_archived: !note.is_archived });
      fetchNotes();
    } catch (e) {
      console.error('Archive error', e);
    }
  };

  const handleDownloadPdf = async (noteId) => {
    try {
      const note = await notesService.getNoteById(noteId);
      const { title, content } = note.data;
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`<h1>${title}</h1><div>${content}</div>`);
      printWindow.document.close();
      printWindow.print();
    } catch (e) {
      console.error('Download PDF error', e);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.topSection}>
          <div className={styles.titleArea}>
            <p className={styles.greeting}>GOOD EVENING, {user?.name?.split(' ')[0]?.toUpperCase() || 'USER'}</p>
            <h1 className={styles.title}>Your Digital Curator</h1>
          </div>

          <div className={styles.profile} onClick={() => navigate('/profile')}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.name?.split(' ')[0] || 'User'}</span>
            </div>
            <div className={styles.avatar}>
              {user?.name?.charAt(0) || <User size={18} />}
            </div>
          </div>
        </div>

        <div className={styles.searchSection}>
          <div className={styles.searchWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search notes..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
      </header>

      {loading ? (
        <div className={styles.loading}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className={styles.skeletonCard} />
          ))}
        </div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : notes.length === 0 ? (
        <div className={styles.empty}>
          <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '24px', borderRadius: '50%', marginBottom: '16px', boxShadow: '0 0 20px rgba(168, 85, 247, 0.2)' }}>
            <Inbox size={64} color="var(--accent-purple)" />
          </div>
          <h3>No notes found</h3>
          <p>Start your curation by creating a new note.</p>
          <button 
            className={styles.createBtn}
            onClick={() => navigate('/editor')}
          >
            <Plus size={18} /> Create New Note
          </button>
        </div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className={styles.grid}
        >
          {notes
            .filter(note => 
              note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
              (note.content && note.content.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            .map((note) => (
              <motion.div variants={item} key={note.id}>
                <NoteCard 
                  note={note} 
                  onClick={() => handleNoteClick(note)} 
                  onFavorite={handleFavorite} 
                  onArchive={handleArchive} 
                  onDownloadPdf={handleDownloadPdf}
                />
              </motion.div>
            ))}
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
