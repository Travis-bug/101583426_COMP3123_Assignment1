const mongoose = require('mongoose');
const config = require('./env');
const logger = require('../utils/logger');

// dbName is set explicitly so the database is always comp3123_assignment1,
// even if the URI points somewhere else.
async function connectDB() {
  await mongoose.connect(config.mongoUri, {
    dbName: config.dbName,
    serverSelectionTimeoutMS: 5000, // fail fast if MongoDB is not running
  });
  logger.info(`MongoDB connected (db: ${mongoose.connection.name})`);
}

module.exports = connectDB;
