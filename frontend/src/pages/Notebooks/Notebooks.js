import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Book, Plus } from 'lucide-react';
import NoteCard from '../../components/notes/NoteCard';
import { notebooksService, notesService } from '../../services/api';
import styles from '../Dashboard/Dashboard.module.css';

const Notebooks = () => {
  const [notebooks, setNotebooks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newNotebookName, setNewNotebookName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [nbData, notesData] = await Promise.all([
        notebooksService.getAllNotebooks(),
        notesService.getAllNotes()
      ]);
      setNotebooks(nbData.data || []);
      setNotes(notesData.data || []);
    } catch (err) {
      console.error('Failed to load notebooks data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNotebook = async (e) => {
    e.preventDefault();
    if (!newNotebookName.trim()) return;
    try {
      await notebooksService.createNotebook(newNotebookName);
      setNewNotebookName('');
      fetchData();
    } catch (err) {
      console.error('Failed to create notebook', err);
    }
  };

  const handleNoteClick = (noteId) => {
    navigate(`/editor/${noteId}`);
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) {
    return <div className={styles.container}><div className={styles.loading}><div className={styles.skeletonCard} /></div></div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.topSection}>
          <div className={styles.titleArea}>
            <p className={styles.greeting}>NOTEBOOKS</p>
            <h1 className={styles.title}>Your Collections</h1>
          </div>
        </div>

        <form onSubmit={handleCreateNotebook} style={{ display: 'flex', gap: '1rem', maxWidth: '600px', width: '100%' }}>
          <input 
            type="text" 
            placeholder="New Notebook Name..." 
            value={newNotebookName}
            onChange={(e) => setNewNotebookName(e.target.value)}
            style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', color: 'white' }}
          />
          <button type="submit" className={styles.createBtn} style={{ padding: '0 24px' }}>
            <Plus size={18} /> Add
          </button>
        </form>
      </header>

      {notebooks.length === 0 ? (
        <div className={styles.empty}>
          <Book size={64} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          <h3>No notebooks yet</h3>
          <p>Create your first notebook to start organizing.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {notebooks.map(nb => {
            const nbNotes = notes.filter(n => n.notebook_id === nb.id);
            return (
              <div key={nb.id}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Book size={24} color="var(--accent-purple)" />
                  {nb.name} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>({nbNotes.length})</span>
                </h2>
                
                {nbNotes.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)' }}>No notes in this notebook.</p>
                ) : (
                  <motion.div variants={container} initial="hidden" animate="show" className={styles.grid}>
                    {nbNotes.map(note => (
                      <motion.div variants={item} key={note.id}>
                        <NoteCard 
                          note={note} 
                          onClick={handleNoteClick} 
                          onFavorite={() => {}} 
                          onArchive={() => {}} 
                          onDownloadPdf={() => {}}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notebooks;
