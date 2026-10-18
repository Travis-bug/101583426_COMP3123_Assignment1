const logger = require('../utils/logger');

// One line per request, written when the response finishes.
// Only method, URL, status, duration, IP and user id: never headers or bodies.
module.exports = (req, res, next) => {
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const ms = Number(process.hrtime.bigint() - start) / 1e6;
    const user = req.user ? ` user=${req.user.id}` : '';
    const line = `${req.method} ${req.originalUrl} ${res.statusCode} ${ms.toFixed(1)}ms ip=${req.ip}${user}`;
    if (res.statusCode >= 500) logger.error(line);
    else if (res.statusCode >= 400) logger.warn(line);
    else logger.info(line);
  });
  next();
};
