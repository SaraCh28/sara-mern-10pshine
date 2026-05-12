const bcrypt = require('bcryptjs');
const { sendSuccess, sendError } = require('../../utils/apiResponse');
const { HTTP_STATUS } = require('../../utils/constants');
const authService = require('./auth.service');
const { registerSchema, loginSchema, updateProfileSchema } = require('./auth.validation');
const logger = require('../../config/logger');

const register = async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, error.details[0].message);
  }

  const { name, email, password } = req.body;

  const existingUser = await authService.findUserByEmail(email);
  if (existingUser) {
    return sendError(res, HTTP_STATUS.CONFLICT, 'User with this email already exists.');
  }

  const newUser = await authService.createUser(name, email, password);
  const token = authService.generateToken(newUser);

  logger.info({ userId: newUser.id, email }, 'User registered successfully');

  return sendSuccess(res, HTTP_STATUS.CREATED, 'User registered successfully', {
    user: newUser,
    token,
  });
};

const login = async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, error.details[0].message);
  }

  const { email, password } = req.body;

  const user = await authService.findUserByEmail(email);
  if (!user) {
    logger.warn({ email }, 'Login failed: user not found');
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Invalid email or password.');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    logger.warn({ email }, 'Login failed: invalid password');
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Invalid email or password.');
  }

  const token = authService.generateToken(user);

  logger.info({ userId: user.id, email }, 'User logged in successfully');

  return sendSuccess(res, HTTP_STATUS.OK, 'Login successful', {
    user: { id: user.id, name: user.name, email: user.email },
    token,
  });
};

const getMe = async (req, res) => {
    // req.user is set by authMiddleware
    const user = await authService.findUserByEmail(req.user.email);
    if (!user) {
        return sendError(res, HTTP_STATUS.NOT_FOUND, 'User not found.');
    }
    return sendSuccess(res, HTTP_STATUS.OK, 'User details fetched', {
        user: { id: user.id, name: user.name, email: user.email }
    });
}

const updateMe = async (req, res) => {
    const { error, value } = updateProfileSchema.validate(req.body);
    if (error) {
        return sendError(res, HTTP_STATUS.BAD_REQUEST, error.details[0].message);
    }

    // Check if email is being updated and already exists
    if (value.email && value.email !== req.user.email) {
        const existing = await authService.findUserByEmail(value.email);
        if (existing) {
            return sendError(res, HTTP_STATUS.CONFLICT, 'Email already in use.');
        }
    }

    const updatedUser = await authService.updateUser(req.user.id, value);
    if (!updatedUser) {
        return sendError(res, HTTP_STATUS.NOT_FOUND, 'User not found.');
    }

    // Generate new token if email or name changes (since they are in payload)
    const token = authService.generateToken(updatedUser);

    return sendSuccess(res, HTTP_STATUS.OK, 'Profile updated successfully', {
        user: updatedUser,
        token,
    });
};

const deleteMe = async (req, res) => {
    const deleted = await authService.deleteUser(req.user.id);
    if (!deleted) {
        return sendError(res, HTTP_STATUS.NOT_FOUND, 'User not found.');
    }
    return sendSuccess(res, HTTP_STATUS.OK, 'Account deleted successfully');
};

module.exports = {
  register,
  login,
  getMe,
  updateMe,
  deleteMe,
};
