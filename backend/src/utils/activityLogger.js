const logger = require("./logger");

function logActivity({ userId, action, meta = {} }) {
  logger.info(
    {
      userId,
      action,
      ...meta,
    },
    "USER_ACTIVITY"
  );
}

module.exports = logActivity;