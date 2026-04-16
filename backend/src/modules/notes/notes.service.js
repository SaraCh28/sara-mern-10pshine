const notesRepo = require('./notes.repository');

const getAllNotes = async (userId) => {
  return await notesRepo.findAllByUser(userId);
};

const getNoteById = async (noteId, userId) => {
  return await notesRepo.findByIdAndUser(noteId, userId);
};

const createNote = async (userId, noteData) => {
  return await notesRepo.create(userId, noteData);
};

const updateNote = async (noteId, userId, updateData) => {
  return await notesRepo.update(noteId, userId, updateData);
};

const deleteNote = async (noteId, userId) => {
  return await notesRepo.remove(noteId, userId);
};

module.exports = {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
};
