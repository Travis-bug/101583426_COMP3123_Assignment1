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

  // Body over the express.json() size limit
  if (err.type === 'entity.too.large') {
    status = 413;
    message = 'Request body too large';
  }

  let errors = err.errors;

  // Mongoose errors that would otherwise surface as 500s
  if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid id';
  } else if (err.name === 'ValidationError' && err.errors && !err.statusCode) {
    status = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
  } else if (err.code === 11000) {
    status = 409;
    message = 'Duplicate value';
  }

  if (status >= 500) {
    logger.error(`${req.method} ${req.originalUrl} -> ${status}: ${err.stack || err.message}`);
    // Never leak internals to the client outside development.
    if (config.nodeEnv !== 'development') message = 'Internal server error';
  } else {
    logger.warn(`${req.method} ${req.originalUrl} -> ${status}: ${message}`);
  }

  const body = { success: false, message };
  if (errors) body.errors = errors;
  res.status(status).json(body);
};
