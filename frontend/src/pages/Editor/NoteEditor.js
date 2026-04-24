import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, 
  Trash2, 
  ChevronLeft, 
  Bold, 
  Italic, 
  List, 
  Link as LinkIcon, 
  Code,
  Tag as TagIcon
} from 'lucide-react';
import Button from '../../components/common/Button';
import GlassPanel from '../../components/common/GlassPanel';
import { notesService } from '../../services/api';
import styles from './NoteEditor.module.css';

const NoteEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        setFetching(true);
        const data = await notesService.getNoteById(id);
        const note = data.data;
        setTitle(note.title || '');
        setContent(note.content || '');
        setTags(note.tags || '');
      } catch (err) {
        console.error('Failed to fetch note', err);
        navigate('/');
      } finally {
        setFetching(false);
      }
    };

    if (id) {
      fetchNote();
    }
  }, [id, navigate]);


  const handleSave = async () => {
    if (!title.trim()) return;
    
    try {
      setLoading(true);
      const noteData = { title, content, tags };
      if (id) {
        await notesService.updateNote(id, noteData);
      } else {
        await notesService.createNote(noteData);
      }
      navigate('/');
    } catch (err) {
      console.error('Failed to save note', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        setLoading(true);
        await notesService.deleteNote(id);
        navigate('/');
      } catch (err) {
        console.error('Failed to delete note', err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (fetching) return <div className={styles.loading}>Loading curator space...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.mainEditor}>
        <header className={styles.header}>
          <button onClick={() => navigate('/')} className={styles.backBtn}>
            <ChevronLeft size={20} />
            <span>Dashboard</span>
          </button>
          <div className={styles.status}>
            {id ? 'Editing Note' : 'New Note'} — {content.length} characters
          </div>
        </header>

        <input
          type="text"
          className={styles.titleInput}
          placeholder="Note Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />

        <textarea
          className={styles.contentArea}
          placeholder="Start writing your thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <aside className={styles.sidePanel}>
        <GlassPanel className={styles.actionCard}>
          <div className={styles.panelSection}>
            <h4 className={styles.sectionTitle}>QUICK ACTIONS</h4>
            <div className={styles.actionButtons}>
              <Button onClick={handleSave} isLoading={loading}>
                <Save size={18} /> Save Changes
              </Button>
              <Button variant="secondary" onClick={() => navigate('/')}>
                Cancel
              </Button>
            </div>
          </div>

          <div className={styles.panelSection}>
            <h4 className={styles.sectionTitle}>FORMATTING</h4>
            <div className={styles.toolbar}>
              <button className={styles.toolBtn}><Bold size={18} /></button>
              <button className={styles.toolBtn}><Italic size={18} /></button>
              <button className={styles.toolBtn}><List size={18} /></button>
              <button className={styles.toolBtn}><LinkIcon size={18} /></button>
              <button className={styles.toolBtn}><Code size={18} /></button>
            </div>
          </div>

          <div className={styles.panelSection}>
            <h4 className={styles.sectionTitle}>TAGS</h4>
            <div className={styles.tagInputWrapper}>
              <TagIcon size={16} className={styles.tagIcon} />
              <input 
                type="text" 
                placeholder="Add tags separated by comma..." 
                className={styles.tagInput}
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
          </div>

          {id && (
            <div className={styles.panelSection}>
              <button className={styles.deleteBtn} onClick={handleDelete}>
                <Trash2 size={18} /> <span>Delete Note</span>
              </button>
            </div>
          )}
        </GlassPanel>
      </aside>
    </div>
  );
};

export default NoteEditor;
