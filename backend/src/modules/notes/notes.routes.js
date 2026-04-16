const express = require('express');
const notesController = require('./notes.controller');
const asyncHandler = require('../../utils/asyncHandler');
const authMiddleware = require('../../middleware/auth.middleware');

const router = express.Router();

// All note routes require authentication
router.use(authMiddleware);

router.get('/', asyncHandler(notesController.getNotes));
router.get('/:id', asyncHandler(notesController.getNote));
router.post('/', asyncHandler(notesController.createNote));
router.put('/:id', asyncHandler(notesController.updateNote));
router.delete('/:id', asyncHandler(notesController.deleteNote));

module.exports = router;
