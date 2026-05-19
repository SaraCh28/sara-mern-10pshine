const { sendSuccess, sendError } = require('../../utils/apiResponse');
const { HTTP_STATUS } = require('../../utils/constants');
const notebooksService = require('./notebooks.service');
const logger = require('../../config/logger');

const getNotebooks = async (req, res) => {
  const userId = req.user.id;
  const notebooks = await notebooksService.getAllNotebooks(userId);
  return sendSuccess(res, HTTP_STATUS.OK, 'Notebooks fetched successfully', notebooks);
};

const getNotebook = async (req, res) => {
  const userId = req.user.id;
  const notebookId = req.params.id;
  const notebook = await notebooksService.getNotebookById(notebookId, userId);
  if (!notebook) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Notebook not found');
  }
  return sendSuccess(res, HTTP_STATUS.OK, 'Notebook fetched successfully', notebook);
};

const createNotebook = async (req, res) => {
  const userId = req.user.id;
  const { name } = req.body;
  if (!name) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Notebook name is required');
  }
  const newNotebook = await notebooksService.createNotebook(userId, name);
  logger.info({ userId, notebookId: newNotebook.id }, 'User created a new notebook');
  return sendSuccess(res, HTTP_STATUS.CREATED, 'Notebook created successfully', newNotebook);
};

const updateNotebook = async (req, res) => {
  const userId = req.user.id;
  const notebookId = req.params.id;
  const { name } = req.body;
  if (!name) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Notebook name is required');
  }
  const updatedNotebook = await notebooksService.updateNotebook(notebookId, userId, name);
  if (!updatedNotebook) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Notebook not found or you do not have permission.');
  }
  logger.info({ userId, notebookId }, 'User updated notebook');
  return sendSuccess(res, HTTP_STATUS.OK, 'Notebook updated successfully', updatedNotebook);
};

const deleteNotebook = async (req, res) => {
  const userId = req.user.id;
  const notebookId = req.params.id;
  const deleted = await notebooksService.deleteNotebook(notebookId, userId);
  if (!deleted) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Notebook not found or you do not have permission.');
  }
  logger.info({ userId, notebookId }, 'User deleted notebook');
  return sendSuccess(res, HTTP_STATUS.OK, 'Notebook deleted successfully');
};

module.exports = {
  getNotebooks,
  getNotebook,
  createNotebook,
  updateNotebook,
  deleteNotebook,
};
