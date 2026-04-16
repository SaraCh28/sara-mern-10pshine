const bcrypt = require('bcryptjs');
const { sendSuccess, sendError } = require('../../utils/apiResponse');
const { HTTP_STATUS } = require('../../utils/constants');
const authService = require('./auth.service');
const { registerSchema, loginSchema } = require('./auth.validation');

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
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Invalid email or password.');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Invalid email or password.');
  }

  const token = authService.generateToken(user);

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

module.exports = {
  register,
  login,
  getMe,
};
