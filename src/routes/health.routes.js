const { Router } = require('express');
const mongoose = require('mongoose');

const router = Router();
const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];

// GET /health: reports whether the API and the database are up.
router.get('/', (req, res) => {
  const dbState = dbStates[mongoose.connection.readyState] || 'unknown';
  const healthy = dbState === 'connected';
  res.status(healthy ? 200 : 503).json({
    success: healthy,
    status: healthy ? 'ok' : 'degraded',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    database: { name: mongoose.connection.name || null, state: dbState },
  });
});

module.exports = router;
