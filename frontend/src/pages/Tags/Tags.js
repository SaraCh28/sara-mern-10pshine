import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tag as TagIcon } from 'lucide-react';
import NoteCard from '../../components/notes/NoteCard';
import { notesService } from '../../services/api';
import styles from '../Dashboard/Dashboard.module.css';

const Tags = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await notesService.getAllNotes();
      setNotes(data.data || []);
    } catch (err) {
      console.error('Failed to load notes for tags', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNoteClick = (noteId) => {
    navigate(`/editor/${noteId}`);
  };

  // Extract unique tags and group notes
  const tagsMap = {};
  notes.forEach(note => {
    if (note.tags) {
      const splitTags = note.tags.split(',').map(t => t.trim()).filter(t => t);
      splitTags.forEach(t => {
        if (!tagsMap[t]) tagsMap[t] = [];
        tagsMap[t].push(note);
      });
    }
  });

  const uniqueTags = Object.keys(tagsMap).sort();

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
            <p className={styles.greeting}>TAGS</p>
            <h1 className={styles.title}>All Tags</h1>
          </div>
        </div>
      </header>

      {uniqueTags.length === 0 ? (
        <div className={styles.empty}>
          <TagIcon size={64} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          <h3>No tags found</h3>
          <p>Add tags to your notes to see them organized here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {uniqueTags.map(tag => {
            const tagNotes = tagsMap[tag];
            return (
              <div key={tag}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TagIcon size={24} color="var(--accent-purple)" />
                  #{tag} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>({tagNotes.length})</span>
                </h2>
                
                <motion.div variants={container} initial="hidden" animate="show" className={styles.grid}>
                  {tagNotes.map(note => (
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Tags;
