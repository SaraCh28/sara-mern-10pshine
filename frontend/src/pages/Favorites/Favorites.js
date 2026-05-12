import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import NoteCard from '../../components/notes/NoteCard';
import { notesService } from '../../services/api';
import styles from '../Dashboard/Dashboard.module.css';

const Favorites = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const data = await notesService.getAllNotes();
      // Assume favorites are pinned notes for now, but exclude archived if needed?
      // Usually favorites are not hidden when archived, but let's exclude archived to keep it clean
      setNotes((data.data || []).filter(note => note.is_pinned && !note.is_archived));
    } catch (err) {
      setError('Failed to load notes. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNoteClick = (id) => {
    navigate(`/editor/${id}`);
  };

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
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <p className={styles.greeting}>FAVORITES</p>
          <h1 className={styles.title}>Your Pinned Thoughts</h1>
        </div>
      </header>

      {loading ? (
        <div className={styles.loading}>
          {[1, 2, 3].map(i => <div key={i} className={styles.skeletonCard} />)}
        </div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : notes.length === 0 ? (
        <div className={styles.empty}>
          <Star size={48} color="#ccc" style={{ marginBottom: '1rem' }} />
          <h3>No favorites yet</h3>
          <p>Pin your notes to see them here.</p>
        </div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className={styles.grid}>
          {notes.map((note) => (
            <motion.div variants={item} key={note.id}>
              <NoteCard 
                note={note} 
                onClick={handleNoteClick} 
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

export default Favorites;
