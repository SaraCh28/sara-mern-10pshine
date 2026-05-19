const notebooksRepository = require('./notebooks.repository');

const getAllNotebooks = async (userId) => {
  return await notebooksRepository.findAllByUser(userId);
};

const getNotebookById = async (id, userId) => {
  return await notebooksRepository.findByIdAndUser(id, userId);
};

const createNotebook = async (userId, name) => {
  return await notebooksRepository.create(userId, name);
};

const updateNotebook = async (id, userId, name) => {
  return await notebooksRepository.update(id, userId, name);
};

const deleteNotebook = async (id, userId) => {
  return await notebooksRepository.remove(id, userId);
};

module.exports = {
  getAllNotebooks,
  getNotebookById,
  createNotebook,
  updateNotebook,
  deleteNotebook,
};
