const logger = require('../utils/logger');
const config = require('../config/env');

// Central error handler. Every error response has the same shape:
// { success: false, message, errors? }
// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  // Malformed JSON body from express.json()
  if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Malformed JSON in request body';
  }

  if (status >= 500) {
    logger.error(`${req.method} ${req.originalUrl} -> ${status}: ${err.stack || err.message}`);
    // Never leak internals to the client outside development.
    if (config.nodeEnv !== 'development') message = 'Internal server error';
  } else {
    logger.warn(`${req.method} ${req.originalUrl} -> ${status}: ${message}`);
  }

  const body = { success: false, message };
  if (err.errors) body.errors = err.errors;
  res.status(status).json(body);
};
