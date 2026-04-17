const logger = require('../config/logger');

const loggerMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    };

    if (res.statusCode >= 500) {
      logger.error(logData, '🔴 Server Error');
    } else if (res.statusCode >= 400) {
      logger.warn(logData, '🟡 Client Error');
    } else {
      logger.info(logData, '🟢 Request');
    }
  });

  next();
};

module.exports = loggerMiddleware;