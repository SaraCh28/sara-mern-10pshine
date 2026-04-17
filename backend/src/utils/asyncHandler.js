/**
 * Wraps an async route handler and passes errors to Express error middleware.
 * Eliminates the need for try/catch in every controller.
 * @param {Function} fn
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
