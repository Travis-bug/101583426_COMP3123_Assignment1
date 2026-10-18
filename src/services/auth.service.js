const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

// Compared against when the user does not exist, so both failures take similar time.
const dummyHash = bcrypt.hashSync('not-a-real-password', User.BCRYPT_ROUNDS);

const signToken = (user) =>
  jwt.sign({ sub: user._id }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });

async function signup({ username, email, password }) {
  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) {
    const field = existing.email === email ? 'email' : 'username';
    logger.warn(`Signup rejected: duplicate ${field}`);
    throw new ApiError(409, `A user with this ${field} already exists`);
  }

  let user;
  try {
    user = await User.create({ username, email, password });
  } catch (err) {
    // Lost a race with a concurrent signup: the unique index caught it.
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || 'username or email';
      logger.warn(`Signup rejected: duplicate ${field}`);
      throw new ApiError(409, `A user with this ${field} already exists`);
    }
    throw err;
  }

  logger.info(`Signup success: ${user.username}`);
  return user;
}

async function login({ username, email, password }) {
  const identifier = email || username;
  const user = await User.findOne(email ? { email } : { username }).select('+password');
  const valid = await bcrypt.compare(password, user ? user.password : dummyHash);

  if (!user || !valid) {
    logger.warn(`Login failed: ${identifier}`);
    throw new ApiError(401, 'Invalid credentials');
  }

  logger.info(`Login success: ${user.username}`);
  return { token: signToken(user), user };
}

module.exports = { signup, login };
