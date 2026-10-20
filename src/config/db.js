const mongoose = require('mongoose');
const config = require('./env');
const logger = require('../utils/logger');

// The promise is cached so the local server and the Vercel handler share one connection.
let connecting = null;

// dbName is set explicitly so the database is always comp3123_assignment1,
// even if the URI points somewhere else.
function connectDB() {
  if (mongoose.connection.readyState === 1) return Promise.resolve();
  if (!connecting) {
    connecting = mongoose
      .connect(config.mongoUri, {
        dbName: config.dbName,
        serverSelectionTimeoutMS: 5000, // fail fast if MongoDB is not running
      })
      .then(() => {
        logger.info(`MongoDB connected (db: ${mongoose.connection.name})`);
      })
      .catch((err) => {
        connecting = null; // allow a retry on the next call
        throw err;
      });
  }
  return connecting;
}

module.exports = connectDB;
