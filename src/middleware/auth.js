const jwt = require('jsonwebtoken');
const config = require('../config/env');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

// Verifies the Bearer JWT and sets req.user = { id, username }.
// The owner of every employee operation comes from here, never from the client.
module.exports = async (req, res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (!token || scheme.toLowerCase() !== 'bearer') {
    logger.warn(`Auth failed: token missing (${req.method} ${req.originalUrl})`);
    throw new ApiError(401, 'Authentication token missing');
  }

  let payload;
  try {
    payload = jwt.verify(token, config.jwtSecret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      logger.warn(`Auth failed: token expired (${req.method} ${req.originalUrl})`);
      throw new ApiError(401, 'Token expired');
    }
    logger.warn(`Auth failed: invalid token (${req.method} ${req.originalUrl})`);
    throw new ApiError(401, 'Invalid token');
  }

  const user = await User.findById(payload.sub);
  if (!user) {
    logger.warn(`Auth failed: user ${payload.sub} no longer exists`);
    throw new ApiError(401, 'Invalid token');
  }

  req.user = { id: user._id.toString(), username: user.username };
  next();
};
