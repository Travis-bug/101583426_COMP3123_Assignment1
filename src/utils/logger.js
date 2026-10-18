const fs = require('fs');
const path = require('path');

// Minimal local logger: writes to console and logs/app.log.
// Step 3 will add request logging and redaction of sensitive fields.
const logDir = path.join(__dirname, '..', '..', 'logs');
fs.mkdirSync(logDir, { recursive: true });
const logFile = path.join(logDir, 'app.log');

function write(level, message) {
  const line = `${new Date().toISOString()} [${level.toUpperCase()}] ${message}`;
  console.log(line);
  fs.appendFile(logFile, line + '\n', () => {});
}

module.exports = {
  info: (msg) => write('info', msg),
  warn: (msg) => write('warn', msg),
  error: (msg) => write('error', msg),
};
