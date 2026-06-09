const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const leadsRoutes = require('./routes/leads');
const counselorsRoutes = require('./routes/counselors');
const allocationsRoutes = require('./routes/allocations');
const activityRoutes = require('./routes/activity');
const reportsRoutes = require('./routes/reports');

const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const apiLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS || 300),
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(
  cors({
    origin: allowedOrigins,
  }),
);
app.use(express.json());
app.use('/api', apiLimiter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/leads', leadsRoutes);
app.use('/api/counselors', counselorsRoutes);
app.use('/api/allocations', allocationsRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/reports', reportsRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
