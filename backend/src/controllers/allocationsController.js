const { pool } = require('../config/database');

async function allocateLead(req, res, next) {
  const connection = await pool.getConnection();

  try {
    const { lead_id, counselor_id, allocated_by } = req.body;

    await connection.beginTransaction();

    const [leadRows] = await connection.query('SELECT id, assigned_to FROM leads WHERE id = ?', [lead_id]);

    if (!leadRows.length) {
      await connection.rollback();
      return res.status(404).json({ message: 'Lead not found' });
    }

    const [counselorRows] = await connection.query('SELECT id FROM counselors WHERE id = ? AND active = 1', [counselor_id]);

    if (!counselorRows.length) {
      await connection.rollback();
      return res.status(404).json({ message: 'Active counselor not found' });
    }

    const [allocationResult] = await connection.query(
      `INSERT INTO allocations (lead_id, counselor_id, allocated_by)
       VALUES (?, ?, ?)`,
      [lead_id, counselor_id, allocated_by],
    );

    await connection.query('UPDATE leads SET assigned_to = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [counselor_id, lead_id]);

    await connection.query(
      `INSERT INTO lead_activity (lead_id, action_type, old_value, new_value, performed_by)
       VALUES (?, 'allocation', ?, ?, ?)`,
      [lead_id, String(leadRows[0].assigned_to || ''), String(counselor_id), allocated_by],
    );

    await connection.commit();

    const [rows] = await connection.query(
      `SELECT id, lead_id, counselor_id, allocated_at, allocated_by
       FROM allocations
       WHERE id = ?`,
      [allocationResult.insertId],
    );

    return res.status(201).json(rows[0]);
  } catch (error) {
    await connection.rollback();
    return next(error);
  } finally {
    connection.release();
  }
}

async function getLeadAllocationHistory(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT a.id, a.lead_id, a.counselor_id, c.name AS counselor_name, a.allocated_at, a.allocated_by
       FROM allocations a
       INNER JOIN counselors c ON c.id = a.counselor_id
       WHERE a.lead_id = ?
       ORDER BY a.allocated_at DESC`,
      [req.params.id],
    );

    res.json(rows);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  allocateLead,
  getLeadAllocationHistory,
};
