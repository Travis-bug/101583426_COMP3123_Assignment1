const { Router } = require('express');
const mongoose = require('mongoose');

const router = Router();
const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];

// GET /health: reports whether the API and the database are up.
router.get('/', async (req, res) => {
  const dbState = dbStates[mongoose.connection.readyState] || 'unknown';
  const healthy = dbState === 'connected';
  let ping = null;
  if (healthy) {
    try {
      await mongoose.connection.db.admin().ping();
      ping = 'ok';
    } catch (err) {
      ping = 'failed';
    }
  }
  res.status(healthy && ping === 'ok' ? 200 : 503).json({
    success: healthy && ping === 'ok',
    status: healthy && ping === 'ok' ? 'ok' : 'degraded',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    database: { name: mongoose.connection.name || null, state: dbState, ping },
  });
});

module.exports = router;
