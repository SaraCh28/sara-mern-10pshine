const { sendSuccess, sendError } = require('../../utils/apiResponse');
const { HTTP_STATUS } = require('../../utils/constants');
const notesService = require('./notes.service');
const { createNoteSchema, updateNoteSchema } = require('./notes.validation');

const getNotes = async (req, res) => {
  const userId = req.user.id;
  const notes = await notesService.getAllNotes(userId);
  return sendSuccess(res, HTTP_STATUS.OK, 'Notes fetched successfully', notes);
};

const getNote = async (req, res) => {
  const userId = req.user.id;
  const noteId = req.params.id;

  const note = await notesService.getNoteById(noteId, userId);
  if (!note) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Note not found');
  }

  return sendSuccess(res, HTTP_STATUS.OK, 'Note fetched successfully', note);
};

const createNote = async (req, res) => {
  const userId = req.user.id;

  const { error, value } = createNoteSchema.validate(req.body);
  if (error) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, error.details[0].message);
  }

  const newNote = await notesService.createNote(userId, value);
  return sendSuccess(res, HTTP_STATUS.CREATED, 'Note created successfully', newNote);
};

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

  return sendSuccess(res, HTTP_STATUS.OK, 'Note updated successfully', updatedNote);
};

const deleteNote = async (req, res) => {
  const userId = req.user.id;
  const noteId = req.params.id;

  const deleted = await notesService.deleteNote(noteId, userId);
  if (!deleted) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Note not found or you do not have permission.');
  }

  return sendSuccess(res, HTTP_STATUS.OK, 'Note deleted successfully');
};

module.exports = {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
};
