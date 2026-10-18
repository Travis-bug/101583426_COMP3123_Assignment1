const config = require('./config/env');
const connectDB = require('./config/db');
const logger = require('./utils/logger');
const app = require('./app');

async function start() {
  try {
    await connectDB();
    app.listen(config.port, () => {
      logger.info(`Server listening on http://localhost:${config.port} (${config.nodeEnv})`);
    });
  } catch (err) {
    logger.error(`Startup failed: ${err.message}`);
    process.exit(1);
  }
}

start();
