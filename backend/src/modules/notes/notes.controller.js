const { sendSuccess, sendError } = require('../../utils/apiResponse');
const { HTTP_STATUS } = require('../../utils/constants');
const notesService = require('./notes.service');
const { createNoteSchema, updateNoteSchema } = require('./notes.validation');
const logger = require('../../config/logger');

// Get all notes for a user
const getNotes = async (req, res) => {
  const userId = req.user.id;
  const notes = await notesService.getAllNotes(userId);
  return sendSuccess(res, HTTP_STATUS.OK, 'Notes fetched successfully', notes);
};

// Get a single note
const getNote = async (req, res) => {
  const userId = req.user.id;
  const noteId = req.params.id;
  const note = await notesService.getNoteById(noteId, userId);
  if (!note) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Note not found');
  }
  return sendSuccess(res, HTTP_STATUS.OK, 'Note fetched successfully', note);
};

// Create a new note
const createNote = async (req, res) => {
  const userId = req.user.id;
  const { error, value } = createNoteSchema.validate(req.body);
  if (error) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, error.details[0].message);
  }
  const newNote = await notesService.createNote(userId, value);
  logger.info({ userId, noteId: newNote.id }, 'User created a new note');
  return sendSuccess(res, HTTP_STATUS.CREATED, 'Note created successfully', newNote);
};

// Update an existing note
const updateNote = async (req, res) => {
  const userId = req.user.id;
  const noteId = req.params.id;
  const { error, value } = updateNoteSchema.validate(req.body);
  if (error) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, error.details[0].message);
  }
  const updatedNote = await notesService.updateNote(noteId, userId, value);
  if (!updatedNote) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Note not found or you do not have permission.');
  }
  logger.info({ userId, noteId }, 'User updated note');
  return sendSuccess(res, HTTP_STATUS.OK, 'Note updated successfully', updatedNote);
};

// Delete a note
const deleteNote = async (req, res) => {
  const userId = req.user.id;
  const noteId = req.params.id;
  const deleted = await notesService.deleteNote(noteId, userId);
  if (!deleted) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Note not found or you do not have permission.');
  }
  logger.info({ userId, noteId }, 'User deleted note');
  return sendSuccess(res, HTTP_STATUS.OK, 'Note deleted successfully');
};

// Toggle favorite status
const favoriteNote = async (req, res) => {
  const userId = req.user.id;
  const noteId = req.params.id;
  const { is_favorite } = req.body; // expects boolean
  const updatedNote = await notesService.updateNote(noteId, userId, { is_favorite });
  if (!updatedNote) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Note not found or you do not have permission.');
  }
  return sendSuccess(res, HTTP_STATUS.OK, 'Note favorite status updated', updatedNote);
};

// Toggle archive status
const archiveNote = async (req, res) => {
  const userId = req.user.id;
  const noteId = req.params.id;
  const { is_archived } = req.body; // expects boolean
  const updatedNote = await notesService.updateNote(noteId, userId, { is_archived });
  if (!updatedNote) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Note not found or you do not have permission.');
  }
  return sendSuccess(res, HTTP_STATUS.OK, 'Note archive status updated', updatedNote);
};

module.exports = {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  favoriteNote,
  archiveNote,
};
