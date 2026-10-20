const fs = require('fs');
const path = require('path');

// Minimal logger: writes to console and logs/app.log.
// On Vercel the filesystem is read-only, so only the console is used there.
const toFile = !process.env.VERCEL;
const logDir = path.join(__dirname, '..', '..', 'logs');
const logFile = path.join(logDir, 'app.log');
let fileReady = false;
if (toFile) {
  try {
    fs.mkdirSync(logDir, { recursive: true });
    fileReady = true;
  } catch (err) {
    console.error(`Log directory unavailable, logging to console only: ${err.message}`);
  }
}

function write(level, message) {
  const line = `${new Date().toISOString()} [${level.toUpperCase()}] ${message}`;
  console.log(line);
  if (fileReady) fs.appendFile(logFile, line + '\n', () => {});
}

module.exports = {
  info: (msg) => write('info', msg),
  warn: (msg) => write('warn', msg),
  error: (msg) => write('error', msg),
};
