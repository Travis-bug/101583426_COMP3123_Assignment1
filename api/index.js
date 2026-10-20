const connectDB = require('../src/config/db');
const app = require('../src/app');

// Vercel entry point. src/server.js stays the local entry point.
module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};
