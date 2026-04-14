const noteService = require('../services/note.service');

exports.createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        error: "Title and content are required"
      });
    }

    const result = await noteService.createNote({ title, content });

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getNotes = async (req, res) => {
  try {
    const notes = await noteService.getNotes();
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        error: 'Title and content are required'
      });
    }

    const result = await noteService.updateNote(req.params.id, req.body);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json({
      message: 'Note updated successfully'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const result = await noteService.deleteNote(req.params.id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json({
      message: 'Note deleted successfully'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};