const express = require('express');
const { getDashboardMetrics } = require('../controllers/reportsController');

const router = express.Router();

router.get('/dashboard', getDashboardMetrics);

module.exports = router;
