const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/apiResponse');
const { HTTP_STATUS } = require('../utils/constants');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Access denied. No token provided.');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, iat, exp }
    next();
  } catch (err) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Invalid or expired token.');
  }
};

module.exports = authMiddleware;
