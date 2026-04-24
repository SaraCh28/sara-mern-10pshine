import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Filter } from 'lucide-react';
import NoteCard from '../../components/notes/NoteCard';
import { notesService } from '../../services/api';
import styles from './Dashboard.module.css';

const Dashboard = () => {
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
      setNotes(data.data || []);
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
        <div className={styles.titleArea}>
          <p className={styles.greeting}>GOOD EVENING, JULIAN</p>
          <h1 className={styles.title}>Your Digital Curator</h1>
        </div>

        <div className={styles.controls}>
          <button className={styles.filterBtn}>
            <Filter size={18} />
            <span>Filter</span>
          </button>
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
          <img 
            src="https://illustrations.popsy.co/white/meditating-man.svg" 
            alt="Empty" 
            width={200} 
          />
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
          {notes.map((note) => (
            <motion.div variants={item} key={note.id}>
              <NoteCard note={note} onClick={handleNoteClick} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
