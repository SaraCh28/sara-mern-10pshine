import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Star, MoreHorizontal, Archive, Download } from 'lucide-react';
import GlassPanel from '../common/GlassPanel';
import styles from './NoteCard.module.css';

const NoteCard = ({ note, onClick, onFavorite, onArchive, onDownloadPdf }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(note.id)}
      className={styles.cardWrapper}
    >
      <GlassPanel className={styles.card}>
        <div className={styles.gradientHeader} />

        <div className={styles.content}>
          <div className={styles.topRow}>
            <span className={styles.type}>{note.notebook_name ? note.notebook_name.toUpperCase() : 'INDEPENDENT'}</span>
            <div className={styles.actions}>
              <Star size={16} className={note.is_pinned ? styles.favorite : ''} onClick={(e) => { e.stopPropagation(); onFavorite(note.id); }} />
              <Archive size={16} onClick={(e) => { e.stopPropagation(); onArchive(note.id); }} />
              <Download size={16} onClick={(e) => { e.stopPropagation(); onDownloadPdf(note.id); }} />
              {/* <MoreHorizontal size={16} /> */}
            </div>
          </div>

          <h3 className={styles.title}>{note.title}</h3>
          <p className={styles.excerpt}>
            {note.content ? new DOMParser().parseFromString(note.content, 'text/html').body.textContent : ''}
          </p>

          <div className={styles.footer}>
            <div className={styles.date}>
              <Clock size={14} />
              <span>{formatDate(note.updated_at || note.created_at)}</span>
            </div>
            {note.tags && (
              <div className={styles.tags}>
                {note.tags.split(',').map(tag => (
                  <span key={tag} className={styles.tag}>#{tag.trim()}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </GlassPanel>
    </motion.div>
  );
};

export default NoteCard;
