const express = require('express');
const notebooksController = require('./notebooks.controller');
const asyncHandler = require('../../utils/asyncHandler');
const authMiddleware = require('../../middleware/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', asyncHandler(notebooksController.getNotebooks));
router.get('/:id', asyncHandler(notebooksController.getNotebook));
router.post('/', asyncHandler(notebooksController.createNotebook));
router.put('/:id', asyncHandler(notebooksController.updateNotebook));
router.delete('/:id', asyncHandler(notebooksController.deleteNotebook));

module.exports = router;
