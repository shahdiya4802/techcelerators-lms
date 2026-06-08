const { pool } = require('../config/database');

const leadSelect = `
  SELECT id, name, phone, email, source, course, city, state, connectivity_status, current_status, assigned_to, created_at, updated_at
  FROM leads
`;

function buildPagination(page = 1, limit = 20) {
  const normalizedLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const normalizedPage = Math.max(Number(page) || 1, 1);
  const offset = (normalizedPage - 1) * normalizedLimit;

  return { normalizedLimit, normalizedPage, offset };
}

async function createLead(req, res, next) {
  try {
    const {
      name,
      phone,
      email,
      source,
      course,
      city,
      state,
      connectivity_status,
      current_status,
      assigned_to,
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO leads
      (name, phone, email, source, course, city, state, connectivity_status, current_status, assigned_to)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, phone, email || null, source, course || null, city || null, state || null, connectivity_status, current_status, assigned_to || null],
    );

    const [rows] = await pool.query(`${leadSelect} WHERE id = ?`, [result.insertId]);

    await pool.query(
      `INSERT INTO lead_activity (lead_id, action_type, old_value, new_value, performed_by)
       VALUES (?, 'note_added', NULL, ?, ?)`,
      [result.insertId, 'Lead created', 'system'],
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    if (error && error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Lead with this phone already exists' });
    }

    return next(error);
  }
}

async function listLeads(req, res, next) {
  try {
    const { page, limit } = req.query;
    const { normalizedLimit, normalizedPage, offset } = buildPagination(page, limit);

    const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM leads');
    const [rows] = await pool.query(`${leadSelect} ORDER BY created_at DESC LIMIT ? OFFSET ?`, [normalizedLimit, offset]);

    res.json({
      data: rows,
      pagination: {
        page: normalizedPage,
        limit: normalizedLimit,
        total,
        totalPages: Math.ceil(total / normalizedLimit),
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getLeadById(req, res, next) {
  try {
    const [rows] = await pool.query(`${leadSelect} WHERE id = ?`, [req.params.id]);

    if (!rows.length) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    return res.json(rows[0]);
  } catch (error) {
    return next(error);
  }
}

async function updateLead(req, res, next) {
  try {
    const updatableFields = ['name', 'phone', 'email', 'source', 'course', 'city', 'state', 'connectivity_status', 'current_status', 'assigned_to'];
    const updates = [];
    const values = [];

    updatableFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates.push(`${field} = ?`);
        values.push(req.body[field]);
      }
    });

    if (!updates.length) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    const [existingRows] = await pool.query(`${leadSelect} WHERE id = ?`, [req.params.id]);

    if (!existingRows.length) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    values.push(req.params.id);

    await pool.query(`UPDATE leads SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, values);

    const [updatedRows] = await pool.query(`${leadSelect} WHERE id = ?`, [req.params.id]);

    await pool.query(
      `INSERT INTO lead_activity (lead_id, action_type, old_value, new_value, performed_by)
       VALUES (?, 'status_change', ?, ?, ?)`,
      [req.params.id, JSON.stringify(existingRows[0]), JSON.stringify(updatedRows[0]), 'system'],
    );

    return res.json(updatedRows[0]);
  } catch (error) {
    if (error && error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Lead with this phone already exists' });
    }

    return next(error);
  }
}

async function searchLeads(req, res, next) {
  try {
    const { source, status, connectivity, assigned_to, page, limit } = req.query;
    const { normalizedLimit, normalizedPage, offset } = buildPagination(page, limit);

    const filters = [];
    const params = [];

    if (source) {
      filters.push('source = ?');
      params.push(source);
    }

    if (status) {
      filters.push('current_status = ?');
      params.push(status);
    }

    if (connectivity) {
      filters.push('connectivity_status = ?');
      params.push(connectivity);
    }

    if (assigned_to) {
      filters.push('assigned_to = ?');
      params.push(assigned_to);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM leads ${whereClause}`,
      params,
    );

    const [rows] = await pool.query(
      `${leadSelect} ${whereClause} ORDER BY updated_at DESC LIMIT ? OFFSET ?`,
      [...params, normalizedLimit, offset],
    );

    res.json({
      data: rows,
      pagination: {
        page: normalizedPage,
        limit: normalizedLimit,
        total: countRows[0].total,
        totalPages: Math.ceil(countRows[0].total / normalizedLimit),
      },
      filters: {
        source: source || null,
        status: status || null,
        connectivity: connectivity || null,
        assigned_to: assigned_to || null,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createLead,
  listLeads,
  getLeadById,
  updateLead,
  searchLeads,
};
