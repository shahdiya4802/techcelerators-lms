const { pool } = require('../config/database');

async function listCounselors(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, email, phone, sheet_url, active, created_at
       FROM counselors
       ORDER BY active DESC, name ASC`,
    );

    res.json(rows);
  } catch (error) {
    next(error);
  }
}

async function createCounselor(req, res, next) {
  try {
    const { name, email, phone, sheet_url, active } = req.body;

    const [result] = await pool.query(
      `INSERT INTO counselors (name, email, phone, sheet_url, active)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, phone || null, sheet_url || null, active !== undefined ? active : true],
    );

    const [rows] = await pool.query(
      `SELECT id, name, email, phone, sheet_url, active, created_at
       FROM counselors
       WHERE id = ?`,
      [result.insertId],
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    if (error && error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Counselor with this email already exists' });
    }

    return next(error);
  }
}

module.exports = {
  listCounselors,
  createCounselor,
};
