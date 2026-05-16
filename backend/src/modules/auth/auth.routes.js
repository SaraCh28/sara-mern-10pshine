const express = require('express');
const authController = require('./auth.controller');
const asyncHandler = require('../../utils/asyncHandler');
const authMiddleware = require('../../middleware/auth.middleware');

const router = express.Router();

router.post('/register', asyncHandler(authController.register));
router.post('/login', asyncHandler(authController.login));
router.post('/google', asyncHandler(authController.googleLogin));
router.get('/me', authMiddleware, asyncHandler(authController.getMe));
router.put('/me', authMiddleware, asyncHandler(authController.updateMe));
router.delete('/me', authMiddleware, asyncHandler(authController.deleteMe));

module.exports = router;
