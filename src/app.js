const express = require('express');
const helmet = require('helmet');
const healthRoutes = require('./routes/health.routes');
const apiRoutes = require('./routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(requestLogger);
app.use(express.json({ limit: '10kb' }));

app.use('/health', healthRoutes);
app.use('/api/v1', apiLimiter, apiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
