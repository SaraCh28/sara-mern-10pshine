import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { 
  Save, 
  Trash2, 
  ChevronLeft, 
  Image as ImageIcon,
  Tag as TagIcon
} from 'lucide-react';
import Button from '../../components/common/Button';
import GlassPanel from '../../components/common/GlassPanel';
import { notesService, notebooksService } from '../../services/api';
import styles from './NoteEditor.module.css';

const NoteEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const quillRef = useRef(null);
  const fileInputRef = useRef(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [notebookId, setNotebookId] = useState('');
  const [notebooks, setNotebooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const handleImageUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, etc.).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      if (quillRef.current) {
        const editor = quillRef.current.getEditor();
        const range = editor.getSelection();
        const cursorIndex = range ? range.index : editor.getLength();
        editor.insertEmbed(cursorIndex, 'image', base64);
        editor.setSelection(cursorIndex + 1);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // Reset file input
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'code-block'],
      ['clean']
    ]
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setFetching(true);
        const notebooksRes = await notebooksService.getAllNotebooks();
        setNotebooks(notebooksRes.data || []);

        if (id) {
          const data = await notesService.getNoteById(id);
          const note = data.data;
          setTitle(note.title || '');
          setContent(note.content || '');
          setTags(note.tags || '');
          setNotebookId(note.notebook_id || '');
        }
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setFetching(false);
      }
    };

    fetchInitialData();
  }, [id]);


  const handleSave = async () => {
    if (!title.trim()) return;
    
    try {
      setLoading(true);
      const noteData = { 
        title, 
        content, 
        tags, 
        notebook_id: notebookId ? parseInt(notebookId) : null 
      };
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
            {id ? 'Editing Note' : 'New Note'}
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

        <ReactQuill
          ref={quillRef}
          theme="snow"
          modules={modules}
          className={styles.contentArea}
          placeholder="Start writing your thoughts..."
          value={content}
          onChange={setContent}
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
            <h4 className={styles.sectionTitle}>IMAGE UPLOAD</h4>
            <div className={styles.actionButtons}>
              <Button onClick={handleImageUploadClick} variant="secondary" style={{ width: '100%' }}>
                <ImageIcon size={18} style={{ marginRight: '0.5rem' }} /> Upload Image
              </Button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/*" 
                style={{ display: 'none' }} 
              />
            </div>
          </div>

          <div className={styles.panelSection}>
            <h4 className={styles.sectionTitle}>NOTEBOOK</h4>
            <select 
              value={notebookId} 
              onChange={(e) => setNotebookId(e.target.value)}
              className={styles.tagInput}
              style={{ 
                width: '100%', 
                marginBottom: '16px', 
                background: 'var(--bg-dark)', 
                color: 'var(--text-primary)', 
                border: '1px solid var(--border-glass)', 
                padding: '8px', 
                borderRadius: '4px',
                outline: 'none'
              }}
            >
              <option value="" style={{ background: 'var(--bg-dark)', color: 'var(--text-primary)' }}>No Notebook (Independent)</option>
              {notebooks.map(nb => (
                <option key={nb.id} value={nb.id} style={{ background: 'var(--bg-dark)', color: 'var(--text-primary)' }}>{nb.name}</option>
              ))}
            </select>
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
