const { pool } = require('../config/database');

async function getLeadActivity(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT id, lead_id, action_type, old_value, new_value, performed_by, created_at
       FROM lead_activity
       WHERE lead_id = ?
       ORDER BY created_at DESC`,
      [req.params.id],
    );

    res.json(rows);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getLeadActivity,
};
