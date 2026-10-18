const rateLimit = require('express-rate-limit');
const config = require('../config/env');
const logger = require('../utils/logger');

const WINDOW_MS = 15 * 60 * 1000;

const build = (max) =>
  rateLimit({
    windowMs: WINDOW_MS,
    max,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn(`Rate limit exceeded: ${req.ip} ${req.method} ${req.originalUrl}`);
      res.status(429).json({ success: false, message: 'Too many requests, please try again later.' });
    },
  });

// Strict limit for signup/login to slow down brute-force and credential stuffing.
const authLimiter = build(config.authRateLimitMax);
// General limit for all other API traffic.
const apiLimiter = build(config.apiRateLimitMax);

module.exports = { authLimiter, apiLimiter };
