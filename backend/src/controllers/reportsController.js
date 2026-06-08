const { pool } = require('../config/database');

async function getDashboardMetrics(req, res, next) {
  try {
    const [[{ total_leads }]] = await pool.query('SELECT COUNT(*) AS total_leads FROM leads');
    const [sourceMetrics] = await pool.query('SELECT source, COUNT(*) AS count FROM leads GROUP BY source ORDER BY count DESC');
    const [statusMetrics] = await pool.query('SELECT current_status, COUNT(*) AS count FROM leads GROUP BY current_status ORDER BY count DESC');
    const [connectivityMetrics] = await pool.query('SELECT connectivity_status, COUNT(*) AS count FROM leads GROUP BY connectivity_status ORDER BY count DESC');
    const [counselorMetrics] = await pool.query(
      `SELECT c.id AS counselor_id, c.name AS counselor_name, COUNT(l.id) AS assigned_leads
       FROM counselors c
       LEFT JOIN leads l ON l.assigned_to = c.id
       GROUP BY c.id, c.name
       ORDER BY assigned_leads DESC`,
    );

    res.json({
      total_leads,
      source_metrics: sourceMetrics,
      status_metrics: statusMetrics,
      connectivity_metrics: connectivityMetrics,
      counselor_metrics: counselorMetrics,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDashboardMetrics,
};
