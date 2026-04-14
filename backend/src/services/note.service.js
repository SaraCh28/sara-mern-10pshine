const Note = require('../models/note.model');

exports.createNote = async (data) => {
  return await Note.createNote(data.title, data.content);
};

exports.getNotes = async () => {
  return await Note.getAllNotes();
};

exports.updateNote = async (id, data) => {
  return await Note.updateNote(id, data.title, data.content);
};

exports.deleteNote = async (id) => {
  return await Note.deleteNote(id);
};
